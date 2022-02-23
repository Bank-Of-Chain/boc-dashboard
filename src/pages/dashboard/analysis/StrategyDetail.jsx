import { Suspense, useEffect } from 'react'
import { Col, Row, Card, Image, Descriptions } from 'antd'
import { GridContent } from '@ant-design/pro-layout'
import ReportTable from './components/ReportTable'
import { history, useModel } from 'umi'
import { LeftOutlined } from '@ant-design/icons'
import { LineEchart } from '@/components/echarts'
import multipleLine from '@/components/echarts/options/line/multipleLine'
import _union from 'lodash/union'
import _find from 'lodash/find'

// === Constants === //
import STRATEGIES_MAP from '../../../constants/strategies'

// === Components === //
import CoinSuperPosition from './components/CoinSuperPosition/index'

// === Utils === //
import { toFixed } from '../../../helper/number-format'
import { getDecimals } from '../../../apollo/client'
import moment from 'moment'

// === Services === //
import { getStrategyById } from '../../../services/dashboard-service'
import { getStrategyApysOffChain, getBaseApyByPage } from '../../../services/api-service'

// === Styles === //
import styles from './style.less'
import { isEmpty, map, noop } from 'lodash'
import { useState } from 'react'

const Strategy = props => {
  const { id } = props?.location?.query
  const loading = false
  const [strategy, setStrategy] = useState({})
  const [apysEchartOpt, setApysEchartOpt] = useState({})
  const [apys, setApys] = useState([])
  const [offChainApys, setOffChainApys] = useState([])
  const { initialState } = useModel('@@initialState')

  useEffect(() => {
    getStrategyById(id)
      .then(setStrategy)
      .catch(noop)
    // getStrategyApysInChain(id, 0, 100)
    //   .then((rs) =>
    //     map(rs.content, (i) => {
    //       return {
    //         value: i.apy,
    //         date: i.apyValidateTime,
    //       };
    //     }),
    //   )
    //   .then(setApys);
    getBaseApyByPage({ chainId: initialState.chain, strategyAddress: id, sort: 'fetch_block desc' }, 0, 100).then(rs =>
      map(rs.content, i => {
        return {
          value: i.lpApy / 100,
          date: moment(1000 * i.fetchTimestamp).format('yyyy-MM-DD'),
        }
      }),
    )
    .then(setApys)
    .catch(noop)
    getStrategyApysOffChain(id, 0, 100)
      .then(rs =>
        map(rs.content, i => {
          return {
            value: i.apy,
            date: i.apyValidateTime,
          }
        }),
      )
      .then(setOffChainApys)
      .catch(noop)
  }, [id])

  useEffect(() => {
    let dates = _union(
      apys.map(o => {
        return o.date;
      }),
      offChainApys.map(o => {
        return o.date
      }),
    ).sort()
    let bocApy = [];
    let officialApy = []
    for (let i = 0; i < dates.length; i++) {
        let apy = _find(apys, {'date': dates[i]});
        if(apy && apy.value){
          apy = Number(apy.value * 100).toFixed(2);
        }else{
          apy = null;
        }
        bocApy.push(apy);
      let offChainApy = _find(offChainApys, { date: dates[i] })
      if (offChainApy && offChainApy.value) {
        offChainApy = Number(offChainApy.value * 100).toFixed(2)
      } else {
        offChainApy = null
      }
      officialApy.push(offChainApy)
    }
    let obj = {
      legend: { data: ['Official APY', 'LP APY'], textStyle: { color: '#fff' } },
      xAxisData: dates,
      data: [
          {
          "seriesName":'LP APY',
          "seriesData": bocApy,
          "color": 'rgba(169, 204, 245, 1)'
        },
        {
          seriesName: 'Official APY',
          seriesData: officialApy,
          color: 'rgba(86, 122, 246, 1)',
        },
      ],
    }
    const option = multipleLine(obj)
    option.series.forEach(serie => {
      serie.connectNulls = true
    })
    option.yAxis.splitLine = {
      lineStyle: {
        color: 'black',
      },
    }
    setApysEchartOpt(option)
  }, [offChainApys])

  if (!initialState.chain || isEmpty(strategy)) return null
  const { underlyingTokens, depositedAssets } = strategy
  return (
    <GridContent>
      <Suspense fallback={null}>
        <Card title={<LeftOutlined onClick={() => history.push('/')} />} bordered={false}>
          <Row justify='space-around'>
            <Col xl={8} lg={8} md={8} sm={22} xs={22} style={{ margin: '0 auto' }}>
              <Image
                preview={false}
                width={200}
                style={{ backgroundColor: '#fff', borderRadius: '50%' }}
                src={`https://bankofchain.io/images/amms/${
                  STRATEGIES_MAP[initialState.chain][strategy?.protocol.id]
                }.png`}
                fallback={'https://bankofchain.io/default.webp'}
              />
            </Col>
            <Col xl={10} lg={10} md={10} sm={22} xs={22}>
              <Descriptions
                column={1}
                title='Base Info'
                style={{
                  marginBottom: 32,
                }}
              >
                <Descriptions.Item label='name'>
                  <a
                    target={'_blank'}
                    rel='noreferrer'
                    href={`${CHAIN_BROWSER_URL[initialState.chain]}/address/${strategy.id}`}
                  >
                    {strategy.name}
                  </a>
                </Descriptions.Item>
                <Descriptions.Item label='Underlying Token'>
                  &nbsp;&nbsp;
                  <CoinSuperPosition array={map(underlyingTokens, 'token.id')} />
                </Descriptions.Item>
                <Descriptions.Item label='Asset Value'>
                  {toFixed(depositedAssets, getDecimals(), 2) + ' USDT'}
                </Descriptions.Item>
                <Descriptions.Item label='Status'>Active</Descriptions.Item>
              </Descriptions>
            </Col>
          </Row>
        </Card>
      </Suspense>
      <Suspense fallback={null}>
        <Card
          loading={loading}
          title='Apy'
          className={styles.offlineCard}
          bordered={false}
          style={{
            marginTop: 32,
          }}
        >
          <div
            style={{
              padding: '0 24px',
              height: 400,
            }}
          >
            <LineEchart option={apysEchartOpt} style={{ height: '100%', width: '100%' }} />
          </div>
        </Card>
      </Suspense>
      <Suspense fallback={null}>
        <ReportTable loading={loading} visitData={strategy.reports || []} />
      </Suspense>
    </GridContent>
  )
}

export default Strategy
