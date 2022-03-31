import { Card, Table, Tooltip, Button } from 'antd'
import React from 'react'
import { useModel } from 'umi'
import { MoreOutlined } from '@ant-design/icons'

// === Components === //
import { Desktop, Tablet, Mobile } from '@/components/Container/Container'

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
      render: text => (
        <Tooltip title={`${moment(1000 * text).utcOffset(0).format('yyyy-MM-DD HH:mm:ss')} UTC`}>
          {moment(1000 * text)
            .utcOffset(0)
            .locale('en')
            .fromNow()}
        </Tooltip>
      ),
    },
    {
      title: 'Account',
      dataIndex: 'from',
      key: 'from',
      width: '22rem',
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
      render: text => (
        <span style={{ color: text === 'Deposit' ? '#80FF80' : '#FF8080' }}>{text}</span>
      ),
    },
    {
      title: 'Shares',
      render: (text, item) => `${toFixed(item.shares, getDecimals(), 2)}`,
    },
    {
      title: 'Shares Value (USDT)',
      width: '10rem',
      render: (text, item) => `${toFixed(item.shareValue, getDecimals(), 2)}`,
    },
    {
      title: 'Detail',
      dataIndex: 'id',
      key: 'id',
      width: '6rem',
      ellipsis: {
        showTitle: false,
      },
      render: text => (
        <Button
          type='dashed'
          icon={<MoreOutlined />}
          size={'Default'}
          target={'_blank'}
          href={`${CHAIN_BROWSER_URL[initialState.chain]}/tx/${text}`}
          rel='noreferrer'
        />
      ),
    },
  ]
  return (
    <div>
      <Desktop>
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
      </Desktop>
      <Tablet>
        <Card
          loading={loading}
          bordered={false}
          size='small'
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
            rowClassName='tablet-font-size'
            scroll={{ x: 900 }}
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
      </Tablet>
      <Mobile>
        <Card
          loading={loading}
          bordered={false}
          title='Transactions'
          size='small'
          extra={dropdownGroup}
          style={{
            height: '100%',
            marginTop: 32,
          }}
        >
          <Table
            compact
            rowKey={record => record.id}
            size='small'
            rowClassName='mobile-font-size'
            scroll={{ x: 900 }}
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
      </Mobile>
    </div>
  )
}

export default TransationsTable
