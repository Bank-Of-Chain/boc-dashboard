import { Card, Table, Tooltip } from 'antd'
import React, { useState, useEffect } from 'react'
import { useModel } from 'umi'
import BN from 'bignumber.js'

// === Components === //
import { Desktop, Tablet, Mobile } from '@/components/Container/Container'

import { getStrategyDetailsReports } from '../../../../services/api-service'

// === Utils === //
import moment from 'moment'
import isUndefined from 'lodash/isUndefined'
import { toFixed } from './../../../../helper/number-format'

const OPERATION = {
  0: 'harvest',
  1: 'lend',
  2: 'withdraw',
  3: 'redeem'
}

const ReportTable = ({ loading, chainId, strategyAddress, dropdownGroup }) => {
  const { initialState } = useModel('@@initialState')
  const [dataSource, setDataSource] = useState([])
  const [tableLoading, setTableLoading] = useState(false)
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10
  })

  const unit = dataSource[0] ? dataSource[0].lpTokenUnit : ''

  const fetch = async () => {
    setTableLoading(true)
    getStrategyDetailsReports({
      strategyAddress,
      chainId,
      limit: pagination.pageSize,
      offset: (pagination.current - 1) * pagination.pageSize
    }).then((data) => {
      setDataSource(data.content)
      if (isUndefined(pagination.total)) {
        setPagination({
          ...pagination,
          total: data.totalElements
        })
      }
    }).catch(() => {
      setDataSource([])
    }).finally(() => {
      setTableLoading(false)
    })
  }

  useEffect(() => {
    fetch()
    // eslint-disable-next-line
  }, [pagination.current])

  useEffect(() => {
    setPagination({
      ...pagination,
      current: 1
    })
    // eslint-disable-next-line
  }, [chainId, strategyAddress])

  const handleTableChange = (pagination) => {
    setPagination(pagination)
  }

  // 固定6位
  const decimal = BN(1e6)

  const columns = [
    {
      title: 'Txn Hash',
      dataIndex: 'txnHash',
      key: 'txnHash',
      width: '20rem',
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
      title: `Total Asset ${unit ? `(${unit})` : ''}`,
      dataIndex: 'totalAsset',
      key: 'totalAsset',
      width: '7rem',
      render: text => <span>{toFixed(text, decimal, 2)}</span>,
    },
    {
      title: `Asset Change ${unit ? `(${unit})` : ''}`,
      dataIndex: 'assetChange',
      key: 'assetChange',
      width: '7rem',
      render: text => <span>{toFixed(text, decimal, 2)}</span>,
    },
    {
      title: 'Operation',
      dataIndex: 'fetchType',
      key: 'fetchType',
      width: '4.5rem',
      render: text => <span>{OPERATION[text]}</span>,
    },
    {
      title: 'Date',
      dataIndex: 'fetchTimestamp',
      key: 'fetchTimestamp',
      width: '5rem',
      render: text => (
        <Tooltip title={`${moment(1000 * text).utcOffset(0).format('yyyy-MM-DD HH:mm:ss')} UTC`}>
          {moment(1000 * text)
            .utcOffset(0)
            .locale('en')
            .fromNow()}
        </Tooltip>
      ),
    },
  ]
  return (
    <div>
      <Desktop>
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
            columns={columns}
            dataSource={dataSource}
            loading={tableLoading}
            onChange={handleTableChange}
            pagination={{
              style: {
                marginBottom: 0,
              },
              ...pagination,
            }}
          />
        </Card>
      </Desktop>
      <Tablet>
        <Card
          size='small'
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
            rowClassName='tablet-font-size'
            scroll={{ x: 900 }}
            columns={columns}
            dataSource={dataSource}
            loading={tableLoading}
            onChange={handleTableChange}
            pagination={{
              style: {
                marginBottom: 0,
              },
              ...pagination,
            }}
          />
        </Card>
      </Tablet>
      <Mobile>
        <Card
          size='small'
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
            rowClassName='mobile-font-size'
            scroll={{ x: 900 }}
            columns={columns}
            dataSource={dataSource}
            loading={tableLoading}
            onChange={handleTableChange}
            pagination={{
              style: {
                marginBottom: 0,
              },
              ...pagination,
            }}
          />
        </Card>
      </Mobile>
    </div>
  )
}

export default ReportTable
