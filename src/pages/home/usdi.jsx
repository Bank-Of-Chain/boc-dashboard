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

// === Components === //
import ChainChange from '../../components/ChainChange'

// === Constants === //
import { USDI_STRATEGIES_MAP } from '@/constants/strategies'
import { TOKEN_TYPE } from '@/constants/api'
import { TOKEN_DISPLAY_DECIMALS } from '@/constants/vault'

// === Services === //
import useDashboardData from '@/hooks/useDashboardData'
import { getValutAPYList, getTokenTotalSupplyList, clearAPICache } from '@/services/api-service'

// === Utils === //
import { isEmpty, isNil } from 'lodash';
import getLineEchartOpt from '@/components/echarts/options/line/getLineEchartOpt'
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
    getValutAPYList({
      chainId: initialState.chain,
      duration: APY_DURATION.monthly,
      limit: calDateRange,
      tokenType: TOKEN_TYPE.usdi
    }).then(data => {
      const items = appendDate(data.content, 'apy', calDateRange)
      const result = map(reverse(items), ({date, apy}) => ({
        date,
        apy: isNil(apy) ? null : `${numeral(apy).format('0,0.00')}`
      }))
      setApy30(data[0] ? data[0].apy : 0)
      setApyEchartOpt(getLineEchartOpt(result, 'apy', 'Trailing 30-day APY(%)', {
        ...params,
        needMinMax: false
      }))
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
