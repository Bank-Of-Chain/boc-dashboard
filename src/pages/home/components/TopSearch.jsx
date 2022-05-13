import { Table, Image } from 'antd'
import React from 'react'
import styles from '../style.less'
import { useModel } from 'umi'

// === Utils === //
import groupBy from 'lodash/groupBy'
import reduce from 'lodash/reduce'
import filter from 'lodash/filter'
import { mapValues, values } from 'lodash'
import { toFixed } from '@/utils/number-format'
import BN from 'bignumber.js'
import { useDeviceType, DEVICE_TYPE } from '@/components/Container/Container'

// 列表中的平台图标，直接使用透明背景即可
const withoutBackgroundColor = ['Vault']

const TopSearch = ({ tokenDecimals, displayDecimals, strategyMap, visitData = {}, unit }) => {
  const { initialState } = useModel('@@initialState')
  const deviceType = useDeviceType()

  if (!initialState.chain) return null
  const { strategies = [], totalAssets = '0' } = visitData
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
          name: strategyMap[initialState.chain][key],
          amount,
          percent: amount.div(totalAssets),
        }
      }),
    ),
    {
      name: 'Vault',
      amount: vaultPoolValue,
      percent: totalAssets === '0' ? 0 : vaultPoolValue.div(totalAssets),
    },
  ]

  const columns = [
    {
      title: 'Protocol Name',
      dataIndex: 'name',
      key: 'name',
      render: text => (
        <div className={styles.tableCell}>
          <Image
            width={30}
            preview={false}
            src={`${IMAGE_ROOT}/images/amms/${text}.png`}
            placeholder={text}
            alt={text}
            style={{ backgroundColor: withoutBackgroundColor.includes(text) ? 'transparent' : '#fff', borderRadius: '50%' }}
            fallback={`${IMAGE_ROOT}/default.png`}
          />
          <a className={styles.text}>{text}</a>
        </div>
      ),
    },
    {
      title: unit ? `Asset (${unit})` : 'Asset Amount',
      dataIndex: 'amount',
      key: 'amount',
      showSorterTooltip: false,
      sorter: (a, b) => {
        return a.amount.minus(b.amount)
      },
      render: text => toFixed(text.toString(), tokenDecimals, displayDecimals),
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
      render: text => <span>{toFixed(text, 1e-2, 2)}%</span>,
    },
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
      <Table
        rowKey={record => record.name}
        columns={columns}
        dataSource={tableData}
        pagination={{
          style: {
            marginBottom: 0,
          },
          pageSize: 10,
        }}
        {...responsiveConfig.tableProps}
      />
    </div>
  )
}

export default TopSearch
