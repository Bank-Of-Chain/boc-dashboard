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
import { BigNumber } from 'ethers'
import { formatToUTC0 } from '@/utils/date'
import { toFixed } from '@/utils/number-format'
import { isEmpty, map, reduce, groupBy, sortBy, get } from 'lodash'

// === Styles === //
import styles from './style.less'

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
      start_seconds: current.subtract(31, 'days').format('X'),
      types: 'token-price'
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
              [type]: JSON.parse(result)
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

  const firstItemTokens = get(result, '[0].token-price', [])

  const nextData = map(firstItemTokens, (item, index) => {
    const tokenName = get(item, 'symbol')
    return {
      seriesName: `${tokenName} price`,
      seriesData: map(result, item => toFixed(`${get(item, `token-price.${index}.price`)}`, decimals, 6)),
      showSymbol: false
    }
  })

  const obj = {
    legend: {
      textStyle: { color: '#fff' }
    },
    xAxisData: map(result, item => formatToUTC0(1000 * item.blockTimestamp, 'YYYY-MM-DD HH:mm')),
    data: nextData,
    color: ['#70cef5', '#b7a8e8', '#d89614'],
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
