import React from 'react'

// === Components === //
import { Card, Spin } from 'antd'
import { BarEchart } from '@/components/echarts'
import { useDeviceType, DEVICE_TYPE } from '@/components/Container/Container'

// === Hooks === //
import { useModel } from 'umi'
import { useAsync } from 'react-async-hook'

// === Services === //
import { getStrategyDataCollect } from '@/services/api-service'

// === Utils === //
import moment from 'moment'
import { BigNumber } from 'ethers'
import { formatToUTC0 } from '@/utils/date'
import { toFixed } from '@/utils/number-format'
import { isEmpty, map, reduce, groupBy, sortBy, get, sumBy, forEach } from 'lodash'

// === Styles === //
import styles from './style.less'

const decimals = BigNumber.from(10).pow(18)

const PositionDetails = props => {
  const { strategyName } = props
  const deviceType = useDeviceType()

  const { initialState } = useModel('@@initialState')

  const { loading, result } = useAsync(() => {
    if (isEmpty(strategyName)) return
    const { chain, vaultAddress } = initialState
    const current = moment()
    const params = {
      end_seconds: current.format('X'),
      start_seconds: current.subtract(31, 'days').format('X'),
      types: 'position-detail'
    }
    return getStrategyDataCollect(chain, vaultAddress, strategyName, params).then(({ content = [] }) => {
      const nextContent = content
      const nextArray = map(
        groupBy(
          map(nextContent, item => {
            const { type, result, blockNumber, blockTimestamp } = item
            const obj = JSON.parse(result)
            const nextAmounts = map(obj.amounts, item => toFixed(item, decimals, 4))
            const total = sumBy(nextAmounts, i => 1 * i)
            return {
              blockNumber,
              blockTimestamp,
              [type]: {
                ...obj,
                amounts: nextAmounts,
                total
              }
            }
          }),
          'blockNumber'
        ),
        items => {
          return reduce(
            items,
            (rs, item) => {
              return {
                ...rs,
                ...item
              }
            },
            {}
          )
        }
      )
      return sortBy(nextArray, 'blockNumber')
    })
  }, [initialState])

  const chartStyle = {
    height: 500
  }

  const chartResponsiveConfig = {
    [DEVICE_TYPE.Desktop]: {
      chartStyle
    },
    [DEVICE_TYPE.Tablet]: {
      cardProps: {
        size: 'small'
      },
      chartStyle
    },
    [DEVICE_TYPE.Mobile]: {
      cardProps: {
        size: 'small'
      },
      chartStyle: {
        ...chartStyle,
        height: 280
      }
    }
  }[deviceType]

  if (isEmpty(result)) {
    return ''
  }

  const firstItemTokens = get(result, '[0].position-detail.names', [])

  const nextSeries = map(firstItemTokens, (item, index) => {
    return {
      name: item,
      type: 'bar',
      stack: 'A',
      data: map(result, item => get(item, `position-detail.amounts[${index}]`, '0'))
    }
  })

  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      formatter: function (params) {
        // 这里鼠标悬浮显示对应item的每项数值
        var relVal = params[0].name

        forEach(firstItemTokens, (item, index) => {
          const val = params[index].data
          const total = get(result, `${params[index].dataIndex}.position-detail.total`, '0')
          const percents = total === '0' ? '0' : ((100 * val) / total).toFixed(2)
          relVal += `<br/>${params[index].marker} ${params[index].seriesName} : <span style="font-weight: bold">${val}(${percents}%)</span>`
        })

        return relVal
      }
    },
    textStyle: { color: '#fff' },
    legend: {
      textStyle: { color: '#fff' }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: [
      {
        type: 'category',
        axisTick: {
          alignWithLabel: true
        },
        data: map(result, item => formatToUTC0(1000 * item.blockTimestamp, 'YYYY-MM-DD HH:mm'))
      }
    ],
    yAxis: [
      {
        type: 'value'
      }
    ],
    series: nextSeries
  }
  return (
    <Card
      className={styles.offlineCard}
      bordered={false}
      style={{
        marginTop: 32
      }}
      {...chartResponsiveConfig.cardProps}
    >
      <div className={styles.cardTitle}>Position Details</div>
      <div style={chartResponsiveConfig.chartStyle}>
        {loading ? (
          <div className={styles.loadingContainer}>
            <Spin size="large" />
          </div>
        ) : (
          <BarEchart option={option} style={{ height: '100%', width: '100%' }} />
        )}
      </div>
    </Card>
  )
}

export default PositionDetails
