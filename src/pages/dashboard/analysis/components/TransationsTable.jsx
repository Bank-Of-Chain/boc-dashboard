import { Card, Table } from 'antd'
import React from 'react'
import Trend from './Trend'
import styles from '../style.less'
const columns = [
  {
    title: 'Txn Hash',
    dataIndex: 'index',
    key: 'index',
  },
  {
    title: 'Method',
    dataIndex: 'keyword',
    key: 'keyword',
  },
  {
    title: 'Account',
    dataIndex: 'count',
    key: 'count',
    className: styles.alignRight,
  },
  {
    title: 'From',
    dataIndex: 'range',
    key: 'range',
  },
  {
    title: 'Date',
    dataIndex: 'count',
    key: 'count',
    className: styles.alignRight,
  },
]

const TransationsTable = ({ loading, visitData2, searchData, dropdownGroup }) => (
  <Card
    loading={loading}
    bordered={false}
    title='Transations'
    extra={dropdownGroup}
    style={{
      height: '100%',
      marginTop: 32,
    }}
  >
    <Table
      rowKey={record => record.index}
      size='small'
      columns={columns}
      dataSource={searchData}
      pagination={{
        style: {
          marginBottom: 0,
        },
        pageSize: 5,
      }}
    />
  </Card>
)

export default TransationsTable
