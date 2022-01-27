import { Card, Table, Tooltip,Button } from 'antd'
import React from 'react'
import { useModel } from 'umi'
import { MoreOutlined } from '@ant-design/icons';

// === Utils === //
import moment from 'moment'
import { toFixed } from './../../../../helper/number-format'
import { getDecimals } from './../../../../apollo/client'

const TransationsTable = ({ loading, visitData, dropdownGroup }) => {
  const { initialState } = useModel('@@initialState')
  const columns = [
    {
      title: 'Date',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: text => <Tooltip title={moment(1000 * text).format('yyyy-MM-DD HH:mm:ss')}>{moment(1000 * text).fromNow()}</Tooltip>,
    },
    {
      title: 'Account',
      dataIndex: 'from',
      key: 'from',
      width: 400,
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
      title: 'Method',
      dataIndex: 'method',
      key: 'method',
      render: text => <span style={{ color: text === 'Deposit' ? '#80FF80' : '#FF8080' }}>{text}</span>,
    },
    {
      title: 'Shares',
      width: 100,
      render: (text, item) =>
        `${toFixed(item.shares, getDecimals(), 2)}`,
    },
    {
      title: 'Shares Value (USDT)',
      width: 200,
      render: (text, item) =>
        `${toFixed(item.shareValue, getDecimals(), 2)}`,
    },
    {
      title: 'Detail',
      dataIndex: 'id',
      key: 'id',
      width: 100,
      ellipsis: {
        showTitle: false,
      },
      render: text => (
        <Button type="dashed" icon={<MoreOutlined />} size={'Default'}
                target={'_blank'}
                href={`${CHAIN_BROWSER_URL[initialState.chain]}/tx/${text}`}
                rel='noreferrer'
        />
      ),
    },
  ]
  return (
    <Card
      loading={loading}
      bordered={false}
      title='Transactions'
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
