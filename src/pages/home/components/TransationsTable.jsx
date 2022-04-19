import React, { useState, useEffect } from 'react'
import { Card, Table, Tooltip, Radio  } from 'antd'
import { useModel } from 'umi'

// === Utils === //
import moment from 'moment'
import map from 'lodash/map'
import BN from 'bignumber.js'
import { toFixed } from '@/utils/number-format'

import { USDi_DECIMALS } from '@/constants/usdi'
import { useDeviceType, DEVICE_TYPE } from '@/components/Container/Container'

import { RECENT_ACTIVITY_TYPE } from '@/constants/usdi'
import { getRecentActivity } from '@/services/dashboard-service'

const TransationsTable = ({ loading }) => {
  const { initialState } = useModel('@@initialState')
  const [data, setData] = useState([])
  const deviceType = useDeviceType()

  const FILTER_OPTIONS = {
    All: "All",
    ...RECENT_ACTIVITY_TYPE
  }
  const [filter, setFilter] = useState(FILTER_OPTIONS.All)

  useEffect(() => {
    const types = filter === FILTER_OPTIONS.All ? Object.values(RECENT_ACTIVITY_TYPE) : [filter]
    getRecentActivity(types).then(setData)
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
      },
      render: text => {
        const prefix = {
          [RECENT_ACTIVITY_TYPE.Mint]: '❇️',
          [RECENT_ACTIVITY_TYPE.Burn]: '🌹',
          [RECENT_ACTIVITY_TYPE.Rebase]: '🉑',
          [RECENT_ACTIVITY_TYPE.Transfer]: '🔆',
        }
        return (
          <span><span style={{ fontSize: 16 }}>{prefix[text]}</span>{text}</span>
        )
      },
    },
    {
      title: 'Detail',
      key: 'detail',
      render: (text, item) => {
        const { type, changeAmount, transferredAmount, toAccountUpdate, fromAccountUpdate } = item
        const changeValue = toFixed(changeAmount, USDi_DECIMALS, 2)
        const absChangeValue = toFixed(BN(changeAmount).abs(), USDi_DECIMALS, 2)
        const transferValue = toFixed(transferredAmount, USDi_DECIMALS, 2)
        const from = fromAccountUpdate?.account.id
        const to = toAccountUpdate?.account.id
        const fns = {
          Mint: () => <>{type} {changeValue} USDi to {renderAddress(to)}</>,
          Burn: () => <>{type} {absChangeValue} USDi from {renderAddress(from)}</>,
          Rebase: () => <>{type} {changeValue} raw yield</>,
          Transfer: () => <>{type} {transferValue} USDi from {renderAddress(from)} to {renderAddress(to)}</>,
        }
        return (
          <span style={{ whiteSpace: 'normal' }}>{fns[item.type]()}</span>
        )
      },
    },
    {
      title: 'Tx Address',
      dataIndex: 'id',
      key: 'id',
      ellipsis: {
        showTitle: false,
      },
      align: 'center',
      render: text => (
        <a
          target="_blank"
          rel="noreferrer"
          href={`${CHAIN_BROWSER_URL[initialState.chain]}/tx/${text}`}
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
          pagination={{
            style: {
              marginBottom: 0,
            },
            pageSize: 10,
          }}
          {...responsiveConfig.tableProps}
        />
      </Card>
    </div>
  )
}

export default TransationsTable
