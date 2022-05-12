import { Donut } from '@ant-design/charts'
import { Empty } from 'antd'
import React from 'react'
import { useModel } from 'umi'

// === Utils === //
import BN from 'bignumber.js'
import { reduce, mapValues, groupBy, values, filter, isEmpty } from 'lodash'
import { toFixed } from '@/utils/number-format'
import { USDI_BN_DECIMALS } from '@/constants/usdi'
import { useDeviceType, DEVICE_TYPE } from '@/components/Container/Container'

// === Constants === //
import STRATEGIES_MAP from '@/constants/strategies'
import styles from '../style.less'

const ProportionSales = ({ loading, visitData = {} }) => {
  const { strategies = [], totalValueInVault = '0' } = visitData
  const { initialState } = useModel('@@initialState')
  const deviceType = useDeviceType()
  const suffix = ' (USD)'

  if (!initialState.chain) return null

  const total = reduce(
    strategies,
    (rs, o) => {
      return rs.plus(o.totalValue)
    },
    BN(0),
  )
  const tvl = BN(totalValueInVault).plus(total)
  const groupData = groupBy(
    filter(strategies, i => i.totalValue > 0),
    'protocol',
  )
  if (isEmpty(groupData)) return <Empty />

  const tableData = [
    ...values(
      mapValues(groupData, (o, key) => {
        const amount = reduce(
          o,
          (rs, ob) => {
            return rs.plus(ob.totalValue)
          },
          BN(0),
        )
        return {
          Protocol: `${STRATEGIES_MAP[initialState.chain][key]}${suffix}`,
          amount: toFixed(amount, USDI_BN_DECIMALS, 2),
        }
      }),
    ),
    {
      Protocol: `Vault${suffix}`,
      amount: toFixed(totalValueInVault, USDI_BN_DECIMALS, 2),
    },
  ]

  const responsiveConfig = {
    [DEVICE_TYPE.Desktop]: {},
    [DEVICE_TYPE.Tablet]: {},
    [DEVICE_TYPE.Mobile]: {
      legendProps: {
        position: 'top'
      }
    }
  }[deviceType]

  return (
    <div className={styles.chartWrapper}>
      <Donut
        forceFit
        height={340}
        style={{
          position: 'absolute',
          width: '100%',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'rgba(0, 0, 0, 0.1)',
        }}
        radius={1}
        innerRadius={0.75}
        angleField='amount'
        colorField='Protocol'
        data={tableData}
        legend={{
          visible: true,
          text: {
            style: {
              fill: '#fff',
            },
            formatter: (value) => {
              return value.replace(suffix, '')
            },
          },
          ...responsiveConfig.legendProps
        }}
        label={{
          visible: false,
          type: 'spider',
          offset: 20,
          formatter: (text, item) => {
            return `${item._origin.Protocol}: ${item._origin.amount}`
          },
        }}
        interactions={[{ type: 'element-selected' }, { type: 'element-active' }]}
        statistic={{
          visible: true,
          content: {
            value: toFixed(tvl, USDI_BN_DECIMALS, 2),
            name: `TVL${suffix}`,
          },
        }}
      />
    </div>
  )
}

export default ProportionSales
