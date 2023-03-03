import React from 'react'

// === Components === //
import { Card, Spin } from 'antd'
import { LineEchart } from '@/components/echarts'
import multipleLine from '@/components/echarts/options/line/multipleLine'
import { useDeviceType, DEVICE_TYPE } from '@/components/Container/Container'

// === Hooks === //
import { useModel } from 'umi'
import { useAsync } from 'react-async-hook'

// === Services === //
import { getStrategyDataCollect } from '@/services/api-service'

// === Utils === //
import moment from 'moment'
import { formatToUTC0 } from '@/utils/date'
import { toFixed } from '@/utils/number-format'
import { filter, isEmpty, map, reduce, groupBy, sortBy } from 'lodash'

// === Styles === //
import styles from './style.less'
import { BigNumber } from 'ethers'

const decimals = BigNumber.from(10).pow(18)

const PriceChart = props => {
  const { strategyName } = props
  const deviceType = useDeviceType()

  const { initialState } = useModel('@@initialState')

  const { loading, result } = useAsync(() => {
    const { chain, vaultAddress } = initialState
    const current = moment()
    const params = {
      end_seconds: current.format('X'),
      start_seconds: current.subtract(8, 'days').format('X'),
      types: 'current-price,base-order-lower,base-order-upper,limit-order-lower,limit-order-upper'
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
  }, [initialState, strategyName])

  const chartStyle = {
    height: 400
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

  const obj = {
    legend: {
      data: ['Base Order Upper', 'Base Order Lower', 'Current Price', 'Limit Order Upper', 'Limit Order Lower'],
      textStyle: { color: '#fff' }
    },
    xAxisData: map(result, item => formatToUTC0(1000 * item.blockTimestamp, 'YYYY-MM-DD HH:mm')),
    data: [
      { seriesName: 'Base Order Upper', seriesData: map(result, item => toFixed(item['base-order-upper'], decimals)), showSymbol: false },
      { seriesName: 'Base Order Lower', seriesData: map(result, item => toFixed(item['base-order-lower'], decimals)), showSymbol: false },
      { seriesName: 'Current Price', seriesData: map(result, item => toFixed(item['current-price'], decimals)), showSymbol: false },
      { seriesName: 'Limit Order Upper', seriesData: map(result, item => toFixed(item['limit-order-upper'], decimals)), showSymbol: false },
      { seriesName: 'Limit Order Lower', seriesData: map(result, item => toFixed(item['limit-order-lower'], decimals)), showSymbol: false }
    ],
    color: ['#70cef5', '#70cef5', '#b7a8e8', '#d89614', '#d89614'],
    yAxis: {
      min: value => {
        return Math.floor(value.min * 999) / 1000
      },
      max: value => {
        return Math.ceil(value.max * 1001) / 1000
      }
    },
    dataZoom: [
      {
        end: 100,
        start: 0
      }
    ],
    grid: {
      left: 50,
      right: 20
    }
  }
  const option = multipleLine(obj)

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
      <div className={styles.cardTitle}>Price Chart</div>
      <div style={chartResponsiveConfig.chartStyle}>
        {loading ? (
          <div className={styles.loadingContainer}>
            <Spin size="large" />
          </div>
        ) : (
          <LineEchart option={option} style={{ height: '100%', width: '100%' }} />
        )}
      </div>
    </Card>
  )
}

export default PriceChart
