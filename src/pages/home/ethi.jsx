import { Suspense, useEffect, useState } from 'react'
import { GridContent } from '@ant-design/pro-layout'
import IntroduceRow from './components/IntroduceRow'
import LineChartContent from './components/LineChartContent'
import ProtocolAllocation from './components/ProtocolAllocation'
import StrategyTable from './components/StrategyTable'
import TransationsTable from './components/TransationsTable'
import { useModel } from 'umi'
import _min from 'lodash/min'
import _max from 'lodash/max'
import numeral from 'numeral'

// === Constants === //
import { ETHI_STRATEGIES_MAP } from '@/constants/strategies'
import { TOKEN_TYPE } from '@/constants/api'

// === Services === //
import useDashboardData from '@/hooks/useDashboardData'
import { getValutAPYList, getTokenTotalSupplyList, clearAPICache, getEstimateApys } from '@/services/api-service'

// === Utils === //
import { isEmpty, isNil } from 'lodash';
import getLineEchartOpt from '@/components/echarts/options/line/getLineEchartOpt'
import multipleLine from '@/components/echarts/options/line/multipleLine'
import { APY_DURATION } from '@/constants/api'
import { toFixed } from '@/utils/number-format';
import { ETHI_BN_DECIMALS, ETHI_DECIMALS, RECENT_ACTIVITY_TYPE, ETHI_DISPLAY_DECIMALS } from '@/constants/ethi'
import { map, reverse, cloneDeep, reduce } from 'lodash'
import BN from 'bignumber.js'
import { appendDate } from "@/utils/array-append"

const ETHiHome = () => {
  const [calDateRange, setCalDateRange] = useState(31)
  const [tvlEchartOpt, setTvlEchartOpt] = useState({})
  const [apyEchartOpt, setApyEchartOpt] = useState({})
  const [apy30, setApy30] = useState(0)

  const { initialState } = useModel('@@initialState')

  const { dataSource = {}, loading } = useDashboardData()
  const { ethi = {} } = dataSource;

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
        tokenType: TOKEN_TYPE.ethi
      }),
      getEstimateApys(initialState.chain, 'ethi').catch(() => { return { content: [] } })
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
      setApy30(data.content[0] ? data.content[0].apy : 0)
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
        if (serie.name === 'UnRealized APY') {
          serie.itemStyle = {
            normal: {
              lineStyle:{
                width:2,
                type:'dotted'
              }
            }
          }
        }
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
      tokenType: TOKEN_TYPE.ethi
    }).then(data => {
      const items = appendDate(data.content, 'totalSupply', calDateRange)
      const result = map(reverse(items), ({date, totalSupply}) => ({
        date,
        totalSupply: toFixed(totalSupply, ETHI_BN_DECIMALS, ETHI_DISPLAY_DECIMALS),
      }))
      setTvlEchartOpt(getLineEchartOpt(result, 'totalSupply', 'ETHi', {
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
    title: 'Total ETHi Supply',
    tip: 'Current total ETHi supply',
    content: !isEmpty(ethi) ? toFixed(ethi?.totalSupply, ETHI_BN_DECIMALS, ETHI_DISPLAY_DECIMALS) : 0,
    loading,
  }, {
    title: 'Holders',
    tip: 'Number Of ETHi holders',
    content: numeral(ethi?.holderCount).format('0,0'),
    loading,
  }, {
    title: 'APY (last 30 days)',
    tip: 'Yield over the past 1 month',
    content: `${numeral(apy30).format('0,0.00')}%`,
    loading,
  }]

  const vaultData = cloneDeep(dataSource.vault)
  if (vaultData) {
    const strategyTotal = reduce(
      vaultData.strategies,
      (rs, o) => {
        return rs.plus(o.debtRecordInVault)
      },
      BN(0),
    )
    vaultData.totalValueInVault = BN(vaultData.totalAssets).minus(strategyTotal).toString()
    vaultData.strategies.map(item => item.totalValue = item.debtRecordInVault)
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
        <StrategyTable
          unit="ETH"
          loading={loading}
          strategyMap={ETHI_STRATEGIES_MAP}
          displayDecimals={ETHI_DISPLAY_DECIMALS}
        />
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
