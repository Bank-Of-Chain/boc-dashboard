import { Card, Table } from 'antd'
import React from 'react'

// === Styles === //
import styles from '../style.less'

// === Utils === //
import moment from 'moment'

const columns = [
  {
    title: 'Txn Hash',
    dataIndex: 'id',
    key: 'id',
    render: text => <a>{text}</a>,
  },
  {
    title: 'Method',
    dataIndex: 'method',
    key: 'method',
    render: text => <a style={{ color: text === 'Deposit' ? '#80FF80' : '#FF8080' }}>{text}</a>,
  },
  {
    title: 'Account',
    dataIndex: 'address',
    key: 'address',
    className: styles.alignRight,
    render: text => <a>{text}</a>,
  },
  {
    title: 'From',
    dataIndex: 'from',
    key: 'from',
    render: text => <a>{text}</a>,
  },
  {
    title: 'Date',
    dataIndex: 'timestamp',
    key: 'timestamp',
    className: styles.alignRight,
    render: text => moment(Number(text)).format('YYYY-MM-DD HH:mm'),
  },
]

const TransationsTable = ({ loading, visitData, dropdownGroup }) => (
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

export default TransationsTable
