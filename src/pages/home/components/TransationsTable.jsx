import React, { useState, useEffect } from 'react'

// === Components === //
import { Card, Table, Tooltip, Radio, Select } from 'antd'
import { useDeviceType, DEVICE_TYPE } from '@/components/Container/Container'
import Icon from '@ant-design/icons'
import { GoIcon } from '@/components/SvgIcons'

// === Utils === //
import moment from 'moment'
import map from 'lodash/map'
import { omit } from 'lodash'
import compact from 'lodash/compact'
import BN from 'bignumber.js'
import { toLeastOneFixed, toFixed } from '@/utils/number-format'
import { getRecentActivity } from '@/services/dashboard-service'
import { getVaultConfig } from '@/utils/vault'

// === Jotai === //
import { useAtom } from 'jotai'
import { initialStateAtom } from '@/jotai'

// === Constants === //
import { USDI_DECIMALS } from '@/constants/usdi'
import { TOKEN_DISPLAY_DECIMALS } from '@/constants/vault'
import { RECENT_ACTIVITY_TYPE } from '@/constants/usdi'
import { CHAIN_BROWSER_URL } from '@/constants'

const { Option } = Select

const TransationsTable = props => {
  const { loading, dispalyDecimal = TOKEN_DISPLAY_DECIMALS, decimals = USDI_DECIMALS, token = 'USDi', filterOptions = RECENT_ACTIVITY_TYPE } = props
  const [initialState] = useAtom(initialStateAtom)
  const [data, setData] = useState([])
  const [tableLoading, setTableLoading] = useState(false)
  const deviceType = useDeviceType()

  const FILTER_OPTIONS = {
    All: 'All',
    ...omit(filterOptions, [filterOptions.Deposit])
  }
  const [filter, setFilter] = useState(FILTER_OPTIONS.All)
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    const nextFilter = [filter]
    if (filter === RECENT_ACTIVITY_TYPE.Mint) {
      nextFilter.push(RECENT_ACTIVITY_TYPE.Deposit)
    }
    const types = filter === FILTER_OPTIONS.All ? Object.values(filterOptions) : nextFilter
    setTableLoading(true)
    getRecentActivity(initialState.vault, initialState.chain, types)
      .then(datas => {
        const nextDatas = compact(
          map(datas, item => {
            if (
              item.type === filterOptions.Mint &&
              item?.toAccountUpdate?.account?.id?.toLowerCase() === getVaultConfig(initialState.vault)?.vaultBufferAddress?.toLowerCase()
            )
              return
            if (item.type === filterOptions.Deposit)
              return {
                ...item,
                type: filterOptions.Mint
              }
            return item
          })
        )
        setCurrentPage(1)
        setData(nextDatas)
      })
      .finally(() => {
        setTableLoading(false)
      })
  }, [filter])

  const renderAddress = address => {
    return (
      <a
        className="text-violet-400 hover:text-violet-500"
        target={'_blank'}
        href={`${CHAIN_BROWSER_URL[initialState.chain]}/address/${address}`}
        title={address}
        rel="noreferrer"
      >
        {address}
      </a>
    )
  }

  const tableColumnWidth = {
    [DEVICE_TYPE.Desktop]: ['10rem', '10rem', '25rem', '8rem'],
    [DEVICE_TYPE.Tablet]: ['8rem', '8rem', undefined, '8rem'],
    [DEVICE_TYPE.Mobile]: ['8rem', '8rem', undefined, '8rem']
  }[deviceType]

  const columns = [
    {
      title: 'Date',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: text => (
        <Tooltip
          title={`${moment(1000 * text)
            .utcOffset(0)
            .format('yyyy-MM-DD HH:mm:ss')} (UTC)`}
        >
          {moment(1000 * text)
            .utcOffset(0)
            .locale('en')
            .fromNow()}
        </Tooltip>
      )
    },
    {
      title: 'Operation',
      dataIndex: 'type',
      key: 'type',
      ellipsis: {
        showTitle: false
      }
    },
    {
      title: 'Details',
      key: 'detail',
      render: (text, item) => {
        const { type, transferredAmount, toAccountUpdate, fromAccountUpdate, totalSupplyChangeAmount } = item
        const rebaseValue = toLeastOneFixed(totalSupplyChangeAmount, decimals, dispalyDecimal)
        const absChangeValue = toLeastOneFixed(BN(transferredAmount).abs(), decimals, dispalyDecimal)
        const transferValue = toLeastOneFixed(transferredAmount, decimals, dispalyDecimal)
        const rebaseValueTitle = toFixed(totalSupplyChangeAmount, BN(10 ** decimals))
        const absChangeValueTitle = toFixed(BN(transferredAmount).abs(), BN(10 ** decimals))
        const transferValueTitle = toFixed(transferredAmount, BN(10 ** decimals))
        const from = fromAccountUpdate?.account?.id
        const to = toAccountUpdate?.account?.id
        const fns = {
          Mint: () => (
            <>
              {type} <span title={transferValueTitle}>{transferValue}</span> {token} to {renderAddress(to)}
            </>
          ),
          Burn: () => (
            <>
              {type} <span title={absChangeValueTitle}>{absChangeValue}</span> {token} from {renderAddress(from)}
            </>
          ),
          Rebase: () => (
            <>
              {type} <span title={rebaseValueTitle}>{rebaseValue}</span> {token}
            </>
          ),
          Transfer: () => (
            <>
              {type} <span title={transferValueTitle}>{transferValue}</span> {token} from {renderAddress(from)} to {renderAddress(to)}
            </>
          )
        }
        return <span style={{ whiteSpace: 'normal' }}>{fns[item.type]()}</span>
      }
    },
    {
      title: 'Tx Address',
      key: 'tx',
      ellipsis: {
        showTitle: false
      },
      align: 'center',
      render: (text, item) => (
        <a target="_blank" rel="noreferrer" href={`${CHAIN_BROWSER_URL[initialState.chain]}/tx/${item.transaction.id}`}>
          <Icon component={GoIcon} />
        </a>
      )
    }
  ]

  columns.forEach((col, index) => {
    col.width = tableColumnWidth[index]
  })

  const handleChange = e => {
    if (typeof e === 'string') {
      setFilter(e)
    } else {
      setFilter(e.target.value)
    }
  }

  const responsiveConfig = {
    [DEVICE_TYPE.Desktop]: {
      radioGroupProps: {
        size: 'middle'
      }
    },
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

  let extra = (
    <Radio.Group
      className="b-1 b-solid b-color-violet-400 border-rd"
      value={filter}
      onChange={handleChange}
      buttonStyle="solid"
      {...responsiveConfig.radioGroupProps}
    >
      {map(FILTER_OPTIONS, (value, key) => (
        <Radio.Button className="b-l-1 b-solid b-color-violet-400 text-violet-400 bg-transparent !b-rd-0" value={value} key={key}>
          {key}
        </Radio.Button>
      ))}
    </Radio.Group>
  )
  if (deviceType === DEVICE_TYPE.Mobile) {
    extra = (
      <Select style={{ width: 120 }} value={filter} onChange={handleChange}>
        {map(FILTER_OPTIONS, (value, key) => (
          <Option value={value} key={key}>
            {key}
          </Option>
        ))}
      </Select>
    )
  }

  return (
    <Card
      className="b-rd-5"
      style={{ background: 'linear-gradient(111.68deg,rgba(87,97,125,0.2) 7.59%,hsla(0,0%,100%,0.078) 102.04%)' }}
      loading={loading}
      bordered={false}
      {...responsiveConfig.cardProps}
    >
      <div className="flex justify-between align-center mb-4">
        <span>Recent Activity</span>
        {extra}
      </div>
      <Table
        rowKey={record => record.id}
        columns={columns}
        dataSource={data}
        loading={tableLoading}
        pagination={
          data?.length > 10 && {
            showSizeChanger: false,
            style: {
              marginBottom: 0
            },
            current: currentPage,
            pageSize: 10,
            onChange: page => {
              setCurrentPage(page)
            }
          }
        }
        {...responsiveConfig.tableProps}
      />
    </Card>
  )
}

export default TransationsTable
