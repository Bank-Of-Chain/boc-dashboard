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
import { filter, isEmpty, map, reduce, groupBy, sortBy } from 'lodash'

// === Styles === //
import styles from './style.less'

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
      start_seconds: current.subtract(8, 'days').format('X'),
      types: 'position-detail'
    }
    return getStrategyDataCollect(chain, vaultAddress, strategyName, params).then(({ content = [] }) => {
      const nextContent = filter(content, item => {
        if (item.type === 'limit-order-upper' || item.type === 'limit-order-lower') {
          return !isEmpty(item.result)
        }
        return true
      })
      const nextArray = map(
        groupBy(
          map(nextContent, item => {
            const { type, result, blockNumber, blockTimestamp } = item
            return {
              blockNumber,
              blockTimestamp,
              [type]: result
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

  const total = 600

  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
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
        data: ['3-3', '3-4', '3-5', '3-6', '3-7', '3-8', '3-9', '3-10', '3-11', '3-12']
      }
    ],
    yAxis: [
      {
        type: 'value'
      }
    ],
    series: [
      {
        name: 'A token',
        type: 'bar',
        stack: 'A',
        data: [120, 132, 101, 134, 90, 230, 210, 90, 230, 210],
        tooltip: {
          valueFormatter: value => {
            return `${value}(${((100 * value) / total).toFixed(2)}%)`
          }
        }
      },
      {
        name: 'B token',
        type: 'bar',
        stack: 'A',
        data: [220, 182, 191, 234, 290, 330, 310, 90, 230, 210],
        tooltip: {
          valueFormatter: value => {
            return `${value}(${((100 * value) / total).toFixed(2)}%)`
          }
        }
      }
    ]
  }

  if (isEmpty(result)) {
    return ''
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
      <div className={styles.cardTitle}>Token Ratio</div>
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
