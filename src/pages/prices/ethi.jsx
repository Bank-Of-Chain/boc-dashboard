import React, { Suspense } from 'react'

// === Components === //
import { Spin } from 'antd'
import { LineEchart } from '@/components/echarts'
import VaultChange from '@/components/VaultChange'

// === Services === //
import { getPrices } from '@/services/price-service'

// === Jotai === //
import { useAtom } from 'jotai'
import { initialStateAtom } from '@/jotai'
import { useAsync } from 'react-async-hook'

// === Utils === //
import getLineEchartOpt from '@/components/echarts/options/line/getLineEchartOpt'
import map from 'lodash/map'
import { formatToUTC0 } from '@/utils/date'
import { toFixed } from '@/utils/number-format'

const ETHIPrice = () => {
  const [initialState] = useAtom(initialStateAtom)

  const { chain, vaultAddress } = initialState
  const { result, loading } = useAsync(
    () =>
      getPrices(chain, vaultAddress)
        .then(resp => resp.data.content)
        .catch(() => []),
    [chain, vaultAddress]
  )
  const showData = map(result, i => {
    return {
      value: toFixed(i.rate, 1e18),
      date: formatToUTC0(i.validateTime, 'YYYY-MM-DD')
    }
  })
  const tvlEchartOpt = getLineEchartOpt(showData, 'value', 'price', {
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
    <>
      <Suspense fallback={null}>
        <VaultChange />
      </Suspense>
      <Suspense fallback={null}>
        <Spin spinning={loading}>
          <LineEchart
            option={tvlEchartOpt}
            className="w-full min-h-148 p-8 mt-8"
            style={{
              background: 'linear-gradient(111.68deg,rgba(87,97,125,0.2) 7.59%,hsla(0,0%,100%,0.078) 102.04%)'
            }}
          />
        </Spin>
      </Suspense>
    </>
  )
}
export default ETHIPrice
