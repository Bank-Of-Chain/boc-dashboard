import React, { Suspense, useState, useEffect } from 'react'

// === Constants === //
import { USDI_STRATEGIES_MAP, ETHI_STRATEGIES_MAP } from '@/constants/strategies'
import { VAULT_TYPE, TOKEN_DISPLAY_DECIMALS } from '@/constants/vault'
import { ETHI_DISPLAY_DECIMALS } from '@/constants/ethi'

// === Components === //
import { LeftOutlined } from '@ant-design/icons'
import { LineEchart } from '@/components/echarts'
import ReportTable from './components/ReportTable'
import { GridContent } from '@ant-design/pro-layout'
import StrategyApyTable from './components/StrategyApyTable'
import CoinSuperPosition from '@/components/CoinSuperPosition'
import { Col, Row, Card, Image, Descriptions, Spin, Switch, Space } from 'antd'
import multipleLine from '@/components/echarts/options/line/multipleLine'
import { useDeviceType, DEVICE_TYPE } from '@/components/Container/Container'

// === Utils === //
import moment from 'moment'
import BN from 'bignumber.js'
import last from 'lodash/last'
import { history, useModel } from 'umi'
import { formatToUTC0 } from '@/utils/date'
import { toFixed, formatApyLabel, formatApyValue } from '@/utils/number-format'
import { bestIntervalForArrays } from '@/utils/echart-utils'
import { get, isNil, keyBy, size, filter, isEmpty, map, noop, reduce, find } from 'lodash'

// === Services === //
import { getStrategyApysOffChain, getBaseApyByPage, getStrategyDetails, getStrategyApyDetails } from '@/services/api-service'

// === Styles === //
import styles from './style.less'

const OFFICIAL_APY = 'Official Weekly APY'
const VERIFIED_APY = 'Verified Weekly APY'
const OFFICIAL_DAILY_APY = 'Official Daily APY'
const VERIFIED_DAILY_APY = 'Verified Daily APY'

const feeApyStatusMap = {
  0: 'Unrealized',
  1: 'Realized'
}

const getMarker = color => {
  return `<br/><span style="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:${color};"></span>`
}

const subMarker =
  '<br/><span style="display:inline-block;margin-right:4px;margin-left:10px;border-radius:10px;width:10px;height:10px;background-color:#fff;"></span>'

const Strategy = props => {
  const { id, ori = false, vault } = props?.location?.query
  const [loading, setLoading] = useState(false)
  const [apyLoading, setApyLoading] = useState(false)
  const [strategy, setStrategy] = useState({})
  // Save all apy data
  const [apyArray, setApyArray] = useState([])
  const { initialState } = useModel('@@initialState')
  const deviceType = useDeviceType()
  const unit = {
    [VAULT_TYPE.USDi]: 'USD',
    [VAULT_TYPE.ETHi]: 'ETH'
  }[initialState.vault]

  const [isOfficalApyEnable, setIsOfficalApyEnable] = useState(true)
  const [isVerifiedApyEnable, setIsVerifiedApyEnable] = useState(true)

  // boc-service fixed the number to 6
  const decimals = BN(1e18)

  const strategiesMap = {
    [VAULT_TYPE.USDi]: USDI_STRATEGIES_MAP,
    [VAULT_TYPE.ETHi]: ETHI_STRATEGIES_MAP
  }[initialState.vault]

  const displayDecimals = {
    [VAULT_TYPE.USDi]: TOKEN_DISPLAY_DECIMALS,
    [VAULT_TYPE.ETHi]: ETHI_DISPLAY_DECIMALS
  }[initialState.vault]

  useEffect(() => {
    setLoading(true)
    getStrategyDetails(initialState.chain, initialState.vaultAddress, 0, 100)
      .then(resp => {
        const strategy = find(resp.content, item => item.strategyAddress === id)
        setStrategy(strategy)
      })
      .catch(noop)
      .finally(() => {
        setLoading(false)
      })
  }, [id])

  useEffect(() => {
    if (isEmpty(strategy?.strategyName)) return
    setApyLoading(true)
    Promise.all([
      getBaseApyByPage(
        {
          chainId: initialState.chain,
          vaultAddress: initialState.vaultAddress,
          strategyAddress: strategy?.strategyAddress,
          sort: 'schedule_timestamp desc'
        },
        0,
        365
      ).catch(() => {}),
      getStrategyApysOffChain(
        {
          chainId: initialState.chain,
          strategyName: strategy?.strategyName,
          sort: 'fetch_time desc'
        },
        0,
        365
      ).catch(() => {}),
      getStrategyApyDetails(initialState.chain, initialState.vaultAddress, strategy?.strategyAddress, 0, 10)
    ])
      .then(([apys = { content: [] }, offChainApys, dailyApy]) => {
        const startMoment = moment().utcOffset(0).subtract(366, 'day').startOf('day')
        const calcArray = reduce(
          new Array(366),
          rs => {
            const currentMoment = startMoment.subtract(-1, 'day')
            rs.push(currentMoment.format('yyyy-MM-DD'))
            return rs
          },
          []
        )

        const offChainApyMap = keyBy(
          map(offChainApys.content, i => {
            return {
              value: 100 * i.apy,
              officialApy: (i.apy * 100).toFixed(2),
              originApy: (i.originApy * 100).toFixed(2),
              offcialDetail: i.detail,
              date: formatToUTC0(i.fetchTime * 1000, 'yyyy-MM-DD')
            }
          }),
          'date'
        )
        const extentApyMap = keyBy(
          map(apys.content, i => {
            return {
              realizedApy: (i.realizedApy?.value * 100).toFixed(2),
              realizedApyDetail: i.realizedApy?.detail,
              unrealizedApy: (i.unrealizedApy?.value * 100).toFixed(2),
              unrealizedApyDetail: i.unrealizedApy?.detail,
              expectedApy: (i.verifiedApy * 100).toFixed(2),
              dailyVerifiedApy: (i.dailyVerifiedApy * 100).toFixed(2),
              date: formatToUTC0(i.scheduleTimestamp * 1000, 'yyyy-MM-DD')
            }
          }),
          'date'
        )
        const lastDailyItem = last(filter(dailyApy, i => !isNil(i.apyValidateTime)))
        let preDayOfficialApy = null
        let hasMatch = false

        const nextApyArray = map(calcArray, i => {
          const { officialApy, originApy, offcialDetail } = get(offChainApyMap, i, {
            officialApy: null,
            originApy: null,
            offcialDetail: []
          })
          const { expectedApy, realizedApy, unrealizedApy, dailyVerifiedApy, realizedApyDetail, unrealizedApyDetail } = get(extentApyMap, i, {
            expectedApy: null,
            unrealizedApy: null,
            realizedApy: null,
            dailyVerifiedApy: null,
            realizedApyDetail: [],
            unrealizedApyDetail: []
          })
          const nextItem = {
            date: i,
            originApy,
            value: expectedApy,
            officialApy: hasMatch ? null : isNil(officialApy) ? preDayOfficialApy : officialApy,
            realizedApy,
            unrealizedApy,
            offcialDetail,
            realizedApyDetail,
            unrealizedApyDetail,
            dailyVerifiedApy
          }
          hasMatch = hasMatch || i === lastDailyItem?.apyValidateTime
          preDayOfficialApy = nextItem.officialApy
          return nextItem
        })
        setApyArray(nextApyArray)
      })
      .finally(() => {
        setApyLoading(false)
      })
  }, [strategy, strategy?.strategyName])

  const intervalArray = []
  const data1 = map(apyArray, i => {
    return {
      value: formatApyValue(i.officialApy),
      label: `${formatApyLabel(i.officialApy)}%`,
      unit: '%'
    }
  })
  const data2 = map(apyArray, 'value')
  const data = []

  if (isOfficalApyEnable) {
    data.push({
      seriesName: OFFICIAL_APY,
      seriesData: data1,
      showSymbol: size(filter(data1, i => !isNil(i.value))) === 1
    })
  } else {
    data.push({
      seriesName: OFFICIAL_APY,
      seriesData: [],
      showSymbol: false
    })
  }
  if (isVerifiedApyEnable) {
    data.push({
      seriesName: VERIFIED_APY,
      seriesData: apyArray.map(i => ({
        ...i,
        value: formatApyValue(i.value),
        label: `${formatApyLabel(i.value)}%`
      })),
      showSymbol: size(filter(data2, i => !isNil(i))) === 1
    })
  } else {
    data.push({
      seriesName: VERIFIED_APY,
      seriesData: [],
      showSymbol: false
    })
  }

  intervalArray.push(map(apyArray, 'officialApy'), data2)
  if (ori) {
    const data3 = map(apyArray, i => {
      return {
        value: formatApyValue(i.originApy),
        offcialDetail: i.offcialDetail,
        label: `${formatApyLabel(i.originApy)}%`,
        unit: '%'
      }
    })
    data.push({
      seriesName: OFFICIAL_DAILY_APY,
      seriesData: data3,
      showSymbol: size(filter(data3, i => !isNil(i.value))) === 1
    })

    const data4 = map(apyArray, i => {
      return {
        value: formatApyValue(i.dailyVerifiedApy),
        realizedApyDetail: i.realizedApyDetail,
        unrealizedApyDetail: i.unrealizedApyDetail,
        label: `${formatApyLabel(i.dailyVerifiedApy)}%`,
        unit: '%'
      }
    })
    data.push({
      seriesName: VERIFIED_DAILY_APY,
      seriesData: data4,
      showSymbol: size(filter(data4, i => !isNil(i.value))) === 1
    })
    intervalArray.push(data3)
    intervalArray.push(data4)
  }
  let obj = {
    legend: {
      data: [],
      textStyle: { color: '#fff' }
    },
    xAxisData: map(apyArray, 'date'),
    data
  }
  const option = multipleLine(obj)
  option.color = ['#CABBFF', '#7E6DD2', '#ffb980', '#d87a80', '#e5cf0d', '#97b552', '#8d98b3', '#07a2a4', '#95706d', '#dc69aa']
  option.series.forEach((serie, index) => {
    serie.connectNulls = false
    serie.z = option.series.length - index
    if (serie.name === 'Expected APY') {
      serie.lineStyle = {
        width: 5,
        type: 'dotted'
      }
    }
  })
  option.xAxis.data = option.xAxis.data.map(item => `${item} (UTC)`)
  option.xAxis.axisLabel = {
    formatter: value => value.replace(' (UTC)', '')
  }
  option.xAxis.axisTick = {
    alignWithLabel: true
  }
  option.yAxis.splitLine = {
    lineStyle: {
      color: 'black'
    }
  }
  option.tooltip = {
    ...option.tooltip,
    formatter: function (params) {
      if (params instanceof Array) {
        if (params.length) {
          const unit = params[0]?.data?.unit || ''
          let message = ''
          message += `${params[0].axisValueLabel}`
          params.forEach(param => {
            message += `<br/>${param.marker}${param.seriesName}: ${isNil(param.value) ? '-' : param.data?.label}`
            if (param.seriesName === VERIFIED_APY) {
              const realizedApy = param.data?.realizedApy
              const unrealizedApy = param.data?.unrealizedApy
              const realizedApyText = `${isNil(realizedApy) ? '-' : formatApyLabel(realizedApy) + unit}`
              const unrealizedApyText = `${isNil(unrealizedApy) ? '-' : formatApyLabel(unrealizedApy) + unit}`
              message += `${getMarker('#dc69aa')}Realized APY: ${realizedApyText}`
              message += `${getMarker('#95706d')}UnRealized APY: ${unrealizedApyText}`
            }
            if (param?.seriesName === OFFICIAL_DAILY_APY) {
              const offcialDetail = param?.data?.offcialDetail
              const stringArray = map(offcialDetail, i => {
                const text = `${isNil(i.feeApy) ? '-' : (100 * i.feeApy).toFixed(2) + unit}`
                return `${subMarker}${i.feeName}: ${text}`
              })
              message += stringArray.join('')
            }
            if (param?.seriesName === VERIFIED_DAILY_APY) {
              const realizedApyDetail = param?.data?.realizedApyDetail
              const unrealizedApyDetail = param?.data?.unrealizedApyDetail
              const stringArray = map(realizedApyDetail, i => {
                const text = `${isNil(i.feeApy) ? '-' : (100 * i.feeApy).toFixed(2) + unit}`
                return `${subMarker}${i.feeName}: ${text} (${feeApyStatusMap[i.feeApyStatus]})`
              })

              message += stringArray.join('')
              const stringArray1 = map(unrealizedApyDetail, i => {
                const text = `${isNil(i.feeApy) ? '-' : (100 * i.feeApy).toFixed(2) + unit}`
                return `${subMarker}${i.feeName}: ${text} (${feeApyStatusMap[i.feeApyStatus]})`
              })
              message += stringArray1.join('')
            }
          })

          return message
        } else {
          return null
        }
      } else {
        let message = ''
        message += `${params[0].axisValueLabel}`
        message += `<br/>${params.marker}${params.seriesName}: ${params.value}${params.data.unit || ''}`
        return message
      }
    }
  }
  const [minPercent, maxPercent] = bestIntervalForArrays(intervalArray, {
    startIndex: 30,
    rateOfChange: 3000
  })
  option.dataZoom = [
    {
      end: maxPercent,
      start: minPercent
    }
  ]

  if (!initialState.chain || isEmpty(strategy)) return null

  const { underlyingTokens, totalAssetBaseCurrent } = strategy

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
    height: 400
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

  let iconProps = {
    push: 2,
    xl: 12,
    lg: 12,
    md: 12,
    sm: 24,
    xs: 24,
    style: {
      margin: '0 auto 16px'
    }
  }
  if (deviceType === DEVICE_TYPE.Mobile) {
    iconProps.style = {
      margin: '0 auto 16px',
      textAlign: 'center'
    }
    delete iconProps.push
  }

  const titleRender = () => {
    return (
      <Space>
        <span>Offical APY</span>
        <Switch className={styles.officalSwitch} size="small" checked={isOfficalApyEnable} onChange={setIsOfficalApyEnable} />
        <span>Verified APY</span>
        <Switch className={styles.verifiedSwitch} size="small" checked={isVerifiedApyEnable} onChange={setIsVerifiedApyEnable} />
      </Space>
    )
  }

  return (
    <GridContent>
      <Suspense fallback={null}>
        <Card title={<LeftOutlined onClick={() => history.push('/')} />} bordered={false} {...infoResponsiveConfig.cardProps}>
          <Row justify="space-around">
            <Col {...iconProps}>
              <Image
                preview={false}
                width={200}
                style={{ borderRadius: '50%' }}
                src={`${IMAGE_ROOT}/images/amms/${strategiesMap[initialState.chain][strategy?.protocol]}.png`}
                fallback={`${IMAGE_ROOT}/default.png`}
              />
            </Col>
            <Col push={2} xl={12} lg={12} md={12} sm={24} xs={24}>
              <Descriptions
                column={1}
                title={<span style={{ color: '#fff' }}>Base Info</span>}
                labelStyle={{ color: '#fff' }}
                contentStyle={{ color: '#fff' }}
                {...infoResponsiveConfig.descriptionProps}
              >
                <Descriptions.Item label="Name">
                  <a target={'_blank'} rel="noreferrer" href={`${CHAIN_BROWSER_URL[initialState.chain]}/address/${strategy.strategyAddress}`}>
                    {strategy.strategyName}
                  </a>
                </Descriptions.Item>
                <Descriptions.Item label="Underlying Token(s)">
                  {!isEmpty(underlyingTokens) && <CoinSuperPosition array={underlyingTokens.split(',')} />}
                </Descriptions.Item>
                <Descriptions.Item label="Asset Value">{toFixed(totalAssetBaseCurrent, decimals, displayDecimals) + ` ${unit}`}</Descriptions.Item>
                <Descriptions.Item label="Status">Active</Descriptions.Item>
              </Descriptions>
            </Col>
          </Row>
        </Card>
      </Suspense>
      <Suspense fallback={null}>
        <Card
          title={titleRender()}
          className={styles.offlineCard}
          bordered={false}
          style={{
            marginTop: 32
          }}
          {...chartResponsiveConfig.cardProps}
        >
          <div style={chartResponsiveConfig.chartStyle}>
            {apyLoading ? (
              <div className={styles.loadingContainer}>
                <Spin size="large" />
              </div>
            ) : (
              <LineEchart option={option} style={{ height: '100%', width: '100%' }} />
            )}
          </div>
        </Card>
      </Suspense>
      <Suspense fallback={null}>
        <StrategyApyTable
          vault={vault}
          unit={vault === 'ethi' ? 'ETH' : 'USD'}
          displayDecimals={vault === 'ethi' ? ETHI_DISPLAY_DECIMALS : TOKEN_DISPLAY_DECIMALS}
          strategyName={strategy?.strategyName}
          strategyAddress={strategy?.strategyAddress}
          loading={loading}
        />
      </Suspense>
      <Suspense fallback={null}>
        <ReportTable strategyName={strategy?.strategyName} loading={loading} />
      </Suspense>
    </GridContent>
  )
}

export default Strategy
