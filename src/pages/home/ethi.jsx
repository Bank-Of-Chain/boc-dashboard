import React, { Suspense, useEffect, useState } from 'react'

// === Components === //
import { Row, Col } from 'antd'
import { GridContent } from '@ant-design/pro-layout'
import IntroduceRow from './components/IntroduceRow'
import LineChartContent from './components/LineChartContent'
import ProtocolAllocation from './components/ProtocolAllocation'
import StrategyTable from './components/StrategyTable'
import TransationsTable from './components/TransationsTable'
import getLineEchartOpt from '@/components/echarts/options/line/getLineEchartOpt'
import multipleLine from '@/components/echarts/options/line/multipleLine'
import VaultChange from '@/components/VaultChange'
import { SoundOutlined, CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons'

// === Constants === //
import { ETHI_STRATEGIES_MAP } from '@/constants/strategies'
import { TOKEN_TYPE, APY_DURATION } from '@/constants'
import { ETHI_BN_DECIMALS, ETHI_DECIMALS, RECENT_ACTIVITY_TYPE, ETHI_DISPLAY_DECIMALS } from '@/constants/ethi'
import { notice } from '@/constants/notice'

// === Services === //
import useDashboardData from '@/hooks/useDashboardData'
import { getValutAPYList, getTokenTotalSupplyList, clearAPICache, getVirtualAPY } from '@/services/api-service'

// === Utils === //
import { useModel, history } from 'umi'
import numeral from 'numeral'
import moment from 'moment'
import BN from 'bignumber.js'
import { BigNumber } from 'ethers'
import { formatApyLabel, formatApyValue, toFixed } from '@/utils/number-format'
import { appendDate } from '@/utils/array-append'
import { isEmpty, isNil, uniq, find, size, filter, map, reverse, cloneDeep, reduce, get } from 'lodash'

// === Styles === //
import styles from './style.less'

const ETHiHome = () => {
  const [calDateRange, setCalDateRange] = useState(31)
  const [tvlEchartOpt, setTvlEchartOpt] = useState({})
  const [apyEchartOpt, setApyEchartOpt] = useState({})
  const [apy7, setApy7] = useState(0)
  const [apy30, setApy30] = useState(0)
  const [isNoticeOpen, setIsNoticeOpen] = useState(false)

  const { initialState } = useModel('@@initialState')

  const { dataSource = {}, loading } = useDashboardData()
  const { pegToken = {}, vault = {}, vaultBuffer = {} } = dataSource

  useEffect(() => {
    if (!initialState.chain) {
      return
    }
    const params = {
      xAxis: {
        axisTick: {
          alignWithLabel: true
        }
      },
      format: 'MM-DD HH:mm'
    }
    if (calDateRange > 7) {
      params.format = 'MM-DD'
    }
    getValutAPYList({
      chainId: initialState.chain,
      duration: APY_DURATION.weekly,
      limit: calDateRange,
      tokenType: TOKEN_TYPE.ethi
    })
      .then(data => {
        const nextApy7 = get(data, 'content.[0].apy', 0)
        setApy7(nextApy7)
      })
      .catch(e => {
        console.error(e)
      })
    Promise.all([
      getValutAPYList({
        chainId: initialState.chain,
        duration: APY_DURATION.monthly,
        limit: calDateRange,
        tokenType: TOKEN_TYPE.ethi
      }),
      getVirtualAPY(initialState.chain, '0x8f0Cb368C63fbEDF7a90E43fE50F7eb8B9411746')
    ])
      .then(([data, virtualApy]) => {
        const items = appendDate(data.content, 'apy', calDateRange)
        const result = map(reverse(items), ({ date, apy }) => {
          const apyValue = isNil(apy) ? null : `${numeral(apy).format('0.00')}`
          return {
            date,
            apy: apyValue
          }
        })
        const nextApy30 = get(data, 'content.[0].apy', 0)
        setApy30(nextApy30)

        const xAxisData = uniq(map(result, ({ date }) => date))
        // option for multi line
        const lengndData = ['APY', 'Virtual APY']
        const data1 = map(xAxisData, date => {
          const item = find(result, { date })
          return item
            ? {
                value: formatApyValue(item.apy),
                label: `${formatApyLabel(item.apy)}%`
              }
            : null
        })

        const data2 = map(xAxisData, date => {
          const item = find(virtualApy, { date })
          let value = 0
          if (!isEmpty(item)) {
            value = (100 * item.apy).toFixed(2)
          }
          return {
            value: formatApyValue(value),
            label: `${formatApyLabel(value)}%`
          }
        })

        const columeArray = [
          {
            seriesName: 'APY',
            seriesData: data1,
            showSymbol: size(filter(data1, i => !isNil(i.value))) === 1
          },
          {
            seriesName: 'Virtual APY',
            seriesData: data2,
            showSymbol: size(filter(data2, i => !isNil(i.value))) === 1
          }
        ]
        const obj = {
          legend: {
            data: lengndData,
            textStyle: { color: '#fff' }
          },
          xAxisData,
          data: columeArray
        }
        const option = multipleLine(obj)
        option.color = ['#A68EFE', '#fb923c', '#91cc75']
        option.series.forEach(serie => {
          serie.connectNulls = true
          if (serie.name === 'Estimated APY') {
            serie.lineStyle = {
              width: 2,
              type: 'dotted'
            }
          }
          if (serie.name === 'Virtual APY') {
            serie.lineStyle = {
              width: 5,
              type: 'dotted'
            }
          }
        })
        option.grid = {
          top: 40,
          left: '0%',
          right: '5%',
          bottom: '0%',
          containLabel: true
        }
        const xAxisLabels = []
        option.xAxis.data = option.xAxis.data.map(item => {
          // time format to tomorrow datetime string
          const value = `${moment(item).add(1, 'days').format('YYYY-MM-DD HH:mm')} (UTC)`
          xAxisLabels[value] = moment(item).add(1, 'days').format(params.format)
          return value
        })
        option.xAxis.axisLabel = {
          formatter: value => xAxisLabels[value]
        }
        option.xAxis.axisTick = {
          alignWithLabel: true
        }
        option.yAxis.splitLine = {
          lineStyle: {
            color: '#454459'
          }
        }
        option.tooltip = {
          ...option.tooltip,
          formatter: params => {
            if (params.length > 0) {
              const { axisValueLabel, marker, seriesName, data } = params[0]

              const { marker: marker2, seriesName: seriesName2, data: data2 } = params[1]

              let text1 = '',
                text2 = ''
              // value maybe null
              if (data?.value) {
                text1 = data?.label
              } else {
                text1 = '-'
              }
              if (data2?.value) {
                text2 = data2?.label
              } else {
                text2 = '-'
              }

              let tooltip = `${axisValueLabel}<br/>${marker}${seriesName}:${text1}<br/>${marker2}${seriesName2}:${text2}`

              return tooltip
            }
          }
        }
        setApyEchartOpt(option)
      })
      .catch(e => {
        console.error(e)
      })
    getTokenTotalSupplyList({
      chainId: initialState.chain,
      limit: calDateRange,
      tokenType: TOKEN_TYPE.ethi
    })
      .then(data => {
        const items = appendDate(data.content, 'totalSupply', calDateRange)
        const result = map(reverse(items), ({ date, totalSupply }) => ({
          date,
          totalSupply: toFixed(totalSupply, ETHI_BN_DECIMALS, ETHI_DISPLAY_DECIMALS)
        }))
        setTvlEchartOpt(
          getLineEchartOpt(result, 'totalSupply', 'ETHi', {
            ...params,
            yAxisMin: value => Math.floor(value.min * 0.998),
            yAxisMax: value => Math.ceil(value.max * 1.001)
          })
        )
      })
      .catch(e => {
        console.error(e)
      })
  }, [calDateRange, initialState.chain])

  useEffect(() => {
    return () => {
      clearAPICache()
    }
  }, [])

  if (isEmpty(initialState.chain)) return null

  const price = () => {
    if (isEmpty(pegToken) || pegToken?.totalSupply === '0' || isEmpty(vault?.totalAssets)) return '1'
    if (!isEmpty(vaultBuffer)) {
      if (vault.isAdjust) {
        return toFixed(BigNumber.from(vault.totalAssets).sub(vaultBuffer.totalSupply), pegToken?.totalSupply, 6)
      }
    }
    return toFixed(vault?.totalAssets, pegToken?.totalSupply, 6)
  }

  const handleHistoryClick = () => {
    history.push(`/prices?chain=${initialState.chain}&vault=${initialState.vault}`)
  }

  const text = toFixed(pegToken?.totalSupply, ETHI_BN_DECIMALS, ETHI_DISPLAY_DECIMALS)
  const totalSupplyTextWithSymbol = numeral(text).format('0.00 a')
  const [totalSupplyText, symbol] = totalSupplyTextWithSymbol.split(' ')
  const isNotNumber = isNaN(new Number(symbol))

  const introduceData = [
    {
      title: 'Total Supply',
      tip: 'Current total ETHi supply.',
      content: !isEmpty(pegToken) ? `${totalSupplyText}${isNotNumber ? '' : symbol}` : 0,
      loading,
      unit: `${!isEmpty(pegToken) ? `${isNotNumber ? symbol : ''}` : ''} ETHi`,
      footer: (
        <span>
          1ETHi ≈ {price()}ETH{' '}
          <span className={styles.history} onClick={handleHistoryClick}>
            History
          </span>
        </span>
      )
    },
    // {
    //   title: 'Holders',
    //   tip: 'Number Of ETHi holders.',
    //   content: numeral(pegToken?.holderCount).format('0.[0000]a'),
    //   loading
    // },
    {
      title: 'APY (last 7 days)',
      tip: 'Yield over the past week.',
      content: formatApyLabel(parseFloat(apy7).toFixed(2)),
      loading,
      unit: '%'
    },
    {
      title: 'APY (last 30 days)',
      tip: 'Yield over the past month.',
      content: formatApyLabel(parseFloat(apy30).toFixed(2)),
      loading,
      unit: '%'
    }
  ]

  const vaultData = cloneDeep(dataSource.vault)
  if (vaultData) {
    const strategyTotal = reduce(
      vaultData.strategies,
      (rs, o) => {
        return rs.plus(o.debtRecordInVault)
      },
      BN(0)
    )
    vaultData.totalValueInVault = BN(vaultData.totalAssets).minus(strategyTotal).toString()
    vaultData.strategies.map(item => (item.totalValue = item.debtRecordInVault))
  }

  return (
    <GridContent>
      <VaultChange />
      <Row gutter={[0, 30]}>
        <Col span={24}>
          <div
            style={{
              color: 'rgb(148, 163, 184)',
              background: 'linear-gradient(111.68deg, rgba(87, 97, 125, 0.2) 7.59%, rgba(255, 255, 255, 0.078) 102.04%)',
              padding: '1rem',
              borderRadius: '1rem'
            }}
          >
            <SoundOutlined />
            &nbsp;&nbsp;
            {isNoticeOpen ? (
              <span>
                <span>Please be well noticed !</span>
                <br></br>
                {notice}
                <CaretUpOutlined style={{ float: 'right', lineHeight: 2, clear: 'both', cursor: 'pointer' }} onClick={() => setIsNoticeOpen(false)} />
              </span>
            ) : (
              <span>
                Please be well noticed !
                <CaretDownOutlined
                  style={{ float: 'right', lineHeight: 2, clear: 'both', cursor: 'pointer' }}
                  onClick={() => setIsNoticeOpen(true)}
                />
              </span>
            )}
          </div>
        </Col>
        <Col span={24}>
          <Suspense fallback={null}>
            <IntroduceRow data={introduceData} />
          </Suspense>
        </Col>
        <Col span={24}>
          <Suspense fallback={null}>
            <LineChartContent
              loading={loading}
              calDateRange={calDateRange}
              onCalDateRangeClick={setCalDateRange}
              apyEchartOpt={apyEchartOpt}
              tvlEchartOpt={tvlEchartOpt}
            />
          </Suspense>
        </Col>
        <Col span={24}>
          <Suspense fallback={null}>
            <ProtocolAllocation
              loading={loading}
              strategyMap={ETHI_STRATEGIES_MAP}
              tokenDecimals={ETHI_BN_DECIMALS}
              displayDecimals={ETHI_DISPLAY_DECIMALS}
              vaultData={vaultData}
              unit="ETH"
            />
          </Suspense>
        </Col>
        <Col span={24}>
          <Suspense fallback={null}>
            <StrategyTable unit="ETH" loading={loading} strategyMap={ETHI_STRATEGIES_MAP} displayDecimals={ETHI_DISPLAY_DECIMALS} />
          </Suspense>
        </Col>
        <Col span={24}>
          <Suspense fallback={null}>
            <TransationsTable
              token="ETHi"
              decimals={ETHI_DECIMALS}
              dispalyDecimal={ETHI_DISPLAY_DECIMALS}
              filterOptions={RECENT_ACTIVITY_TYPE}
              loading={loading}
            />
          </Suspense>
        </Col>
      </Row>
    </GridContent>
  )
}

export default ETHiHome
