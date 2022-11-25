import React, { useEffect } from 'react'
import PropTypes from 'prop-types'

// === Components === //
import { Card, Table, Tooltip } from 'antd'
import { SlidersOutlined } from '@ant-design/icons'

import { useDeviceType, DEVICE_TYPE } from '@/components/Container/Container'
import { getStrategyDetailsReports } from '@/services/api-service'
import { VAULT_TYPE, TOKEN_DISPLAY_DECIMALS } from '@/constants/vault'
import { ETHI_DISPLAY_DECIMALS } from '@/constants/ethi'
import CoinSuperPosition from '@/components/CoinSuperPosition'

// === Utils === //
import moment from 'moment'
import map from 'lodash/map'
import BN from 'bignumber.js'
import isEmpty from 'lodash/isEmpty'
import { toFixed } from '@/utils/number-format'
import { useModel, useRequest } from 'umi'

const OPERATION = {
  0: 'harvest',
  1: 'lend',
  2: 'withdraw',
  3: 'redeem',
  4: 'exchange',
  5: 'rebalance'
}

const ReportTable = ({ loading, strategyName, dropdownGroup }) => {
  const { initialState } = useModel('@@initialState')
  const deviceType = useDeviceType()
  const isETHi = VAULT_TYPE.ETHi === initialState.vault
  const displayDecimals = {
    [VAULT_TYPE.USDi]: TOKEN_DISPLAY_DECIMALS,
    [VAULT_TYPE.ETHi]: ETHI_DISPLAY_DECIMALS
  }[initialState.vault]

  const {
    data,
    run,
    loading: tableLoading,
    pagination
  } = useRequest(
    pagination => {
      return getStrategyDetailsReports({
        strategyName,
        chainId: initialState.chain,
        vaultAddress: initialState.vaultAddress,
        limit: pagination.pageSize,
        offset: (pagination.current - 1) * pagination.pageSize,
        sort: 'fetch_index desc'
      }).catch(() => {
        return {
          content: [],
          total: 0
        }
      })
    },
    {
      manual: true,
      paginated: true,
      formatResult: resp => {
        const { content, totalElements } = resp
        return {
          list: content,
          total: totalElements
        }
      }
    }
  )
  const dataSource = data?.list
  const unit = dataSource && dataSource[0]?.lpTokenUnit ? ` (${dataSource[0]?.lpTokenUnit})` : ''

  useEffect(() => {
    run({
      ...pagination,
      current: 1
    })
  }, [initialState.chain, initialState.vault, strategyName])

  const decimal = BN(1e18)

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
        <a target={'_blank'} rel="noreferrer" href={`${CHAIN_BROWSER_URL[initialState.chain]}/tx/${text}`} title={text}>
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
        scroll: { x: 900 }
      }
    },
    [DEVICE_TYPE.Mobile]: {
      ...smallCardConfig,
      tableProps: {
        size: 'small',
        rowClassName: 'mobile-font-size',
        scroll: { x: 600 }
      }
    }
  }[deviceType]

  return (
    <div>
      <Card
        loading={loading}
        bordered={false}
        title="Reports"
        extra={dropdownGroup}
        style={{
          height: '100%',
          marginTop: 32
        }}
        {...responsiveConfig.cardProps}
      >
        <Table
          rowKey={record => record.id}
          columns={columns}
          dataSource={dataSource}
          loading={tableLoading}
          pagination={pagination}
          {...responsiveConfig.tableProps}
        />
      </Card>
    </div>
  )
}

ReportTable.propTypes = {
  loading: PropTypes.bool.isRequired,
  strategyName: PropTypes.string.isRequired,
  dropdownGroup: PropTypes.array
}

export default ReportTable
