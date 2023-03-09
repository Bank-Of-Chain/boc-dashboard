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
import { isEmpty, map, reduce, groupBy, sortBy, get } from 'lodash'

// === Styles === //
import styles from './style.less'

const decimals = BigNumber.from(10).pow(18)

const UniswapV3PositionDetails = props => {
  const { strategyName, names } = props
  const deviceType = useDeviceType()

  const { initialState } = useModel('@@initialState')

  const { loading, result } = useAsync(() => {
    if (isEmpty(strategyName)) return
    const { chain, vaultAddress } = initialState
    const current = moment()
    const params = {
      end_seconds: current.format('X'),
      start_seconds: current.subtract(31, 'days').format('X'),
      types: 'base-amount0-for-liquidity,base-amount1-for-liquidity,limit-amount0-for-liquidity,limit-amount1-for-liquidity '
    }
    return getStrategyDataCollect(chain, vaultAddress, strategyName, params).then(({ content = [] }) => {
      const nextContent = content
      const nextArray = map(
        groupBy(
          map(nextContent, item => {
            const { type, result, blockNumber, blockTimestamp } = item
            return {
              blockNumber,
              blockTimestamp,
              [type]: toFixed(result, decimals, 6)
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
        data: map(result, item => formatToUTC0(1000 * item.blockTimestamp, 'YYYY-MM-DD HH:mm'))
      }
    ],
    yAxis: [
      {
        type: 'value'
      }
    ],
    color: ['#5470c6', '#73c0de', '#fc8452', '#fcb952'],
    series: [
      {
        name: `base ${get(names, '[0]', '')}`,
        type: 'bar',
        stack: 'A',
        data: map(result, 'base-amount0-for-liquidity')
      },
      {
        name: `base ${get(names, '[1]', '')}`,
        type: 'bar',
        stack: 'A',
        data: map(result, 'base-amount1-for-liquidity')
      },
      {
        name: `limit ${get(names, '[0]', '')}`,
        type: 'bar',
        stack: 'A',
        data: map(result, 'limit-amount0-for-liquidity')
      },
      {
        name: `limit ${get(names, '[1]', '')}`,
        type: 'bar',
        stack: 'A',
        data: map(result, 'limit-amount1-for-liquidity')
      }
    ]
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
      <div className={styles.cardTitle}>UniswapV3 Position Details</div>
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

export default UniswapV3PositionDetails
