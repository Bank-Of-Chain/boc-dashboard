import { Card, Table, Tooltip } from 'antd'
import React from 'react'
import { useModel } from 'umi'

// === Utils === //
import moment from 'moment'
import { toFixed } from './../../../../helper/number-format'
import { getDecimals } from './../../../../apollo/client'

const ReportTable = ({ loading, visitData, dropdownGroup }) => {
  const { initialState } = useModel('@@initialState')
  const columns = [
    {
      title: 'Txn Hash',
      dataIndex: 'id',
      key: 'id',
      width: 550,
      ellipsis: {
        showTitle: false,
      },
      render: text => (
        <a
          target={'_blank'}
          rel='noreferrer'
          href={`${CHAIN_BROWSER_URL[initialState.chain]}/tx/${text}`}
          title={text}
        >
          {text}
        </a>
      ),
    },
    {
      title: 'Amount',
      dataIndex: 'nowStrategyTotalDebt',
      key: 'nowStrategyTotalDebt',
      width: 200,
      render: text => <span>{toFixed(text, getDecimals(), 2)}</span>,
    },
    {
      title: 'Profit',
      dataIndex: 'profit',
      key: 'profit',
      width: 200,
      render: text => <span>{toFixed(text, getDecimals(), 2)}</span>,
    },
    {
      title: 'Date',
      dataIndex: 'timestamp',
      key: 'timestamp',
      width: 200,
      render: text => (
        <Tooltip 
          title={moment(1000 * text).format('yyyy-MM-DD HH:mm:ss')}
        >
          {moment(1000 * text).locale('en').fromNow()}
        </Tooltip>
      ),
    },
  ]
  return (
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
}

export default ReportTable
