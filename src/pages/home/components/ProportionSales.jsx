import React from 'react'

// === Components === //
import { Empty } from 'antd'
import { Donut } from '@ant-design/charts'

// === Utils === //
import BN from 'bignumber.js'
import { useModel } from 'umi'
import { toFixed } from '@/utils/number-format'
import { useDeviceType, DEVICE_TYPE } from '@/components/Container/Container'
import { reduce, mapValues, groupBy, values, filter, isEmpty } from 'lodash'

// === Styles === //
import styles from '../style.less'

const ProportionSales = ({ strategyMap, tokenDecimals, displayDecimals, visitData = {}, unit }) => {
  const { strategies = [], totalValueInVault = '0' } = visitData
  const { initialState } = useModel('@@initialState')
  const deviceType = useDeviceType()
  const suffix = ` (${unit})`

  if (!initialState.chain) return null

  const total = reduce(
    strategies,
    (rs, o) => {
      return rs.plus(o.totalValue)
    },
    BN(0)
  )
  const tvl = BN(totalValueInVault).plus(total)
  const groupData = groupBy(
    filter(strategies, i => i.totalValue > 0),
    'protocol'
  )
  const vaultDisplayValue = toFixed(tvl, tokenDecimals, displayDecimals)
  if ((isEmpty(groupData) && vaultDisplayValue <= 0) || isNaN(vaultDisplayValue)) return <Empty style={{ marginBottom: '1rem' }} />

  const tableData = [
    ...values(
      mapValues(groupData, (o, key) => {
        const amount = reduce(
          o,
          (rs, ob) => {
            return rs.plus(ob.totalValue)
          },
          BN(0)
        )
        return {
          Protocol: `${strategyMap[initialState.chain][key]}${suffix}`,
          amount: toFixed(amount, tokenDecimals, displayDecimals)
        }
      })
    ),
    {
      Protocol: `Vault${suffix}`,
      amount: toFixed(totalValueInVault, tokenDecimals, displayDecimals)
    }
  ]

  const responsiveConfig = {
    [DEVICE_TYPE.Desktop]: {
      legendProps: {
        position: 'bottom-center'
      }
    },
    [DEVICE_TYPE.Tablet]: {
      legendProps: {
        position: 'bottom-center'
      }
    },
    [DEVICE_TYPE.Mobile]: {
      legendProps: {
        position: 'bottom-center'
      }
    }
  }[deviceType]

  return (
    <div className={styles.chartWrapper}>
      <Donut
        forceFit
        padding="auto"
        angleField="amount"
        color={['#A68EFE', '#2ec7c9', '#5ab1ef', '#ffb980', '#d87a80', '#8d98b3', '#e5cf0d', '#97b552', '#95706d', '#dc69aa', '#07a2a4']}
        colorField="Protocol"
        data={tableData}
        legend={{
          visible: true,
          text: {
            style: {
              fill: '#fff'
            },
            formatter: value => {
              return value.replace(suffix, '')
            }
          },
          ...responsiveConfig.legendProps
        }}
        label={{
          visible: false,
          type: 'spider',
          offset: 20,
          formatter: (text, item) => {
            return `${item._origin.Protocol}: ${item._origin.amount}`
          }
        }}
        interactions={[{ type: 'element-selected' }, { type: 'element-active' }]}
        statistic={{
          visible: true,
          content: {
            value: toFixed(tvl, tokenDecimals, displayDecimals),
            name: `TVL${suffix}`
          }
        }}
      />
    </div>
  )
}

export default ProportionSales
