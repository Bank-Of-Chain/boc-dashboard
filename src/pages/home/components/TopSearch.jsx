import React from 'react'

// === Components === //
import { Table, Image, Space } from 'antd'

// === Utils === //
import BN from 'bignumber.js'
import { toFixed } from '@/utils/number-format'
import { mapValues, values, groupBy, reduce, filter } from 'lodash'
import { useDeviceType, DEVICE_TYPE } from '@/components/Container/Container'

// === Jotai === //
import { useAtom } from 'jotai'
import { initialStateAtom } from '@/jotai'

// === Constants === //
import { IMAGE_ROOT } from '@/config/config'
import { STRATEGIES_MAP } from '@/constants/strategies'

const TopSearch = ({ tokenDecimals, displayDecimals, visitData = {}, unit }) => {
  const [initialState] = useAtom(initialStateAtom)
  const deviceType = useDeviceType()

  if (!initialState.chain) return null
  const { strategies = [], totalValueInVault = '0' } = visitData
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
          name: STRATEGIES_MAP[key],
          amount,
          percent: amount.div(tvl)
        }
      })
    ),
    {
      name: 'Vault',
      amount: BN(totalValueInVault),
      percent: tvl.eq(0) ? '0' : BN(totalValueInVault).div(tvl)
    }
  ]

  const columns = [
    {
      title: 'Protocol Name',
      dataIndex: 'name',
      key: 'name',
      render: text => (
        <Space>
          <Image
            width={30}
            preview={false}
            src={`${IMAGE_ROOT}/images/amms/${text}.png`}
            placeholder={text}
            alt={text}
            style={{ borderRadius: '50%' }}
            fallback={`${IMAGE_ROOT}/default.png`}
          />
          <span>{text}</span>
        </Space>
      )
    },
    {
      title: `Asset (${unit})`,
      dataIndex: 'amount',
      key: 'amount',
      showSorterTooltip: false,
      sorter: (a, b) => {
        return a.amount.minus(b.amount)
      },
      render: text => toFixed(text.toString(), tokenDecimals, displayDecimals)
    },
    {
      title: 'Asset Ratio',
      dataIndex: 'percent',
      key: 'percent',
      defaultSortOrder: 'descend',
      showSorterTooltip: false,
      sorter: (a, b) => {
        return a.percent.minus(b.percent)
      },
      render: text => <span>{toFixed(text, 1e-2, 2)}%</span>
    }
  ]

  const responsiveConfig = {
    [DEVICE_TYPE.Desktop]: {},
    [DEVICE_TYPE.Tablet]: {
      tableProps: {
        size: 'small',
        rowClassName: 'tablet-font-size'
      }
    },
    [DEVICE_TYPE.Mobile]: {
      tableProps: {
        size: 'small',
        rowClassName: 'tablet-font-size'
      }
    }
  }[deviceType]

  return (
    <div>
      <Table rowKey={record => record.name} columns={columns} dataSource={tableData} pagination={false} {...responsiveConfig.tableProps} />
    </div>
  )
}

export default TopSearch
