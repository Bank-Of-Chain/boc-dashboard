import { Table, Image } from 'antd'
import React from 'react'
import styles from '../style.less'
import { useModel } from 'umi'

// === Components === //
import { Desktop, Tablet, Mobile } from '@/components/Container/Container'

// === Constants === //
import STRATEGIES_MAP from './../../../../constants/strategies'

// === Utils === //
import groupBy from 'lodash/groupBy'
import reduce from 'lodash/reduce'
import filter from 'lodash/filter'
import { mapValues, values } from 'lodash'
import { toFixed } from './../../../../helper/number-format'
import { getDecimals } from './../../../../apollo/client'
import BN from 'bignumber.js'

// 列表中的平台图标，直接使用透明背景即可
const withoutBackgroundColor = ['Vault']

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
          fallback={`${IMAGE_ROOT}/default.webp`}
        />
        <a className={styles.text}>{text}</a>
      </div>
    ),
  },
  {
    title: 'Asset (USD)',
    dataIndex: 'amount',
    key: 'amount',
    showSorterTooltip: false,
    sorter: (a, b) => {
      return a.amount.minus(b.amount)
    },
    render: text => toFixed(text.toString(), getDecimals(), 2),
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

const TopSearch = ({ loading, visitData = {}, dropdownGroup }) => {
  const { initialState } = useModel('@@initialState')
  if (!initialState.chain) return null
  const { strategies = [], tvl } = visitData
  const total = reduce(
    strategies,
    (rs, o) => {
      return rs.plus(o.debt)
    },
    BN(0),
  )
  const vaultPoolValue = BN(tvl).minus(total)

  const groupData = groupBy(
    filter(strategies, i => i.debt > 0),
    'protocol.id',
  )

  const tableData = [
    ...values(
      mapValues(groupData, (o, key) => {
        const amount = reduce(
          o,
          (rs, ob) => {
            return rs.plus(ob.debt)
          },
          BN(0),
        )
        return {
          name: STRATEGIES_MAP[initialState.chain][key],
          amount,
          percent: amount.div(tvl),
        }
      }),
    ),
    {
      name: 'Vault',
      amount: vaultPoolValue,
      percent: vaultPoolValue.div(tvl),
    },
  ]
  return (
    <div>
      <Desktop>
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
        />
      </Desktop>
      <Tablet>
        <Table
          rowKey={record => record.name}
          size='small'
          columns={columns}
          rowClassName='tablet-font-size'
          dataSource={tableData}
          pagination={{
            style: {
              marginBottom: 0,
            },
            pageSize: 10,
          }}
        />
      </Tablet>
      <Mobile>
        <Table
          rowKey={record => record.name}
          size='small'
          columns={columns}
          rowClassName='mobile-font-size'
          dataSource={tableData}
          pagination={{
            style: {
              marginBottom: 0,
            },
            pageSize: 10,
          }}
        />
      </Mobile>
    </div>
  )
}

export default TopSearch
