import React from 'react'
import { Suspense, useEffect, useState } from 'react'

// === Components === //
import { GridContent } from '@ant-design/pro-layout'
import IntroduceRow from './components/IntroduceRow'
import LineChartContent from './components/LineChartContent'
import ProtocolAllocation from './components/ProtocolAllocation'
import StrategyTable from './components/StrategyTable'
import TransationsTable from './components/TransationsTable'
import getLineEchartOpt from '@/components/echarts/options/line/getLineEchartOpt'
import multipleLine from '@/components/echarts/options/line/multipleLine'
import ChainChange from '@/components/ChainChange'

// === Constants === //
import { USDI_STRATEGIES_MAP } from '@/constants/strategies'
import { TOKEN_TYPE, APY_DURATION } from '@/constants'
import { TOKEN_DISPLAY_DECIMALS } from '@/constants/vault'
import { USDI_BN_DECIMALS } from '@/constants/usdi'

// === Services === //
import useDashboardData from '@/hooks/useDashboardData'
import { getValutAPYList, getTokenTotalSupplyList, clearAPICache } from '@/services/api-service'

// === Utils === //
import { useModel } from 'umi'
import numeral from 'numeral'
import moment from 'moment'
import { BigNumber } from 'ethers'
import { toFixed } from '@/utils/number-format'
import { appendDate } from '@/utils/array-append'
import { isEmpty, isNil, uniq, find, map, reverse, size, filter, get } from 'lodash'

const USDiHome = () => {
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
      tokenType: TOKEN_TYPE.usdi
    })
      .then(data => {
        const items = appendDate(data.content, 'apy', calDateRange)
        const result = map(reverse(items), ({ date, apy }) => {
          const apyValue = isNil(apy) ? null : `${numeral(apy).format('0,0.00')}`
          return {
            date,
            apy: apyValue
          }
        })
        const nextApy30 = get(data, 'content.[0].apy', 0)
        setApy30(nextApy30)

        const xAxisData = uniq(map(result, ({ date }) => date))

        // option for multi line
        const lengndData = []
        const data1 = map(xAxisData, date => {
          const item = find(result, { date })
          return item ? item.apy : null
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
      tokenType: TOKEN_TYPE.usdi
    })
      .then(data => {
        const items = appendDate(data.content, 'totalSupply', calDateRange)
        const result = map(reverse(items), ({ date, totalSupply }) => ({
          date,
          totalSupply: toFixed(totalSupply, USDI_BN_DECIMALS, TOKEN_DISPLAY_DECIMALS)
        }))
        setTvlEchartOpt(
          getLineEchartOpt(result, 'totalSupply', 'USDi', {
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
      tip: 'Current total USDi supply',
      content: !isEmpty(pegToken) ? numeral(toFixed(pegToken?.totalSupply, USDI_BN_DECIMALS, TOKEN_DISPLAY_DECIMALS)).format('0.[0000]a') : 0,
      loading,
      unit: 'USDi',
      subTitle: `1USDi ≈ ${price()}USD`
    },
    {
      title: 'Holders',
      tip: 'Number Of USDi holders',
      content: numeral(pegToken?.holderCount).format('0.[0000]a'),
      loading
    },
    {
      title: 'APY (last 30 days)',
      tip: 'Yield over the past 1 month',
      content: numeral(apy30).format('0,0.00'),
      loading,
      unit: '%'
    }
  ]

  return (
    <GridContent>
      <Suspense fallback={null}>
        <ChainChange />
      </Suspense>
      <Suspense fallback={null}>
        <IntroduceRow data={introduceData} />
      </Suspense>
      <Suspense fallback={null}>
        <LineChartContent
          isUsdi
          loading={loading}
          calDateRange={calDateRange}
          onCalDateRangeClick={setCalDateRange}
          apyEchartOpt={apyEchartOpt}
          tvlEchartOpt={tvlEchartOpt}
        />
      </Suspense>
      <Suspense fallback={null}>
        <ProtocolAllocation loading={loading} strategyMap={USDI_STRATEGIES_MAP} tokenDecimals={USDI_BN_DECIMALS} vaultData={dataSource.vault} />
      </Suspense>

      <Suspense fallback={null}>
        <StrategyTable strategyMap={USDI_STRATEGIES_MAP} loading={loading} />
      </Suspense>
      <Suspense fallback={null}>
        <TransationsTable loading={loading} />
      </Suspense>
    </GridContent>
  )
}

export default USDiHome
