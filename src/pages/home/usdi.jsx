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
import { isEmpty, isNil } from 'lodash';
import getLineEchartOpt from '@/components/echarts/options/line/getLineEchartOpt'
import multipleLine from '@/components/echarts/options/line/multipleLine'
import { APY_DURATION } from '@/constants/api'
import { toFixed } from '@/utils/number-format';
import { USDI_BN_DECIMALS } from '@/constants/usdi'
import { map, reverse } from 'lodash'
import { appendDate } from "@/utils/array-append"

const USDiHome = () => {
  const [calDateRange, setCalDateRange] = useState(31)
  const [tvlEchartOpt, setTvlEchartOpt] = useState({})
  const [apyEchartOpt, setApyEchartOpt] = useState({})
  const [apy30, setApy30] = useState(0)

  const { initialState } = useModel('@@initialState')

  const { dataSource = {}, loading } = useDashboardData();
  const { usdi = {} } = dataSource;

  useEffect(() => {
    if (!initialState.chain) {
      return
    }
    const params = {
      xAxis: {
        axisTick: {
          alignWithLabel: true,
        },
      }
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
      getEstimateApys(initialState.chain, 'usdi').catch(() => { return { content: [] } })
    ]).then(([data, estimateApys]) => {
      const items = appendDate(data.content, 'apy', calDateRange)
      const result = map(reverse(items), ({date, apy}, index) => {
        const apyValue = isNil(apy) ? null : `${numeral(apy).format('0,0.00')}`
        return ({
          date,
          apy: apyValue,
          // 如果是最后一个节点的话，就把unrealize_apy填充上，确保apy曲线和unrealizeapy曲线是连续的
          unrealize_apy: index !== items.length - 1 ? null : apyValue
        })
      })
      const nextApy30 = get(data, 'content.[0].apy', 0)
      setApy30(nextApy30)

      const reverseIt = map(estimateApys.content, i => {
        return {
          date: i.date,
          unrealize_apy: i.apy,
          apy: null
        }
      })
      const nextArray = [...result, ...reverseIt]

      // 多条折现配置
      const lengndData = ['APY', 'UnRealized APY']
      const columeArray = [
        {
          seriesName: 'APY',
          seriesData: map(nextArray, 'apy'),
        },
        {
          seriesName: 'UnRealized APY',
          seriesData: map(nextArray, 'unrealize_apy'),
        }
      ]
      const obj = {
        legend: {
          data: lengndData,
          textStyle: { color: '#fff' },
        },
        xAxisData: map(nextArray, 'date'),
        data: columeArray
      }
      const option = multipleLine(obj)
      option.color = ['#5470c6', '#91cc75']
      option.series.forEach(serie => {
        serie.connectNulls = true
      })
      option.grid= {left: '0%', right: '2%', bottom: '0%', containLabel: true}
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
    title: 'Total USDi Supply',
    tip: 'Current total USDi supply',
    content: !isEmpty(usdi) ? toFixed(usdi?.totalSupply, USDI_BN_DECIMALS, TOKEN_DISPLAY_DECIMALS) : 0,
    loading,
  }, {
    title: 'Holders',
    tip: 'Number Of USDi holders',
    content: numeral(usdi?.holderCount).format('0,0'),
    loading,
  }, {
    title: 'APY (last 30 days)',
    tip: 'Yield over the past 1 month',
    content: `${numeral(apy30).format('0,0.00')}%`,
    loading,
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
