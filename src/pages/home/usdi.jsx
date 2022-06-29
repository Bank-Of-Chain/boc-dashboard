import { Suspense, useEffect, useState } from 'react'
import { GridContent } from '@ant-design/pro-layout'
import IntroduceRow from './components/IntroduceRow'
import LineChartContent from './components/LineChartContent'
import ProtocolAllocation from './components/ProtocolAllocation'
import StrategyTable from './components/StrategyTable'
import TransationsTable from './components/TransationsTable'
import { useModel } from 'umi'
import get from 'lodash/get'
import _min from 'lodash/min'
import _max from 'lodash/max'
import numeral from 'numeral'
import moment from 'moment'

// === Components === //
import ChainChange from '../../components/ChainChange'

// === Constants === //
import { USDI_STRATEGIES_MAP } from '@/constants/strategies'
import { TOKEN_TYPE } from '@/constants/api'
import { TOKEN_DISPLAY_DECIMALS } from '@/constants/vault'

// === Services === //
import useDashboardData from '@/hooks/useDashboardData'
import { getValutAPYList, getTokenTotalSupplyList, clearAPICache, getEstimateApys } from '@/services/api-service'

// === Utils === //
import { isEmpty, isNil, uniq, find, map, reverse, size, filter } from 'lodash';
import getLineEchartOpt from '@/components/echarts/options/line/getLineEchartOpt'
import multipleLine from '@/components/echarts/options/line/multipleLine'
import { APY_DURATION } from '@/constants/api'
import { toFixed } from '@/utils/number-format';
import { USDI_BN_DECIMALS } from '@/constants/usdi'
import { appendDate } from "@/utils/array-append"

const USDiHome = () => {
  const [calDateRange, setCalDateRange] = useState(31)
  const [tvlEchartOpt, setTvlEchartOpt] = useState({})
  const [apyEchartOpt, setApyEchartOpt] = useState({})
  const [apy30, setApy30] = useState(0)

  const { initialState } = useModel('@@initialState')

  const { dataSource = {}, loading } = useDashboardData();
  const { pegToken = {}, vault = {} } = dataSource;

  useEffect(() => {
    if (!initialState.chain) {
      return
    }
    const params = {
      xAxis: {
        axisTick: {
          alignWithLabel: true,
        },
      },
      format:'MM-DD HH:mm'
    }
    if (calDateRange > 7) {
      params.format = 'MM-DD'
    }
    Promise.all([
      getValutAPYList({
        chainId: initialState.chain,
        duration: APY_DURATION.monthly,
        limit: calDateRange,
        tokenType: TOKEN_TYPE.usdi
      }),
      getEstimateApys({
        chainId: initialState.chain,
        tokenType: TOKEN_TYPE.usdi,
        limit: calDateRange,
      }).catch(() => { return { content: [] } })
    ]).then(([data, estimateApys]) => {
      const items = appendDate(data.content, 'apy', calDateRange)
      const result = map(reverse(items), ({date, apy}, index) => {
        const apyValue = isNil(apy) ? null : `${numeral(apy).format('0,0.00')}`
        return ({
          date,
          apy: apyValue,
        })
      })
      const nextApy30 = get(data, 'content.[0].apy', 0)
      setApy30(nextApy30)

      const reverseIt = map(reverse(estimateApys.content), i => {
        return {
          date: i.date,
          unrealize_apy: i.apy,
          apy: null
        }
      })

      const xAxisData = uniq([...map(result, ({ date }) => date), ...map(reverseIt, ({ date }) => date)])

      // 多条折现配置
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
      // TODO: 由于后端接口暂时未上，所以前端选择性的展示unrealize apy
      if (!isEmpty(estimateApys.content)) {
        lengndData.push('APY')
        lengndData.push('Estimated APY')
        const data2 = map(xAxisData, date => {
          const item = find(reverseIt, { date })
          return item ? item.unrealize_apy : null
        })
        columeArray.push({
          seriesName: 'Estimated APY',
          seriesData: data2,
          showSymbol: size(filter(data2, i => !isNil(i))) === 1
        })
      }
      const obj = {
        legend: {
          data: lengndData,
          textStyle: { color: '#fff' },
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
            type:'dotted'
          }
        }
      })
      option.grid= {left: '0%', right: '2%', bottom: '0%', containLabel: true}
      const xAxisLabels = []
      option.xAxis.data = option.xAxis.data.map(item => {
        // 数据为当天 23:59 数据，显示成明天 0 点
        const value = `${moment(item).add(1, 'days').format('YYYY-MM-DD HH:mm')} (UTC)`
        xAxisLabels[value] = moment(item).add(1, 'days').format(params.format);
        return value
      })
      option.xAxis.axisLabel = {
        formatter: (value) => xAxisLabels[value]
      }
      option.xAxis.axisTick = {
        alignWithLabel: true,
      }
      option.yAxis.splitLine = {
        lineStyle: {
          color: '#454459',
        },
      }
      setApyEchartOpt(option)
    }).catch((e) => {
      console.error(e)
    })
    getTokenTotalSupplyList({
      chainId: initialState.chain,
      limit: calDateRange,
      tokenType: TOKEN_TYPE.usdi
    }).then(data => {
      const items = appendDate(data.content, 'totalSupply', calDateRange)
      const result = map(reverse(items), ({date, totalSupply}) => ({
        date,
        totalSupply: toFixed(totalSupply, USDI_BN_DECIMALS, TOKEN_DISPLAY_DECIMALS),
      }))
      setTvlEchartOpt(getLineEchartOpt(result, 'totalSupply', 'USDi', {
        ...params,
        yAxisMin: (value) => Math.floor(value.min * 0.998),
        yAxisMax: (value) => Math.ceil(value.max * 1.001),
      }))
    }).catch((e) => {
      console.error(e)
    })
  }, [calDateRange, initialState.chain])

  useEffect(() => {
    return () => {
      clearAPICache()
    }
  }, [])

  if (isEmpty(initialState.chain)) return null

  const introduceData = [{
    title: 'Total Supply',
    tip: 'Current total USDi supply',
    content: !isEmpty(pegToken) ? numeral(toFixed(pegToken?.totalSupply, USDI_BN_DECIMALS, TOKEN_DISPLAY_DECIMALS)).format("0.[0000]a") : 0,
    loading,
    unit: 'USDi',
    subTitle: `1USDi ≈ ${pegToken?.totalSupply === "0" ? "1" : toFixed(vault?.totalAssets, pegToken?.totalSupply, 6)}USD`
  }, {
    title: 'Holders',
    tip: 'Number Of USDi holders',
    content: numeral(pegToken?.holderCount).format("0.[0000]a"),
    loading,
  }, {
    title: 'APY (last 30 days)',
    tip: 'Yield over the past 1 month',
    content: numeral(apy30).format('0,0.00'),
    loading,
    unit: '%'
  }]

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
        <ProtocolAllocation
          loading={loading}
          strategyMap={USDI_STRATEGIES_MAP}
          tokenDecimals={USDI_BN_DECIMALS}
          vaultData={dataSource.vault}
        />
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
