import { Card, Table, Image } from 'antd'
import React from 'react'
import styles from '../style.less'
import { history } from 'umi'
import { map } from 'lodash'

// === Components === //
import CoinSuperPosition from './CoinSuperPosition/index'

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    render: (text, item) => (
      <div className={styles.tableCell}>
        <Image
          preview={false}
          width={30}
          src={`./images/${item.protocol.id}.webp`}
          placeholder={item.protocol.id}
          alt={item.protocol.id}
        />
        <a className={styles.text}>{text}</a>
      </div>
    ),
  },
  {
    title: 'Wants',
    dataIndex: 'underlyingTokens',
    key: 'underlyingTokens',
    render: text => <CoinSuperPosition array={map(text, 'id')} />,
  },
  {
    title: 'Deposited',
    dataIndex: ['depositedAssets', 'amount'],
    key: 'deposit',
    render: text => <a>{text}</a>,
  },
  {
    title: 'Profit(week)',
    dataIndex: 'profitFactor',
    key: 'profitFactor',
  },
  {
    title: '',
    dataIndex: 'id',
    key: 'id',
    render: text => <a onClick={() => history.push(`/strategy/${text}`)}>Details</a>,
  },
]

const StrategyTable = ({ loading, searchData, dropdownGroup }) => (
  <Card
    loading={loading}
    bordered={false}
    title='Strategies'
    extra={dropdownGroup}
    style={{
      height: '100%',
      marginTop: 32,
    }}
  >
    <Table
      rowKey={record => record.id}
      size='small'
      columns={columns}
      dataSource={searchData}
      pagination={{
        style: {
          marginBottom: 0,
        },
        pageSize: 100,
      }}
    />
  </Card>
)

export default StrategyTable
