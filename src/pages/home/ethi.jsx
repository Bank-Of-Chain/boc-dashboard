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
import { getValutAPYList, getTokenTotalSupplyList, clearAPICache } from '@/services/api-service'

// === Utils === //
import { isEmpty, isNil } from 'lodash';
import getLineEchartOpt from '@/components/echarts/options/line/getLineEchartOpt'
import { APY_DURATION } from '@/constants/api'
import { toFixed } from '@/utils/number-format';
import { ETHI_BN_DECIMALS, ETHI_DECIMALS, RECENT_ACTIVITY_TYPE } from '@/constants/ethi'
import { map, reverse } from 'lodash'
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
    getValutAPYList({
      chainId: initialState.chain,
      duration: APY_DURATION.monthly,
      limit: calDateRange,
      tokenType: TOKEN_TYPE.ethi
    }).then(data => {
      const items = appendDate(data.content, 'apy', calDateRange)
      const result = map(reverse(items), ({date, apy}) => ({
        date,
        apy: isNil(apy) ? null : `${numeral(apy).format('0,0.00')}`
      }))
      setApy30(data.content[0] ? data.content[0].apy : 0)
      setApyEchartOpt(getLineEchartOpt(result, 'apy', 'Trailing 30-day APY(%)', false, params))
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
        totalSupply: toFixed(totalSupply, ETHI_BN_DECIMALS, 2),
      }))
      setTvlEchartOpt(getLineEchartOpt(result, 'totalSupply', 'ETHi', false, params))
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
    content: !isEmpty(ethi) ? toFixed(ethi?.totalSupply, ETHI_BN_DECIMALS, 2) : 0,
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
          vault={dataSource.vault}
        />
      </Suspense>

      <Suspense fallback={null}>
        <StrategyTable strategyMap={ETHI_STRATEGIES_MAP} loading={loading} />
      </Suspense>
      <Suspense fallback={null}>
        <TransationsTable token="ETHi" decimals={ETHI_DECIMALS} filterOptions={RECENT_ACTIVITY_TYPE} loading={loading} />
      </Suspense>
    </GridContent>
  )
}

export default ETHiHome
