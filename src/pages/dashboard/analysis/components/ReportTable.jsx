import { Card, Table } from 'antd'
import React from 'react'
import styles from '../style.less'
const columns = [
  {
    title: 'Txn Hash',
    dataIndex: 'count',
    key: 'count',
  },
  {
    title: 'Profit',
    dataIndex: 'count',
    key: 'count',
    render: text => <a href='/'>{text}</a>,
  },
  {
    title: 'Date',
    dataIndex: 'count',
    key: 'count',
    className: styles.alignRight,
  },
]

const ReportTable = ({ loading, visitData2, searchData, dropdownGroup }) => (
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

export default ReportTable
