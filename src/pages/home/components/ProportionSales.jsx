import { Donut } from '@ant-design/charts'
import { Empty } from 'antd'
import React from 'react'
import { useModel } from 'umi'

// === Utils === //
import BN from 'bignumber.js'
import { reduce, mapValues, groupBy, values, filter, isEmpty } from 'lodash'
import { toFixed } from '@/utils/number-format'
import { getDecimals } from '@/apollo/client'
import { useDeviceType, MEDIA_TYPE } from '@/components/Container/Container'

// === Constants === //
import STRATEGIES_MAP from '@/constants/strategies'

const ProportionSales = ({ loading, visitData = {} }) => {
  const { strategies = [], totalAssets } = visitData
  const { initialState } = useModel('@@initialState')
  const deviceType = useDeviceType()

  if (!initialState.chain) return null

  const total = reduce(
    strategies,
    (rs, o) => {
      return rs.plus(o.debtRecordInVault)
    },
    BN(0),
  )
  const vaultPoolValue = BN(totalAssets).minus(total)
  const groupData = groupBy(
    filter(strategies, i => i.debtRecordInVault > 0),
    'protocol',
  )
  if (isEmpty(groupData)) return <Empty />

  const tableData = [
    ...values(
      mapValues(groupData, (o, key) => {
        const amount = reduce(
          o,
          (rs, ob) => {
            return rs.plus(ob.debtRecordInVault)
          },
          BN(0),
        )
        return {
          Protocol: STRATEGIES_MAP[initialState.chain][key],
          amount: toFixed(amount, getDecimals(), 2),
        }
      }),
    ),
    {
      Protocol: 'Vault',
      amount: toFixed(vaultPoolValue, getDecimals(), 2),
    },
  ]

  const responsiveConfig = {
    [MEDIA_TYPE.Desktop]: {},
    [MEDIA_TYPE.Tablet]: {},
    [MEDIA_TYPE.Mobile]: {
      legendProps: {
        position: 'top'
      }
    }
  }[deviceType]

  return (
    <div>
      <Donut
        forceFit
        height={340}
        style={{
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
            value: toFixed(totalAssets, getDecimals(), 2),
            name: 'TVL',
          },
        }}
      />
    </div>
  )
}

export default ProportionSales
