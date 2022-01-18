import { Card, Table } from 'antd'
import React from 'react'

// === Utils === //
import numeral from 'numeral'
import moment from 'moment'

// === Styles === //
import styles from '../style.less'
const columns = [
  {
    title: 'Txn Hash',
    dataIndex: 'id',
    key: 'id',
    width: 300,
    ellipsis: {
      showTitle: false,
    },
    render: text => <a title={text}>{text}</a>,
  },
  {
    title: 'Amount',
    dataIndex: 'usdtPrice',
    key: 'usdtPrice',
    render: text => <span>{numeral(text).format('0,0')}</span>
  },
  {
    title: 'Profit',
    dataIndex: 'profit',
    key: 'profit',
    render: text => <span>{numeral(text).format('0,0')}</span>
  },
  {
    title: 'Price',
    dataIndex: 'usdtPrice',
    key: 'usdtPrice',
    render: text => <span>{numeral(text).format('0,0')}</span>
  },
  {
    title: 'Date',
    dataIndex: 'timestamp',
    key: 'timestamp',
    render: text => moment(1000 * text).fromNow(),
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
