import React from 'react'

// === Utils === //
import { useModel, useRequest } from 'umi'
import getLineEchartOpt from '@/components/echarts/options/line/getLineEchartOpt'
import map from 'lodash/map'
import { formatToUTC0 } from '@/utils/date'

// === Components === //
import { Row, Col } from 'antd'
import { LineEchart } from '@/components/echarts'

// === Services === //
import { getPrices } from '@/services/price-service'
import BigNumber from 'bignumber.js'

const ETHIPrice = () => {
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
      date: formatToUTC0(i.validateTime, 'MM-DD')
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
          const value = new BigNumber(v).minus(1e18)
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
    <Row>
      <Col span={24}>
        <LineEchart option={tvlEchartOpt} style={{ minHeight: '37rem', width: '100%' }} />
      </Col>
    </Row>
  )
}
export default ETHIPrice
