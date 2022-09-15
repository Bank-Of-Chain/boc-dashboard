import React, { Suspense } from 'react'

// === Utils === //
import { useModel, useRequest } from 'umi'
import getLineEchartOpt from '@/components/echarts/options/line/getLineEchartOpt'
import map from 'lodash/map'

// === Components === //
import { GridContent } from '@ant-design/pro-layout'
import ChainChange from '@/components/ChainChange'
import { LineEchart } from '@/components/echarts'

// === Services === //
import { getPrices } from '@/services/price-service'
import BigNumber from 'bignumber.js'

const USDIPrice = () => {
  const { initialState } = useModel('@@initialState')

  const { data } = useRequest(() => getPrices(initialState.chain, initialState.vaultAddress), {
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
      value: i.rate,
      date: i.validateTime
    }
  })
  const tvlEchartOpt = getLineEchartOpt(showData, 'value', 'date', {
    format: 'MM-DD',
    yAxisMin: value => value.min,
    yAxisMax: value => value.max,
    xAxis: {
      axisTick: {
        alignWithLabel: true
      }
    },
    yAxis: {
      axisLabel: {
        formatter: v => {
          const value = new BigNumber(v).minus(1e17)
          return `${value.gt(0) ? '+' : ''} ${value.toFormat()}`
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
        <ChainChange />
      </Suspense>
      <Suspense fallback={null}>
        <LineEchart option={tvlEchartOpt} style={{ minHeight: '37rem', width: '100%' }} />
      </Suspense>
    </GridContent>
  )
}
export default USDIPrice
