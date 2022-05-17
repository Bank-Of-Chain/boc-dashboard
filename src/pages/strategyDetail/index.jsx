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
import { VAULT_TYPE, TOKEN_DISPLAY_DECIMALS } from '@/constants/vault'
import { ETHI_DISPLAY_DECIMALS } from '@/constants/ethi'

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
import {
  getStrategyApysOffChain,
  getBaseApyByPage,
  getStrategyDetails,
  getStrategyEstimateApys,
} from '@/services/api-service'

// === Styles === //
import styles from './style.less'

const Strategy = props => {
  const { id, official_daily_apy = false } = props?.location?.query
  const [loading, setLoading] = useState(false)
  const [strategy, setStrategy] = useState({})
  //TODO: 旧的逻辑，待删除
  const [apysEchartOpt, setApysEchartOpt] = useState({})
  const [apys, setApys] = useState([])
  const [offChainApys, setOffChainApys] = useState([])
  // 用于存放所有的apy数据，取代上面的apys和offchainApys
  const [apyArray, setApyArray] = useState([])
  const { initialState } = useModel('@@initialState')
  const deviceType = useDeviceType()
  const unit = {
    [VAULT_TYPE.USDi]: 'USD',
    [VAULT_TYPE.ETHi]: 'ETH',
  }[initialState.vault]

  // boc-service fixed the number to 6
  const decimals = BN(1e6)

  const strategiesMap = {
    [VAULT_TYPE.USDi]: USDI_STRATEGIES_MAP,
    [VAULT_TYPE.ETHi]: ETHI_STRATEGIES_MAP,
  }[initialState.vault]

  const displayDecimals = {
    [VAULT_TYPE.USDi]: TOKEN_DISPLAY_DECIMALS,
    [VAULT_TYPE.ETHi]: ETHI_DISPLAY_DECIMALS,
  }[initialState.vault]

  useEffect(() => {
    setLoading(true)
    getStrategyDetails(initialState.chain, initialState.vaultAddress, 0, 100)
      .then(resp => {
        const strategy = _find(resp.content, item => item.strategyAddress === id)
        setStrategy(strategy)
      })
      .catch(noop)
      .finally(() => {
        setLoading(false)
      })
    // eslint-disable-next-line
  }, [id])

  useEffect(() => {
    if (isEmpty(strategy?.strategyName)) return
    Promise.all([
      getBaseApyByPage(
        {
          chainId: initialState.chain,
          vaultAddress: initialState.vaultAddress,
          strategyName: strategy?.strategyName,
          sort: 'fetch_block desc',
        },
        0,
        100,
      )
        .then(rs => {
          // TODO: 旧的逻辑，待删除
          // 一天可能返回两个值，取 timestamp 大的
          const baseApys = map(rs.content, i => {
            return {
              value: i.lpApy,
              timestamp: i.fetchTimestamp,
              date: formatToUTC0(1000 * i.fetchTimestamp, 'yyyy-MM-DD'),
            }
          })
          const groupApys = groupBy(baseApys, item => item.date)
          setApys(map(groupApys, group => sortBy(group, o => o.timestamp).pop()))
          return rs
        })
        .catch(() => {}),
      getStrategyApysOffChain(
        {
          chainId: initialState.chain,
          strategyName: strategy?.strategyName,
          sort: 'fetch_time desc',
        },
        0,
        100,
      )
        .then(rs => {
          // TODO: 旧的逻辑，待删除
          setOffChainApys(
            map(rs.content, i => {
              return {
                value: i.apy,
                date: formatToUTC0(i.fetchTime, 'yyyy-MM-DD'),
              }
            }),
          )
          return rs
        })
        .catch(() => {}),
      getStrategyEstimateApys(
        initialState.chain,
        initialState.vaultAddress,
        strategy?.strategyName,
      ).catch(() => {}),
    ]).then(([apys, offChainApys, unRealizeApys]) => {
      const startMoment = moment()
        .utcOffset(0)
        .subtract(66, 'day')
        .startOf('day')
      const calcArray = reduce(
        // 往前推66天，往后预估7天
        new Array(66 + 7),
        rs => {
          const currentMoment = startMoment.subtract(-1, 'day')
          rs.push(currentMoment.format('yyyy-MM-DD'))
          return rs
        },
        [],
      )
      const baseApys = map(apys.content, i => {
        return {
          date: formatToUTC0(1000 * i.fetchTimestamp, 'yyyy-MM-DD'),
          apy: (i.lpApy * 100).toFixed(2),
        }
      })
      const groupApys = groupBy(baseApys, item => item.date)
      const baseApysMap = keyBy(
        map(groupApys, group => sortBy(group, o => o.timestamp).pop()),
        'date',
      )

      const unRealizeApyMap = keyBy(
        map(unRealizeApys.content, i => {
          return {
            ...i,
            date: formatToUTC0(1000 * i.date, 'yyyy-MM-DD'),
          }
        }),
        'date',
      )

      const offChainApyMap = keyBy(
        map(offChainApys.content, i => {
          return {
            value: 100 * i.apy,
            apy: (i.apy * 100).toFixed(2),
            date: formatToUTC0(i.fetchTime, 'yyyy-MM-DD'),
          }
        }),
        'date',
      )

      const getWeeklyAvgApy = day => {
        const index = findIndex(calcArray, _ => _ === day)
        let firstValidIndex = -1
        for (let i = index; i >= 0; i--) {
          if (get(offChainApyMap, `${calcArray[i]}.value`, null)) {
            firstValidIndex = i
            break
          }
        }
        if (firstValidIndex === -1) {
          return
        }
        const weeklyArray = calcArray.slice(Math.max(0, firstValidIndex - 6), firstValidIndex + 1)
        const values = map(weeklyArray, day => get(offChainApyMap, `${day}.value`, null)).filter(
          _ => !isNil(_),
        )
        if (values.length === 0) {
          return
        }
        return sum(values) / values.length
      }

      const nextApyArray = map(calcArray, i => {
        const baseApyItem = get(baseApysMap, `${i}.apy`, null)
        const offChainApyItem = get(offChainApyMap, `${i}.apy`, null)
        const unRealizeApyItem = get(unRealizeApyMap, `${i}.apy`, null)
        const weeklyApyItem = getWeeklyAvgApy(i)
        return {
          date: i,
          apy: isNil(baseApyItem) ? null : baseApyItem,
          un_realize_apy: isNil(unRealizeApyItem) ? null : unRealizeApyItem,
          official_daily_apy: isNil(offChainApyItem) ? null : offChainApyItem,
          weekly_avg_apy: isNil(weeklyApyItem) ? null : weeklyApyItem.toFixed(2)
        }
      })
      setApyArray(nextApyArray.slice(-67))
    })
  }, [strategy, strategy?.strategyName])

  // TODO: 旧的逻辑，待删除
  // useEffect(() => {
  //   const startMoment = moment()
  //     .utcOffset(0)
  //     .subtract(66, 'day')
  //     .startOf('day')
  //   const calcArray = reduce(
  //     new Array(66),
  //     rs => {
  //       const currentMoment = startMoment.subtract(-1, 'day')
  //       rs.push(currentMoment.format('yyyy-MM-DD'))
  //       return rs
  //     },
  //     [],
  //   )
  //   const dayArray = calcArray.slice(-60)
  //   const apyMap = keyBy(apys, 'date')

  //   const officialApyMap = keyBy(offChainApys, 'date')
  //   const bocApy = []
  //   const officialApy = []
  //   const weeklyOfficialApy = []
  //   // 计算 7 天平均 APY，当天没点，查找最近一天有点开始
  //   const getWeeklyAvgApy = day => {
  //     const index = findIndex(calcArray, _ => _ === day)
  //     let firstValidIndex = -1
  //     for (let i = index; i >= 0; i--) {
  //       if (get(officialApyMap, `${calcArray[i]}.value`, null)) {
  //         firstValidIndex = i
  //         break
  //       }
  //     }
  //     if (firstValidIndex === -1) {
  //       return
  //     }
  //     const weeklyArray = calcArray.slice(Math.max(0, firstValidIndex - 6), firstValidIndex + 1)
  //     const values = map(weeklyArray, day => get(officialApyMap, `${day}.value`, null)).filter(
  //       _ => !isNil(_),
  //     )
  //     if (values.length === 0) {
  //       return
  //     }
  //     return sum(values) / values.length
  //   }
  //   dayArray.forEach(day => {
  //     const value1 = get(apyMap, `${day}.value`, null)
  //     bocApy.push(isNil(value1) ? null : Number(value1 * 100).toFixed(2))
  //     const value2 = get(officialApyMap, `${day}.value`, null)
  //     officialApy.push(isNil(value2) ? null : Number(value2 * 100).toFixed(2))
  //     const value3 = getWeeklyAvgApy(day)
  //     weeklyOfficialApy.push(isNil(value3) ? null : Number(value3 * 100).toFixed(2))
  //   })
  //   const lengndData = ['Weekly APY', 'Official Weekly APY']
  //   const data = [
  //     {
  //       seriesName: 'Weekly APY',
  //       seriesData: bocApy,
  //     },
  //     {
  //       seriesName: 'Official Weekly APY',
  //       seriesData: weeklyOfficialApy,
  //     }
  //   ]
  //   if (official_daily_apy) {
  //     lengndData.push('Official Daily APY')
  //     data.push({
  //       seriesName: 'Official Daily APY',
  //       seriesData: officialApy,
  //     })
  //   }
  //   let obj = {
  //     legend: {
  //       data: lengndData,
  //       textStyle: { color: '#fff' },
  //     },
  //     xAxisData: dayArray,
  //     data,
  //   }
  //   const option = multipleLine(obj)
  //   option.color = ['#5470c6', '#fac858', '#91cc75']
  //   option.series.forEach(serie => {
  //     serie.connectNulls = true
  //   })
  //   option.xAxis.data = option.xAxis.data.map(item => `${item} (UTC)`)
  //   option.xAxis.axisLabel = {
  //     formatter: value => value.replace(' (UTC)', ''),
  //   }
  //   option.xAxis.axisTick = {
  //     alignWithLabel: true,
  //   }
  //   option.yAxis.splitLine = {
  //     lineStyle: {
  //       color: 'black',
  //     },
  //   }
  //   setApysEchartOpt(option)
  // }, [apys, offChainApys, official_daily_apy])


  const lengndData = ['Weekly APY', 'Official Weekly APY', 'UnRealized APY']
  const data = [
    {
      seriesName: 'Weekly APY',
      seriesData: map(apyArray, 'apy'),
    },
    {
      seriesName: 'Official Weekly APY',
      seriesData: map(apyArray, 'weekly_avg_apy'),
    },
    {
      seriesName: 'UnRealized APY',
      seriesData: map(apyArray, 'un_realize_apy'),
    },
  ]
  if (official_daily_apy) {
    lengndData.push('Official Daily APY')
    data.push({
      seriesName: 'Official Daily APY',
      seriesData: map(apyArray, 'official_daily_apy'),
    })
  }
  let obj = {
    legend: {
      data: lengndData,
      textStyle: { color: '#fff' },
    },
    xAxisData: map(apyArray, 'date'),
    data,
  }
  const option = multipleLine(obj)
  option.color =  ['#5470c6', '#fac858', '#13c2c2', '#91cc75']
  option.series.forEach(serie => {
    serie.connectNulls = true
  })
  option.xAxis.data = option.xAxis.data.map(item => `${item} (UTC)`)
  option.xAxis.axisLabel = {
    formatter: value => value.replace(' (UTC)', ''),
  }
  option.xAxis.axisTick = {
    alignWithLabel: true,
  }
  option.yAxis.splitLine = {
    lineStyle: {
      color: 'black',
    },
  }

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Spin size='large' />
      </div>
    )
  }
  if (!initialState.chain || isEmpty(strategy)) return null

  const { underlyingTokens, totalAssetBaseUsd } = strategy

  const smallSizeProps = {
    cardProps: {
      size: 'small',
    },
    descriptionProps: {
      size: 'small',
    },
  }
  const infoResponsiveConfig = {
    [DEVICE_TYPE.Desktop]: {},
    [DEVICE_TYPE.Tablet]: smallSizeProps,
    [DEVICE_TYPE.Mobile]: smallSizeProps,
  }[deviceType]

  const chartStyle = {
    padding: '0 24px',
    height: 400,
  }
  const chartResponsiveConfig = {
    [DEVICE_TYPE.Desktop]: {
      chartStyle,
    },
    [DEVICE_TYPE.Tablet]: {
      cardProps: {
        size: 'small',
      },
      chartStyle,
    },
    [DEVICE_TYPE.Mobile]: {
      cardProps: {
        size: 'small',
      },
      chartStyle: {
        ...chartStyle,
        height: 280,
      },
    },
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
                    href={`${CHAIN_BROWSER_URL[initialState.chain]}/address/${
                      strategy.strategyAddress
                    }`}
                  >
                    {strategy.strategyName}
                  </a>
                </Descriptions.Item>
                <Descriptions.Item label='Underlying Token'>
                  &nbsp;&nbsp;
                  <CoinSuperPosition array={underlyingTokens} />
                </Descriptions.Item>
                <Descriptions.Item label='Asset Value'>
                  {toFixed(totalAssetBaseUsd, decimals, displayDecimals) + ` ${unit}`}
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
          {...chartResponsiveConfig.cardProps}
        >
          <div style={chartResponsiveConfig.chartStyle}>
            <LineEchart option={option} style={{ height: '100%', width: '100%' }} />
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
