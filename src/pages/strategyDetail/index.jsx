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
import { useDeviceType, DEVICE_TYPE } from '@/components/Container/Container'

// === Utils === //
import { isEmpty, map, noop, reduce, groupBy, sortBy } from 'lodash'
import { toFixed } from '@/utils/number-format'
import { USDI_BN_DECIMALS } from '@/constants/usdi'

import moment from 'moment'
import _union from 'lodash/union'
import _find from 'lodash/find'
import { get, isNil, keyBy, sum } from 'lodash'
import { formatToUTC0 } from '@/utils/date'

// === Services === //
import { getStrategyById } from '@/services/dashboard-service'
import { getStrategyApysOffChain, getBaseApyByPage } from '@/services/api-service'

// === Styles === //
import styles from './style.less'

const Strategy = props => {
  const { id, official_daily_apy = false } = props?.location?.query
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
    // eslint-disable-next-line
  }, [id])

  useEffect(() => {
    if(isEmpty(strategy?.name)) return;
    getBaseApyByPage(
      { chainId: initialState.chain, strategyName: strategy?.name, sort: 'fetch_block desc' },
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
    getStrategyApysOffChain({ chainId: initialState.chain, strategyName: strategy?.name, sort: 'fetch_time desc' }, 0, 100)
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

  }, [strategy, strategy?.name])

  useEffect(() => {
    const startMoment = moment()
      .utcOffset(0)
      .subtract(66, 'day')
      .startOf('day')
    const calcArray = reduce(
      new Array(66),
      (rs) => {
        const currentMoment = startMoment.subtract(-1, 'day')
        rs.push(currentMoment.format('yyyy-MM-DD'))
        return rs
      },
      [],
    )
    const dayArray = calcArray.slice(6)
    const apyMap = keyBy(apys, 'date')

    const officialApyMap = keyBy(offChainApys, 'date')
    const bocApy = []
    const officialApy = []
    const weeklyOfficialApy = []
    const getWeeklyAvgApy = (index) => {
      const weeklyArray = calcArray.slice(index, index + 7)
      const values = map(weeklyArray, (day) => get(officialApyMap, `${day}.value`, null)).filter(_ => !isNil(_))
      if (values.length === 0) {
        return
      }
      return sum(values) / values.length
    }
    dayArray.forEach((day, index) => {
      const value1 = get(apyMap, `${day}.value`, null)
      bocApy.push(isNil(value1) ? null : Number(value1 * 100).toFixed(2))
      const value2 = get(officialApyMap, `${day}.value`, null)
      officialApy.push(isNil(value2) ? null : Number(value2 * 100).toFixed(2))
      const value3 = getWeeklyAvgApy(index)
      weeklyOfficialApy.push(isNil(value3) ? null : Number(value3 * 100).toFixed(2))
    })
    const lengndData = ['Weekly APY', 'Official Weekly APY']
    const data = [
      {
        seriesName: 'Weekly APY',
        seriesData: bocApy,
      },
      {
        seriesName: 'Official Weekly APY',
        seriesData: weeklyOfficialApy,
      }
    ]
    if (official_daily_apy) {
      lengndData.push('Official Daily APY')
      data.push({
        seriesName: 'Official Daily APY',
        seriesData: officialApy,
      })
    }
    let obj = {
      legend: {
        data: lengndData,
        textStyle: { color: '#fff' },
      },
      xAxisData: dayArray,
      data
    }
    const option = multipleLine(obj)
    option.color = ['#5470c6', '#fac858', '#91cc75']
    option.series.forEach(serie => {
      serie.connectNulls = true
    })
    option.xAxis.data = option.xAxis.data.map(item => `${item} (UTC)`)
    option.xAxis.axisLabel = {
      formatter: (value) => value.replace(' (UTC)', '')
    }
    option.xAxis.axisTick = {
      alignWithLabel: true,
    }
    option.yAxis.splitLine = {
      lineStyle: {
        color: 'black',
      },
    }
    setApysEchartOpt(option)
  }, [apys, offChainApys, official_daily_apy])

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
    [DEVICE_TYPE.Desktop]: {},
    [DEVICE_TYPE.Tablet]: smallSizeProps,
    [DEVICE_TYPE.Mobile]: smallSizeProps
  }[deviceType]

  const chartStyle = {
    padding: '0 24px',
    height: 400,
  }
  const chartResponsiveConfig = {
    [DEVICE_TYPE.Desktop]: {
      chartStyle
    },
    [DEVICE_TYPE.Tablet]: {
      cardProps: {
        size: 'small'
      },
      chartStyle
    },
    [DEVICE_TYPE.Mobile]: {
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
                fallback={`${IMAGE_ROOT}/default.png`}
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
                  {toFixed(totalValue, USDI_BN_DECIMALS, 2) + ' USD'}
                </Descriptions.Item>
                {/* <Descriptions.Item label='Total Investments'>
                  {toFixed(depositedAssets, USDI_BN_DECIMALS, 2) + ' USDi'}
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
        <ReportTable chainId={initialState.chain} strategyName={strategy?.name} loading={loading} />
      </Suspense>
    </GridContent>
  )
}

export default Strategy
