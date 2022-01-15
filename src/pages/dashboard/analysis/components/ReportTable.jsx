import { Card, Table } from 'antd'
import React from 'react'

// === Utils === //
import moment from 'moment'

// === Styles === //
import styles from '../style.less'
const columns = [
  {
    title: 'Txn Hash',
    dataIndex: 'id',
    key: 'id',
    render: text => <a>{text}</a>,
  },
  {
    title: 'Amount',
    dataIndex: ['profit', 'amount'],
    key: 'amount',
  },
  {
    title: 'Profit',
    dataIndex: ['profit', 'usdtAmount'],
    key: 'profit',
  },
  {
    title: 'Price',
    dataIndex: ['profit', 'usdtPrice', 'price'],
    key: 'price',
  },
  {
    title: 'Date',
    dataIndex: 'timestamp',
    key: 'timestamp',
    render: text => moment(Number(text)).fromNow(),
  },
]

const ReportTable = ({ loading, visitData, dropdownGroup }) => (
  <Card
    loading={loading}
    bordered={false}
    title='Reports'
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
      dataSource={visitData}
      pagination={{
        style: {
          marginBottom: 0,
        },
        pageSize: 10,
      }}
    />
  </Card>
)

export default ReportTable
