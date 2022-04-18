import { Suspense, useState, useEffect } from 'react'
import { Col, Row, Card, Image, Descriptions } from 'antd'
import { GridContent } from '@ant-design/pro-layout'
import ReportTable from './components/ReportTable'
import { history, useModel } from 'umi'
import { LeftOutlined } from '@ant-design/icons'
import { LineEchart } from '@/components/echarts'
import multipleLine from '@/components/echarts/options/line/multipleLine'

// === Constants === //
import STRATEGIES_MAP from '@/constants/strategies'

// === Components === //
import CoinSuperPosition from '@/components/CoinSuperPosition'
import { useDeviceType, MEDIA_TYPE } from '@/components/Container/Container'

// === Utils === //
import { isEmpty, map, noop, reduce, groupBy, sortBy } from 'lodash'
import { toFixed } from '@/utils/number-format'
import { getDecimals } from '@/apollo/client'
import moment from 'moment'
import _union from 'lodash/union'
import _find from 'lodash/find'
import { get, isNil, keyBy } from 'lodash'
import { formatToUTC0 } from '@/utils/date'

// === Services === //
import { getStrategyById } from '@/services/dashboard-service'
import { getStrategyApysOffChain, getBaseApyByPage } from '@/services/api-service'

// === Styles === //
import styles from './style.less'

const Strategy = props => {
  const { id } = props?.location?.query
  const loading = false
  const [strategy, setStrategy] = useState({})
  const [apysEchartOpt, setApysEchartOpt] = useState({})
  const [apys, setApys] = useState([])
  const [offChainApys, setOffChainApys] = useState([])
  const { initialState } = useModel('@@initialState')
  const deviceType = useDeviceType()

  useEffect(() => {
    getStrategyById(id)
      .then(setStrategy)
      .catch(noop)
    getBaseApyByPage(
      { chainId: initialState.chain, strategyAddress: id, sort: 'fetch_block desc' },
      0,
      100,
    )
      .then(rs => {
        // 一天可能返回两个值，取 timestamp 大的
        const baseApys = map(rs.content, i => {
          return {
            value: i.lpApy,
            timestamp: i.fetchTimestamp,
            date: formatToUTC0(1000 * i.fetchTimestamp, 'yyyy-MM-DD'),
          }
        })
        const groupApys = groupBy(baseApys, (item) => item.date)
        return map(groupApys, (group) => sortBy(group, o => o.timestamp).pop())
      })
      .then(setApys)
      .catch(noop)
    getStrategyApysOffChain(id, 0, 100)
      .then(rs =>
        map(rs.content, i => {
          return {
            value: i.apy,
            date: formatToUTC0(i.fetchTime, 'yyyy-MM-DD'),
          }
        }),
      )
      .then(setOffChainApys)
      .catch(noop)
    // eslint-disable-next-line
  }, [id])

  useEffect(() => {
    const startMoment = moment()
      .utcOffset(0)
      .subtract(60, 'day')
      .startOf('day')
    const dayArray = reduce(
      new Array(60),
      (rs) => {
        const currentMoment = startMoment.subtract(-1, 'day')
        rs.push(currentMoment.format('yyyy-MM-DD'))
        return rs
      },
      [],
    )
    const apyMap = keyBy(apys, 'date')

    const officialApyMap = keyBy(offChainApys, 'date')
    const bocApy = []
    const officialApy = []
    dayArray.forEach(i => {
      const value1 = get(apyMap, `${i}.value`, null)
      bocApy.push(isNil(value1) ? null : Number(value1 * 100).toFixed(2))
      const value2 = get(officialApyMap, `${i}.value`, null)
      officialApy.push(isNil(value2) ? null : Number(value2 * 100).toFixed(2))
    })
    let obj = {
      legend: { data: ['Weekly APY', 'Official APY'], textStyle: { color: '#fff' } },
      xAxisData: dayArray,
      data: [
        {
          seriesName: 'Weekly APY',
          seriesData: bocApy,
          color: 'rgba(169, 204, 245, 1)',
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
    option.xAxis.data = option.xAxis.data.map(item => `${item} (UTC)`)
    option.xAxis.axisLabel = {
      formatter: (value) => value.replace(' (UTC)', '')
    }
    option.yAxis.splitLine = {
      lineStyle: {
        color: 'black',
      },
    }
    setApysEchartOpt(option)
  }, [apys, offChainApys])

  if (!initialState.chain || isEmpty(strategy)) return null
  const { positionDetail, totalValue } = strategy

  const smallSizeProps = {
    cardProps: {
      size: 'small'
    },
    descriptionProps: {
      size: 'small'
    }
  }
  const infoResponsiveConfig = {
    [MEDIA_TYPE.Desktop]: {},
    [MEDIA_TYPE.Tablet]: smallSizeProps,
    [MEDIA_TYPE.Mobile]: smallSizeProps
  }[deviceType]

  const chartStyle = {
    padding: '0 24px',
    height: 280,
  }
  const chartResponsiveConfig = {
    [MEDIA_TYPE.Desktop]: {
      chartStyle
    },
    [MEDIA_TYPE.Tablet]: {
      cardProps: {
        size: 'small'
      },
      chartStyle
    },
    [MEDIA_TYPE.Mobile]: {
      cardProps: {
        size: 'small'
      },
      chartStyle: {
        ...chartStyle,
        height: 280
      }
    }
  }[deviceType]

  return (
    <GridContent>
      <Suspense fallback={null}>
        <Card
          title={<LeftOutlined onClick={() => history.push('/')} />}
          bordered={false}
          {...infoResponsiveConfig.cardProps}
        >
          <Row justify='space-around'>
            <Col xl={8} lg={8} md={8} sm={22} xs={22} style={{ margin: '0 auto 16px' }}>
              <Image
                preview={false}
                width={200}
                style={{ backgroundColor: '#fff', borderRadius: '50%' }}
                src={`${IMAGE_ROOT}/images/amms/${
                  STRATEGIES_MAP[initialState.chain][strategy?.protocol]
                }.png`}
                fallback={`${IMAGE_ROOT}/default.webp`}
              />
            </Col>
            <Col xl={10} lg={10} md={10} sm={22} xs={22}>
              <Descriptions
                column={1}
                title={<span style={{ color: '#fff' }}>Base Info</span>}
                style={{
                  marginBottom: 32,
                }}
                labelStyle={{ color: '#fff' }}
                contentStyle={{ color: '#fff' }}
                {...infoResponsiveConfig.descriptionProps}
              >
                <Descriptions.Item label='Name'>
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
                  <CoinSuperPosition array={map(positionDetail, 'token.id')} />
                </Descriptions.Item>
                <Descriptions.Item label='Asset Value'>
                  {toFixed(totalValue, getDecimals(), 2) + ' USD'}
                </Descriptions.Item>
                {/* <Descriptions.Item label='Total Investments'>
                  {toFixed(depositedAssets, getDecimals(), 2) + ' USDi'}
                </Descriptions.Item> */}
                <Descriptions.Item label='Status'>
                  {strategy.isAdded ? 'Active' : 'Inactive'}
                </Descriptions.Item>
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
          {...chartResponsiveConfig.cardProps}
        >
          <div style={chartResponsiveConfig.chartStyle}>
            <LineEchart option={apysEchartOpt} style={{ height: '100%', width: '100%' }} />
          </div>
        </Card>
      </Suspense>
      <Suspense fallback={null}>
        <ReportTable chainId={initialState.chain} strategyAddress={id} loading={loading} />
      </Suspense>
    </GridContent>
  )
}

export default Strategy
