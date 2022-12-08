import React, { Suspense } from 'react'

// === Utils === //
import { useModel, useRequest } from 'umi'
import getLineEchartOpt from '@/components/echarts/options/line/getLineEchartOpt'
import map from 'lodash/map'
import { formatToUTC0 } from '@/utils/date'
import { toFixed } from '@/utils/number-format'

// === Components === //
import { GridContent } from '@ant-design/pro-layout'
import ChainChange from '@/components/ChainChange'
import { LineEchart } from '@/components/echarts'
import VaultChange from '@/components/VaultChange'

// === Services === //
import { getPrices } from '@/services/price-service'

const USDIPrice = () => {
  const { initialState } = useModel('@@initialState')

  const { data, loading } = useRequest(() => getPrices(initialState.chain, initialState.vaultAddress), {
    manual: false,
    paginated: true,
    formatResult: resp => {
      const { content } = resp
      return {
        total: resp.totalElements,
        list: map(content, i => {
          return i
        })
      }
    }
  })
  const showData = map(data?.list, i => {
    return {
      value: toFixed(i.rate, 1e18),
      date: formatToUTC0(i.validateTime, 'YYYY-MM-DD')
    }
  })
  const tvlEchartOpt = getLineEchartOpt(showData, 'value', 'date', {
    format: 'MM-DD',
    yAxisMin: value => {
      return (1 - Math.max(Math.abs(value.min - 1), Math.abs(value.max - 1))) * 0.97
    },
    yAxisMax: value => {
      return (1 + Math.max(Math.abs(value.min - 1), Math.abs(value.max - 1))) * 1.03
    },
    xAxis: {
      axisTick: {
        alignWithLabel: true
      }
    },
    yAxis: {
      axisLabel: {
        formatter: v => {
          return v.toFixed(6)
        }
      }
    },
    dataZoom: [
      {
        end: 100,
        start: showData.length < 30 ? 0 : 100 * (1 - 30 / showData.length)
      }
    ]
  })
  return (
    <GridContent>
      <Suspense fallback={null}>
        <VaultChange />
      </Suspense>
      <Suspense fallback={null}>
        <ChainChange />
      </Suspense>
      <Suspense fallback={null}>{!loading && <LineEchart option={tvlEchartOpt} style={{ minHeight: '37rem', width: '100%' }} />}</Suspense>
    </GridContent>
  )
}
export default USDIPrice
