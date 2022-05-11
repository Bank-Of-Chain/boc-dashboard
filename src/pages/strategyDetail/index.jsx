import { Suspense, useState, useEffect } from 'react'
import { Col, Row, Card, Image, Descriptions, Spin } from 'antd'
import { GridContent } from '@ant-design/pro-layout'
import ReportTable from './components/ReportTable'
import { history, useModel } from 'umi'
import { LeftOutlined } from '@ant-design/icons'
import { LineEchart } from '@/components/echarts'
import multipleLine from '@/components/echarts/options/line/multipleLine'

// === Constants === //
import { USDI_STRATEGIES_MAP, ETHI_STRATEGIES_MAP } from '@/constants/strategies'
import { VAULT_TYPE } from '@/constants/vault'

// === Components === //
import CoinSuperPosition from '@/components/CoinSuperPosition'
import { useDeviceType, DEVICE_TYPE } from '@/components/Container/Container'

// === Utils === //
import { isEmpty, map, noop, reduce, groupBy, sortBy, findIndex } from 'lodash'
import { toFixed } from '@/utils/number-format'

import moment from 'moment'
import _union from 'lodash/union'
import _find from 'lodash/find'
import BN from 'bignumber.js'
import { get, isNil, keyBy, sum } from 'lodash'
import { formatToUTC0 } from '@/utils/date'

// === Services === //
import { getStrategyApysOffChain, getBaseApyByPage, getStrategyDetails } from '@/services/api-service'

// === Styles === //
import styles from './style.less'

const Strategy = props => {
  const { id, official_daily_apy = false } = props?.location?.query
  const [loading, setLoading] = useState(false)
  const [strategy, setStrategy] = useState({})
  const [apysEchartOpt, setApysEchartOpt] = useState({})
  const [apys, setApys] = useState([])
  const [offChainApys, setOffChainApys] = useState([])
  const { initialState } = useModel('@@initialState')
  const deviceType = useDeviceType()

  const unit = {
    [VAULT_TYPE.USDi]: 'USD',
    [VAULT_TYPE.ETHi]: 'ETH'
  }[initialState.vault]

  // boc-service fixed the number to 6
  const decimals = BN(1e6)

  const strategiesMap = {
    [VAULT_TYPE.USDi]: USDI_STRATEGIES_MAP,
    [VAULT_TYPE.ETHi]: ETHI_STRATEGIES_MAP
  }[initialState.vault]

  useEffect(() => {
    setLoading(true)
    getStrategyDetails(initialState.chain, initialState.vaultAddress, 0, 100)
      .then((resp) => {
        const strategy = _find(resp.content, (item) => item.strategyAddress === id)
        setStrategy(strategy)
      })
      .catch(noop)
      .finally(() => {
        setLoading(false)
      })
    // eslint-disable-next-line
  }, [id])

  useEffect(() => {
    if(isEmpty(strategy?.strategyName)) return;
    getBaseApyByPage(
      {
        chainId: initialState.chain,
        vaultAddress: initialState.vaultAddress,
        strategyName: strategy?.strategyName,
        sort: 'fetch_block desc'
      },
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
    getStrategyApysOffChain({ chainId: initialState.chain, strategyName: strategy?.strategyName, sort: 'fetch_time desc' }, 0, 100)
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

  }, [strategy, strategy?.strategyName])

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
    const dayArray = calcArray.slice(-60)
    const apyMap = keyBy(apys, 'date')

    const officialApyMap = keyBy(offChainApys, 'date')
    const bocApy = []
    const officialApy = []
    const weeklyOfficialApy = []
    // 计算 7 天平均 APY，当天没点，查找最近一天有点开始
    const getWeeklyAvgApy = (day) => {
      const index = findIndex(calcArray, _ => _ === day)
      let firstValidIndex = -1
      for (let i = index; i >= 0; i--) {
        if (get(officialApyMap, `${calcArray[i]}.value`, null)) {
          firstValidIndex = i
          break
        }
      }
      if (firstValidIndex === -1) {
        return
      }
      const weeklyArray = calcArray.slice(Math.max(0, firstValidIndex - 6), firstValidIndex + 1)
      const values = map(weeklyArray, (day) => get(officialApyMap, `${day}.value`, null)).filter(_ => !isNil(_))
      if (values.length === 0) {
        return
      }
      return sum(values) / values.length
    }
    dayArray.forEach((day) => {
      const value1 = get(apyMap, `${day}.value`, null)
      bocApy.push(isNil(value1) ? null : Number(value1 * 100).toFixed(2))
      const value2 = get(officialApyMap, `${day}.value`, null)
      officialApy.push(isNil(value2) ? null : Number(value2 * 100).toFixed(2))
      const value3 = getWeeklyAvgApy(day)
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

  if (loading) {
    return <div className={styles.loadingContainer}><Spin size="large" /></div>
  }
  if (!initialState.chain || isEmpty(strategy)) return null

  const { underlyingTokens, totalAsset } = strategy

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
                  strategiesMap[initialState.chain][strategy?.protocol]
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
                    href={`${CHAIN_BROWSER_URL[initialState.chain]}/address/${strategy.strategyAddress}`}
                  >
                    {strategy.strategyName}
                  </a>
                </Descriptions.Item>
                <Descriptions.Item label='Underlying Token'>
                  &nbsp;&nbsp;
                  <CoinSuperPosition array={underlyingTokens} />
                </Descriptions.Item>
                <Descriptions.Item label='Asset Value'>
                  {toFixed(totalAsset, decimals, 2) + ` ${unit}`}
                </Descriptions.Item>
                <Descriptions.Item label='Status'>
                  Active
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
        <ReportTable strategyName={strategy?.strategyName} loading={loading} />
      </Suspense>
    </GridContent>
  )
}

export default Strategy
