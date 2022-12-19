import React, { Suspense, useState, useEffect } from 'react'

// === Constants === //
import { USDI_STRATEGIES_MAP, ETHI_STRATEGIES_MAP } from '@/constants/strategies'
import { VAULT_TYPE, TOKEN_DISPLAY_DECIMALS } from '@/constants/vault'
import { ETHI_DISPLAY_DECIMALS } from '@/constants/ethi'

// === Components === //
import { LeftOutlined, PieChartOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import { LineEchart } from '@/components/echarts'
import ReportTable from './components/ReportTable'
import { GridContent } from '@ant-design/pro-layout'
import StrategyApyTable from './components/StrategyApyTable'
import CoinSuperPosition from '@/components/CoinSuperPosition'
import { Col, Row, Card, Image, Descriptions, Spin, Switch, Space, Tooltip } from 'antd'
import multipleLine from '@/components/echarts/options/line/multipleLine'
import { useDeviceType, DEVICE_TYPE } from '@/components/Container/Container'
import IFrameLoader from '@/components/IFrameLoader'

// === Utils === //
import moment from 'moment'
import BN from 'bignumber.js'
import numeral from 'numeral'
import last from 'lodash/last'
import uniq from 'lodash/uniq'
import { history, useModel } from 'umi'
import { formatToUTC0 } from '@/utils/date'
import { toFixed, formatApyLabel, formatApyValue } from '@/utils/number-format'
import { bestIntervalForArrays } from '@/utils/echart-utils'
import { get, isNil, keyBy, size, filter, isEmpty, map, noop, reduce, find, keys } from 'lodash'

// === Services === //
import { getStrategyApysOffChain, getBaseApyByPage, getStrategyDetails, getStrategyApyDetails } from '@/services/api-service'

// === Hooks === //
import useStrategyDetails from '@/hooks/useStrategyDetails'

// === Constants === //
import URL from '@/constants/dune'
import BorrowingExtends from '@/constants/borrowing-extends'

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

  const details = useStrategyDetails(initialState.chain, initialState.vaultAddress, id)
  console.log('initialState', details)

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

  const displayFormat = {
    [VAULT_TYPE.USDi]: '0,0.[00]',
    [VAULT_TYPE.ETHi]: '0,0.[0000]'
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
  option.grid = {
    left: 30,
    right: 10
  }

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

  const titleRender = () => {
    return (
      <Space>
        <span style={{ verticalAlign: 'sub' }}>Offical APY</span>
        <Switch className={styles.officalSwitch} size="small" checked={isOfficalApyEnable} onChange={setIsOfficalApyEnable} />
        <span style={{ verticalAlign: 'sub' }}>Verified APY</span>
        <Switch className={styles.verifiedSwitch} size="small" checked={isVerifiedApyEnable} onChange={setIsVerifiedApyEnable} />
      </Space>
    )
  }

  const iframeStyleUpdate = dom => {
    //TODO:
    console.log('dom=', dom)
    // if (isUndefined(dom)) return
    // const htmlDom = dom.querySelector('html')
    // if (isUndefined(htmlDom)) return
    // var style = dom.createElement('style')
    // style.innerHTML = `.header_owner__vd8ip,.status_icon__mGOok{display: none;}`
    // htmlDom.append(style)
  }

  const titleFontSize = {
    [DEVICE_TYPE.Desktop]: 30,
    [DEVICE_TYPE.Tablet]: 26,
    [DEVICE_TYPE.Mobile]: 18
  }[deviceType]

  const infoFontSize = {
    [DEVICE_TYPE.Desktop]: 16,
    [DEVICE_TYPE.Tablet]: 16,
    [DEVICE_TYPE.Mobile]: 10
  }[deviceType]

  const columnSize = {
    [DEVICE_TYPE.Desktop]: 2,
    [DEVICE_TYPE.Tablet]: 1,
    [DEVICE_TYPE.Mobile]: 1
  }[deviceType]

  const icon = <ExclamationCircleOutlined style={{ fontSize: '1rem' }} />

  const extendsWarn = get(BorrowingExtends, `${strategy.strategyName}.warn`, '')

  return (
    <GridContent>
      <Suspense fallback={null}>
        <Card bordered={false} {...infoResponsiveConfig.cardProps}>
          <div className={styles.cardTitle}>
            <LeftOutlined onClick={() => history.push('/')} />
          </div>
          <Row justify="space-around">
            <Col xl={8} lg={8} md={8} sm={24} xs={24}>
              <div className={styles.imgWrapper}>
                <Image
                  preview={false}
                  width="100%"
                  style={{ maxWidth: '200px', borderRadius: '50%' }}
                  src={`${IMAGE_ROOT}/images/amms/${strategiesMap[initialState.chain][strategy?.protocol]}.png`}
                  fallback={`${IMAGE_ROOT}/default.png`}
                />
              </div>
            </Col>
            <Col xl={16} lg={16} md={16} sm={24} xs={20}>
              <Descriptions
                column={columnSize}
                title={
                  <span style={{ color: '#fff', fontSize: titleFontSize, fontWeight: 'normal' }}>
                    <a
                      target={'_blank'}
                      rel="noreferrer"
                      href={`${CHAIN_BROWSER_URL[initialState.chain]}/address/${strategy.strategyAddress}`}
                      className={styles.strategyName}
                    >
                      {strategy.strategyName}
                    </a>
                  </span>
                }
                labelStyle={{ color: '#fff', fontSize: infoFontSize }}
                contentStyle={{ color: '#fff', fontSize: infoFontSize }}
                {...infoResponsiveConfig.descriptionProps}
              >
                <Descriptions.Item label="Underlying">
                  {!isEmpty(underlyingTokens) && (
                    <CoinSuperPosition
                      array={uniq([...underlyingTokens.split(','), ...get(BorrowingExtends, `${strategy.strategyName}.pathTokens`, [])])}
                    />
                  )}
                </Descriptions.Item>
                <Descriptions.Item
                  label={
                    <Space>
                      Strategy Net Assets
                      <Tooltip title="Net assets in strategy">{icon}</Tooltip>
                    </Space>
                  }
                >
                  {numeral(toFixed(totalAssetBaseCurrent, decimals, displayDecimals)).format(displayFormat) + ` ${unit}`}
                </Descriptions.Item>
                {/* // type 2 */}

                {!isNil(details['liquidation-threshold']) && (
                  <Descriptions.Item
                    label={
                      <Space>
                        LTV
                        <Tooltip title="Loan to value">{icon}</Tooltip>
                      </Space>
                    }
                  >
                    {toFixed(details['liquidation-threshold'], 1e-2, 2)}%
                  </Descriptions.Item>
                )}
                {!isNil(details['health-ratio']) && (
                  <Descriptions.Item label="Health Ratio">{toFixed(details['health-ratio'], 1e-2, 2)}%</Descriptions.Item>
                )}
                {/* // type1 */}
                {!isNil(details['debts']) && (
                  <Descriptions.Item
                    label={
                      <Space>
                        Debts
                        <Tooltip title="Amount of debt">{icon}</Tooltip>
                      </Space>
                    }
                  >
                    {toFixed(details['debts'], decimals, displayDecimals) + ` ${unit}`}
                  </Descriptions.Item>
                )}
                {!isNil(details['debts-to-assets-ratio']) && (
                  <Descriptions.Item label="Debts Ratio">{toFixed(details['debts-to-assets-ratio'], 1e-2, 2)}%</Descriptions.Item>
                )}
                {!isNil(details['interest-borrow-apy']) && (
                  <Descriptions.Item label="Borrow Interest">{toFixed(details['interest-borrow-apy'], 1e-2, 2)}%</Descriptions.Item>
                )}
                {!isNil(details['interest-supply-apy']) && (
                  <Descriptions.Item label={'Supply Interest'}>{toFixed(details['interest-supply-apy'], 1e-2, 2)}%</Descriptions.Item>
                )}
                {!isNil(details['underlying-liquidity']) && (
                  <Descriptions.Item
                    label={
                      <Space>
                        3rd Total Liquidity
                        <Tooltip title="Total liquidity from lending pool">{icon}</Tooltip>
                      </Space>
                    }
                  >
                    {numeral(toFixed(details['underlying-liquidity'], decimals, displayDecimals)).format(displayFormat) + ` ${unit}`}
                  </Descriptions.Item>
                )}
                {!isNil(details['underlying-borrow']) && (
                  <Descriptions.Item
                    label={
                      <Space>
                        3rd Total Borrowed
                        <Tooltip title="Borrowed assets from lending pool">{icon}</Tooltip>
                      </Space>
                    }
                  >
                    {numeral(toFixed(details['underlying-borrow'], decimals, displayDecimals)).format(displayFormat) + ` ${unit}`}
                  </Descriptions.Item>
                )}

                {!isNil(details['strategy-leverage']) && (
                  <Descriptions.Item label="Leverage Ratio">
                    {numeral(toFixed(details['strategy-leverage'], decimals, 2)).format('0.00')}
                  </Descriptions.Item>
                )}
                {!isNil(details['assets']) && (
                  <Descriptions.Item
                    label={
                      <Space>
                        Supply Amounts
                        <Tooltip title="the quantity of collateral">{icon}</Tooltip>
                      </Space>
                    }
                  >
                    {toFixed(details['assets'], decimals, displayDecimals) + ` ${unit}`}
                  </Descriptions.Item>
                )}

                {/* // type 3 */}
                {!isNil(details['foreign-currency-lending-rate']) && (
                  <Descriptions.Item
                    label={
                      <Space>
                        Borrow Interest
                        <Tooltip title="Foreign exchange borrowing rate">{icon}</Tooltip>
                      </Space>
                    }
                  >
                    {toFixed(details['foreign-currency-lending-rate'], 1e-2, 2)}%
                  </Descriptions.Item>
                )}
                {!isNil(details['lend-to-curve-total-assets']) && (
                  <Descriptions.Item
                    label={
                      <Space>
                        Liquidity Assets
                        <Tooltip title="The assets in the curve to provide liquidity">{icon}</Tooltip>
                      </Space>
                    }
                  >
                    {numeral(toFixed(details['lend-to-curve-total-assets'], decimals, displayDecimals)).format(displayFormat) + ` ${unit}`}
                  </Descriptions.Item>
                )}
                {/* // type 4 */}
                {!isNil(details['base-order-lower']) && !isNil(details['base-order-upper']) && (
                  <Descriptions.Item
                    label={
                      <Space>
                        Base Order
                        <Tooltip title="The range of the base order">{icon}</Tooltip>
                      </Space>
                    }
                  >
                    [<span style={{ margin: '0 5px' }}>{toFixed(details['base-order-lower'], decimals, displayDecimals)}</span>,
                    <span style={{ margin: '0 5px' }}>{toFixed(details['base-order-upper'], decimals, displayDecimals)}</span>]
                  </Descriptions.Item>
                )}
                {!isNil(details['limit-order-lower']) && !isNil(details['limit-order-upper']) && (
                  <Descriptions.Item
                    label={
                      <Space>
                        Limit Order
                        <Tooltip title="The range of the limit order">{icon}</Tooltip>
                      </Space>
                    }
                  >
                    [<span style={{ margin: '0 5px' }}>{toFixed(details['limit-order-lower'], decimals, displayDecimals)}</span>,
                    <span style={{ margin: '0 5px' }}>{toFixed(details['limit-order-upper'], decimals, displayDecimals)}</span> ]
                  </Descriptions.Item>
                )}
                {!isNil(details['pool-assets']) && (
                  <Descriptions.Item
                    label={
                      <Space>
                        3rd Pool Assets
                        <Tooltip title="The total value of pool">{icon}</Tooltip>
                      </Space>
                    }
                  >
                    {numeral(toFixed(details['pool-assets'], decimals, displayDecimals)).format(displayFormat) + ` ${unit}`}
                  </Descriptions.Item>
                )}
                {!isNil(details['current-price']) && (
                  <Descriptions.Item
                    label={
                      <Space>
                        Current Price
                        <Tooltip title="The price of quote token relative to base token">{icon}</Tooltip>
                      </Space>
                    }
                  >
                    {toFixed(details['current-price'], decimals, displayDecimals)}
                  </Descriptions.Item>
                )}
                {!isNil(details['token-ratio']) && (
                  <Descriptions.Item
                    label={
                      <Space>
                        Token Ratio
                        <Tooltip title="the proportion of each token in thirdpart pool">{icon}</Tooltip>
                      </Space>
                    }
                  >
                    <Tooltip
                      title={
                        <div>
                          {map(keys(details['token-ratio']), key => {
                            console.log('key=', details['token-ratio'], key)
                            return (
                              <div style={{ display: 'flex', marginBottom: '0.5rem' }}>
                                <Space>
                                  <CoinSuperPosition key={key} array={key} />
                                  {toFixed(details['token-ratio'][key], decimals, displayDecimals)}
                                </Space>
                              </div>
                            )
                          })}
                        </div>
                      }
                    >
                      <PieChartOutlined
                        style={{
                          cursor: 'pointer',
                          margin: 'auto 0',
                          fontSize: '24px',
                          color: '#A68EFE'
                        }}
                      />
                    </Tooltip>
                  </Descriptions.Item>
                )}
              </Descriptions>
              {!isEmpty(extendsWarn) && (
                <Descriptions title={null} column={1}>
                  <Descriptions.Item label="">
                    <p className={styles.warningTip}>Warning: {extendsWarn.join('; ')}</p>
                  </Descriptions.Item>
                </Descriptions>
              )}
            </Col>
          </Row>
        </Card>
      </Suspense>
      <Suspense fallback={null}>
        <Card
          className={styles.offlineCard}
          bordered={false}
          style={{
            marginTop: 32
          }}
          {...chartResponsiveConfig.cardProps}
        >
          {titleRender()}
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
      {ori &&
        map(URL[strategy.strategyName], item => {
          return (
            <Suspense fallback={null} key={item}>
              <IFrameLoader className={styles.iframe} src={item} frameBorder="0" onload={iframeStyleUpdate} />
            </Suspense>
          )
        })}
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
