import React, { useState, useEffect } from 'react'
import { Card, Table, Tooltip, Radio  } from 'antd'
import { useModel } from 'umi'

// === Utils === //
import moment from 'moment'
import map from 'lodash/map'
import BN from 'bignumber.js'
import { toLeastOneFixed } from '@/utils/number-format'

import { USDI_DECIMALS } from '@/constants/usdi'
import { useDeviceType, DEVICE_TYPE } from '@/components/Container/Container'

import { RECENT_ACTIVITY_TYPE } from '@/constants/usdi'
import { getRecentActivity } from '@/services/dashboard-service'

const TransationsTable = ({ loading, decimals = USDI_DECIMALS, token = 'USDi' }) => {
  const { initialState } = useModel('@@initialState')
  const [data, setData] = useState([])
  const [tableLoading, setTableLoading] = useState(false)
  const deviceType = useDeviceType()

  const FILTER_OPTIONS = {
    All: "All",
    ...RECENT_ACTIVITY_TYPE
  }
  const [filter, setFilter] = useState(FILTER_OPTIONS.All)
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    const types = filter === FILTER_OPTIONS.All ? Object.values(RECENT_ACTIVITY_TYPE) : [filter]
    setTableLoading(true)
    getRecentActivity(initialState.vault, initialState.chain, types).then(data => {
      setCurrentPage(1)
      setData(data)
    }).finally(() => {
      setTableLoading(false)
    })
    // eslint-disable-next-line
  }, [filter])

  const renderAddress = (address) => {
    return (
      <a
        target={'_blank'}
        href={`${CHAIN_BROWSER_URL[initialState.chain]}/address/${address}`}
        title={address}
        rel='noreferrer'
      >
        {address}
      </a>
    )
  }

  const tableColumnWidth = {
    [DEVICE_TYPE.Desktop]: ["10rem", "10rem", "25rem", "8rem"],
    [DEVICE_TYPE.Tablet]: ["8rem", "8rem", undefined, "8rem"],
    [DEVICE_TYPE.Mobile]: ["8rem", "8rem", undefined, "8rem"],
  }[deviceType]

  const columns = [
    {
      title: 'Date',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: text => (
        <Tooltip title={`${moment(1000 * text).utcOffset(0).format('yyyy-MM-DD HH:mm:ss')} (UTC)`}>
          {moment(1000 * text)
            .utcOffset(0)
            .locale('en')
            .fromNow()}
        </Tooltip>
      ),
    },
    {
      title: 'Method',
      dataIndex: 'type',
      key: 'type',
      ellipsis: {
        showTitle: false,
      }
    },
    {
      title: 'Detail',
      key: 'detail',
      render: (text, item) => {
        const { type, changeAmount, transferredAmount, toAccountUpdate, fromAccountUpdate } = item
        const changeValue = toLeastOneFixed(changeAmount, decimals)
        const absChangeValue = toLeastOneFixed(BN(changeAmount).abs(), decimals)
        const transferValue = toLeastOneFixed(transferredAmount, decimals)
        const from = fromAccountUpdate?.account.id
        const to = toAccountUpdate?.account.id
        const fns = {
          Mint: () => <>{type} <span>{changeValue}</span> {token} to {renderAddress(to)}</>,
          Burn: () => <>{type} <span>{absChangeValue}</span> {token} from {renderAddress(from)}</>,
          Rebase: () => <>{type} <span>{changeValue}</span> {token}</>,
          Transfer: () => <>{type} <span>{transferValue}</span> {token} from {renderAddress(from)} to {renderAddress(to)}</>,
        }
        return (
          <span style={{ whiteSpace: 'normal' }}>{fns[item.type]()}</span>
        )
      },
    },
    {
      title: 'Tx Address',
      key: 'tx',
      ellipsis: {
        showTitle: false,
      },
      align: 'center',
      render: (text, item) => (
        <a
          target="_blank"
          rel="noreferrer"
          href={`${CHAIN_BROWSER_URL[initialState.chain]}/tx/${item.transaction.id}`}
        >
          <img width={21} src="./images/link.png" alt="link" />
        </a>
      ),
    },
  ]

  columns.forEach((col, index) => { col.width = tableColumnWidth[index] })

  const handleChange = (e) => {
    setFilter(e.target.value)
  }

  const responsiveConfig = {
    [DEVICE_TYPE.Desktop]: {},
    [DEVICE_TYPE.Tablet]: {
      cardProps: {
        size: 'small'
      },
      radioGroupProps: {
        size: 'small'
      },
      tableProps: {
        size: 'small',
        scroll: { x: 800 }
      }
    },
    [DEVICE_TYPE.Mobile]: {
      cardProps: {
        size: 'small'
      },
      radioGroupProps: {
        size: 'small'
      },
      tableProps: {
        compact: true,
        size: 'small',
        scroll: { x: 800 }
      }
    }
  }[deviceType]

  return (
    <div>
      <Card
        loading={loading}
        bordered={false}
        title='Recent Activity'
        extra={
          <Radio.Group value={filter} onChange={handleChange} buttonStyle="outline" {...responsiveConfig.radioGroupProps}>
            {map(FILTER_OPTIONS, (value, key) => (
              <Radio.Button value={value} key={key}>{value}</Radio.Button>
            ))}
          </Radio.Group>
        }
        style={{
          height: '100%',
          marginTop: 32,
        }}
        {...responsiveConfig.cardProps}
      >
        <Table
          rowKey={record => record.id}
          columns={columns}
          dataSource={data}
          loading={tableLoading}
          pagination={{
            showSizeChanger: false,
            style: {
              marginBottom: 0,
            },
            current: currentPage,
            pageSize: 10,
            onChange: (page) => {
              setCurrentPage(page)
            }
          }}
          {...responsiveConfig.tableProps}
        />
      </Card>
    </div>
  )
}

export default TransationsTable
