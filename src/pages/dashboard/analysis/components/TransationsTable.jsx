import { Card, Table } from 'antd'
import React from 'react'
import { useModel } from 'umi'

// === Utils === //
import moment from 'moment'
import { toFixed } from './../../../../helper/number-format'
import { getDecimals } from './../../../../apollo/client'

const TransationsTable = ({ loading, visitData, dropdownGroup }) => {
  const { initialState } = useModel('@@initialState')
  const columns = [
    {
      title: 'Txn Hash',
      dataIndex: 'id',
      key: 'id',
      width: 200,
      ellipsis: {
        showTitle: false,
      },
      render: text => (
        <a
          target={'_blank'}
          href={`${CHAIN_BROWSER_URL[initialState.chain]}/tx/${text}`}
          title={text}
          rel='noreferrer'
        >
          {text}
        </a>
      ),
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
      width: 200,
      ellipsis: {
        showTitle: false,
      },
      render: text => (
        <a
          target={'_blank'}
          href={`${CHAIN_BROWSER_URL[initialState.chain]}/address/${text}`}
          title={text}
          rel='noreferrer'
        >
          {text}
        </a>
      ),
    },
    {
      title: 'Shares(USDT Amount)',
      width: 200,
      render: (text, item) =>
        `${toFixed(item.shares, getDecimals(), 2)}(${toFixed(item.shareValue, getDecimals(), 2)})`,
    },
    {
      title: 'From',
      dataIndex: 'from',
      key: 'from',
      width: 200,
      ellipsis: {
        showTitle: false,
      },
      render: text => (
        <a
          target={'_blank'}
          rel='noreferrer'
          href={`${CHAIN_BROWSER_URL[initialState.chain]}/address/${text}`}
          title={text}
        >
          {text}
        </a>
      ),
    },
    {
      title: 'Date',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: text => moment(1000 * text).fromNow(),
    },
  ]
  return (
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
}

export default TransationsTable
