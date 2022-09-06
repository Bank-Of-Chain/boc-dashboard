import React, { Suspense, useEffect, useState } from 'react'

// === Components === //
import { GridContent } from '@ant-design/pro-layout'
import IntroduceRow from './components/IntroduceRow'
import LineChartContent from './components/LineChartContent'
import ProtocolAllocation from './components/ProtocolAllocation'
import StrategyTable from './components/StrategyTable'
import TransationsTable from './components/TransationsTable'
import getLineEchartOpt from '@/components/echarts/options/line/getLineEchartOpt'
import multipleLine from '@/components/echarts/options/line/multipleLine'

// === Constants === //
import { ETHI_STRATEGIES_MAP } from '@/constants/strategies'
import { TOKEN_TYPE, APY_DURATION } from '@/constants'
import { ETHI_BN_DECIMALS, ETHI_DECIMALS, RECENT_ACTIVITY_TYPE, ETHI_DISPLAY_DECIMALS } from '@/constants/ethi'

// === Services === //
import useDashboardData from '@/hooks/useDashboardData'
import { getValutAPYList, getTokenTotalSupplyList, clearAPICache } from '@/services/api-service'

// === Utils === //
import { useModel } from 'umi'
import numeral from 'numeral'
import moment from 'moment'
import BN from 'bignumber.js'
import { BigNumber } from 'ethers'
import { formatApyLabel, formatApyValue, toFixed } from '@/utils/number-format'
import { appendDate } from '@/utils/array-append'
import { isEmpty, isNil, uniq, find, size, filter, map, reverse, cloneDeep, reduce } from 'lodash'

const ETHiHome = () => {
  const [calDateRange, setCalDateRange] = useState(31)
  const [tvlEchartOpt, setTvlEchartOpt] = useState({})
  const [apyEchartOpt, setApyEchartOpt] = useState({})
  const [apy30, setApy30] = useState(0)

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
      duration: APY_DURATION.monthly,
      limit: calDateRange,
      tokenType: TOKEN_TYPE.ethi
    })
      .then(data => {
        const items = appendDate(data.content, 'apy', calDateRange)
        const result = map(reverse(items), ({ date, apy }) => {
          const apyValue = isNil(apy) ? null : `${numeral(apy).format('0.00')}`
          return {
            date,
            apy: apyValue
          }
        })
        setApy30(data.content[0] ? data.content[0].apy : 0)

        const xAxisData = uniq(map(result, ({ date }) => date))
        // option for multi line
        const lengndData = []
        const data1 = map(xAxisData, date => {
          const item = find(result, { date })
          return item ? formatApyValue(item.apy) : null
        })
        const columeArray = [
          {
            seriesName: 'APY',
            seriesData: data1,
            showSymbol: size(filter(data1, i => !isNil(i))) === 1
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
        option.color = ['#A68EFE', '#5470c6', '#91cc75']
        option.series.forEach(serie => {
          serie.connectNulls = true
          if (serie.name === 'Estimated APY') {
            serie.lineStyle = {
              width: 2,
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

  const introduceData = [
    {
      title: 'Total Supply',
      tip: 'Current total ETHi supply',
      content: !isEmpty(pegToken) ? numeral(toFixed(pegToken?.totalSupply, ETHI_BN_DECIMALS, ETHI_DISPLAY_DECIMALS)).format('0.[0000]a') : 0,
      loading,
      unit: 'ETHi',
      subTitle: `1ETHi ≈ ${price()}ETH`
    },
    {
      title: 'Holders',
      tip: 'Number Of ETHi holders',
      content: numeral(pegToken?.holderCount).format('0.[0000]a'),
      loading
    },
    {
      title: 'APY (last 30 days)',
      tip: 'Yield over the past 1 month',
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
      <Suspense fallback={null}>
        <IntroduceRow data={introduceData} />
      </Suspense>
      <Suspense fallback={null}>
        <LineChartContent
          loading={loading}
          calDateRange={calDateRange}
          onCalDateRangeClick={setCalDateRange}
          apyEchartOpt={apyEchartOpt}
          tvlEchartOpt={tvlEchartOpt}
        />
      </Suspense>
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

      <Suspense fallback={null}>
        <StrategyTable unit="ETH" loading={loading} strategyMap={ETHI_STRATEGIES_MAP} displayDecimals={ETHI_DISPLAY_DECIMALS} />
      </Suspense>
      <Suspense fallback={null}>
        <TransationsTable
          token="ETHi"
          decimals={ETHI_DECIMALS}
          dispalyDecimal={ETHI_DISPLAY_DECIMALS}
          filterOptions={RECENT_ACTIVITY_TYPE}
          loading={loading}
        />
      </Suspense>
    </GridContent>
  )
}

export default ETHiHome
