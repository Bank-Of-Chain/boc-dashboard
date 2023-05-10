import React, { useState } from 'react'
import PropTypes from 'prop-types'

// === Components === //
import { Card, Table, Tooltip } from 'antd'
import { SlidersOutlined } from '@ant-design/icons'

import { useDeviceType, DEVICE_TYPE } from '@/components/Container/Container'
import { getStrategyDetailsReports } from '@/services/api-service'
import { VAULT_TYPE, TOKEN_DISPLAY_DECIMALS } from '@/constants/vault'
import { ETHI_DISPLAY_DECIMALS } from '@/constants/ethi'
import CoinSuperPosition from '@/components/CoinSuperPosition'

// === Hooks === //
import { useAsync } from 'react-async-hook'

// === Utils === //
import moment from 'moment'
import map from 'lodash/map'
import BN from 'bignumber.js'
import isEmpty from 'lodash/isEmpty'
import { toFixed } from '@/utils/number-format'

// === Jotai === //
import { useAtom } from 'jotai'
import { initialStateAtom } from '@/jotai'
import { useMemo } from 'react'

// === Constants === //
import { CHAIN_BROWSER_URL } from '@/constants'
import { DEFAULT_LIMIT } from '@/constants/pagination'

const OPERATION = {
  0: 'harvest',
  1: 'lend',
  2: 'withdraw',
  3: 'redeem',
  4: 'exchange',
  5: 'rebalance',
  6: 'remove strategy',
  7: 'add strategy'
}

const decimal = BN(1e18)

const ReportTable = ({ loading, strategyName, dropdownGroup }) => {
  const [page, setPage] = useState(1)
  const [initialState] = useAtom(initialStateAtom)
  const { vault, chain, vaultAddress } = initialState
  const deviceType = useDeviceType()
  const isETHi = VAULT_TYPE.ETHi === initialState.vault
  const displayDecimals = useMemo(() => {
    return vault === VAULT_TYPE.USDi ? TOKEN_DISPLAY_DECIMALS : ETHI_DISPLAY_DECIMALS
  }, [vault])

  const { result: data, loading: tableLoading } = useAsync(() => {
    return getStrategyDetailsReports({
      strategyName,
      chainId: initialState.chain,
      vaultAddress: initialState.vaultAddress,
      limit: DEFAULT_LIMIT,
      offset: (page - 1) * DEFAULT_LIMIT,
      sort: 'fetch_index desc'
    })
      .then(resp => {
        const {
          data: { content, totalElements }
        } = resp
        return {
          list: content,
          total: totalElements
        }
      })
      .catch(() => {
        return {
          content: [],
          total: 0
        }
      })
  }, [chain, vaultAddress, page])

  const dataSource = data?.list
  const unit = dataSource && dataSource[0]?.lpTokenUnit ? ` (${dataSource[0]?.lpTokenUnit})` : ''

  const columns = [
    {
      title: 'Date',
      dataIndex: 'fetchTimestamp',
      key: 'fetchTimestamp',
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
      title: 'Txn Hash',
      dataIndex: 'txnHash',
      key: 'txnHash',
      ellipsis: {
        showTitle: false
      },
      width: 400,
      render: text => (
        <a
          className="text-violet-400 hover:text-violet-500"
          target={'_blank'}
          rel="noreferrer"
          href={`${CHAIN_BROWSER_URL[initialState.chain]}/tx/${text}`}
          title={text}
        >
          {text}
        </a>
      )
    },
    {
      title: `Total Asset${unit}`,
      dataIndex: 'totalAsset',
      key: 'totalAsset',
      render: text => <span title={toFixed(text, decimal)}>{toFixed(text, decimal, displayDecimals)}</span>
    },
    {
      title: `Asset Variation${unit}`,
      dataIndex: 'assetChange',
      key: 'assetChange',
      render: (text, item) => {
        const { fetchType } = item
        return (
          <span title={toFixed(text, decimal)}>
            {OPERATION[fetchType]}
            {text !== '0' && ` (${toFixed(text, decimal, displayDecimals)})`}
          </span>
        )
      }
    },

    {
      title: 'Position Details',
      align: 'center',
      render: (text, item) => {
        const { tokens } = item
        if (isEmpty(tokens)) return <SlidersOutlined style={{ color: 'gray', fontSize: '1.5rem' }} />
        const nextTitle = map(tokens, ({ address, amount, asset }) => {
          return (
            <span key={address} style={{ display: 'flex' }}>
              <CoinSuperPosition size={19} array={[address]} />
              &nbsp;&nbsp;
              {toFixed(amount, decimal, displayDecimals)}
              {isETHi && `(${toFixed(asset, decimal, displayDecimals)}ETH)`}
              {!isETHi && `($${toFixed(asset, decimal, displayDecimals)})`}
            </span>
          )
        })
        return (
          <Tooltip placement="top" title={nextTitle}>
            <SlidersOutlined style={{ fontSize: '1.5rem' }} />
          </Tooltip>
        )
      }
    }
  ]

  const smallCardConfig = {
    cardProps: {
      size: 'small'
    },
    tableProps: {
      size: 'small',
      rowClassName: 'tablet-font-size',
      scroll: { x: 900 }
    }
  }
  const responsiveConfig = {
    [DEVICE_TYPE.Desktop]: {},
    [DEVICE_TYPE.Tablet]: {
      ...smallCardConfig,
      tableProps: {
        size: 'small',
        rowClassName: 'tablet-font-size',
        scroll: { x: 1500 }
      }
    },
    [DEVICE_TYPE.Mobile]: {
      ...smallCardConfig,
      tableProps: {
        size: 'small',
        rowClassName: 'mobile-font-size',
        scroll: { x: 1000 }
      }
    }
  }[deviceType]

  return (
    <Card
      loading={loading}
      className="b-rd-4"
      bordered={false}
      extra={dropdownGroup}
      style={{
        marginTop: 32,
        background: 'linear-gradient(111.68deg,rgba(87,97,125,0.2) 7.59%,hsla(0,0%,100%,0.078) 102.04%)'
      }}
      {...responsiveConfig.cardProps}
    >
      <div className="mb-4">Reports</div>
      <Table
        rowKey={record => record.id}
        columns={columns}
        dataSource={dataSource}
        loading={tableLoading}
        pagination={{
          onChange: nextPage => setPage(nextPage),
          total: data?.total,
          current: page,
          showSizeChanger: false
        }}
        {...responsiveConfig.tableProps}
      />
    </Card>
  )
}

ReportTable.propTypes = {
  loading: PropTypes.bool.isRequired,
  strategyName: PropTypes.string.isRequired,
  dropdownGroup: PropTypes.array
}

export default ReportTable
