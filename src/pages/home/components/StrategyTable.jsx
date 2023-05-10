import React, { useState } from 'react'

// === Components === //
import { Card, Table, Image, Switch, Tooltip, Badge, Space } from 'antd'
import CoinSuperPosition from '@/components/CoinSuperPosition'
import { useDeviceType, DEVICE_TYPE } from '@/components/Container/Container'
import { InfoCircleOutlined, FileTextOutlined } from '@ant-design/icons'

// === Hooks === //
import { useAsync } from 'react-async-hook'

// === Utils === //
import { toFixed, formatApyLabel } from '@/utils/number-format'
import { isEmpty, filter, isNil, map, sortBy } from 'lodash'
import BN from 'bignumber.js'
import { isMarketingHost } from '@/utils/location'

// === Services === //
import { getStrategyDetails } from '@/services/api-service'
import { TOKEN_DISPLAY_DECIMALS } from '@/constants/vault'

// === Jotai === //
import { useAtom } from 'jotai'
import { initialStateAtom } from '@/jotai'

// === Constants === //
import { CHAIN_BROWSER_URL } from '@/constants'
import { STRATEGIES_MAP } from '@/constants/strategies'
import { DASHBOARD_ROOT, IMAGE_ROOT } from '@/config/config'

const StrategyTable = props => {
  const { loading, displayDecimals = TOKEN_DISPLAY_DECIMALS, unit = 'USD' } = props

  const [showAll, setShowAll] = useState(true)
  const [initialState] = useAtom(initialStateAtom)
  const { vaultAddress, chain } = initialState
  const deviceType = useDeviceType()
  const { result: searchData, loading: dataLoading } = useAsync(
    () =>
      getStrategyDetails(initialState.chain, initialState.vaultAddress, 0, 100)
        .then(resp => sortBy(resp.data.content, ['strategyName']))
        .catch(() => []),
    [vaultAddress, chain]
  )
  console.log('data=', searchData)
  if (!initialState.chain) return null

  // boc-service fixed the number to 6
  const decimals = BN(1e18)
  const columns = [
    {
      title: 'Name',
      dataIndex: 'strategyName',
      key: 'strategyName',
      render: (text, item) => (
        <Space>
          <Image
            className="b-rd-50%"
            preview={false}
            width={30}
            src={`${IMAGE_ROOT}/images/amms/${STRATEGIES_MAP[item.protocol]}.png`}
            placeholder={item.protocol}
            alt={STRATEGIES_MAP[item.protocol]}
            fallback={`${IMAGE_ROOT}/default.png`}
          />
          <a
            title={text}
            target={'_blank'}
            rel="noreferrer"
            className="w-40 block truncate text-violet-400 hover:text-violet-500"
            href={`${CHAIN_BROWSER_URL[initialState.chain]}/address/${item.strategyAddress}`}
          >
            {text}
          </a>
        </Space>
      )
    },
    {
      title: 'Tokens',
      dataIndex: 'underlyingTokens',
      key: 'underlyingTokens',
      render: text => !isEmpty(text) && <CoinSuperPosition className="min-w-20" array={text.split(',')} />
    },
    {
      title: `Asset (${unit})`,
      dataIndex: 'totalAssetBaseCurrent',
      key: 'totalAssetBaseCurrent',
      showSorterTooltip: false,
      defaultSortOrder: 'descend',
      sorter: (a, b) => {
        return BN(a.totalAssetBaseCurrent || '0').minus(BN(b.totalAssetBaseCurrent || '0'))
      },
      render: text => <span>{toFixed(text || '0', decimals, displayDecimals)}</span>
    },
    {
      title: (
        <Space>
          Official APY
          <Tooltip placement="top" arrow title="7 days">
            <InfoCircleOutlined />
          </Tooltip>
        </Space>
      ),
      dataIndex: 'officialWeeklyApy',
      key: 'officialWeeklyApy',
      showSorterTooltip: false,
      sorter: (a, b) => {
        return a.officialWeeklyApy - b.officialWeeklyApy
      },
      render: text => <span>{formatApyLabel((100 * text).toFixed(2))}%</span>
    },
    {
      title: (
        <Space>
          Harvested APY
          <Tooltip placement="top" arrow title="7 days">
            <InfoCircleOutlined />
          </Tooltip>
        </Space>
      ),
      dataIndex: 'realizedApy',
      key: 'realizedApy',
      showSorterTooltip: false,
      sorter: (a, b) => {
        const { value: aValue } = a.realizedApy || { value: '0' }
        const { value: bValue } = b.realizedApy || { value: '0' }
        return aValue - bValue
      },
      render: data => {
        if (isEmpty(data)) return <span>0.00%</span>
        const { value, detail } = data
        const jsxElement = <span>{formatApyLabel((100 * value).toFixed(2))}%</span>
        if (isEmpty(detail)) return jsxElement
        const nextWeekApyJsx = (
          <div>
            {map(detail, (i, index) => (
              <span key={index} style={{ display: 'block' }}>
                {i.feeName}: {formatApyLabel((100 * i.feeApy).toFixed(2))}%
              </span>
            ))}
          </div>
        )
        return (
          <span>
            {jsxElement}&nbsp;
            <Tooltip title={nextWeekApyJsx}>
              <InfoCircleOutlined />
            </Tooltip>
          </span>
        )
      }
    },
    {
      title: (
        <Space>
          Unharvested APY
          <Tooltip placement="top" arrow title="7 days">
            <InfoCircleOutlined />
          </Tooltip>
        </Space>
      ),
      dataIndex: 'unrealizedApy',
      key: 'unrealizedApy',
      showSorterTooltip: false,
      sorter: (a, b) => {
        const { value: aValue } = a.unrealizedApy || { value: '0' }
        const { value: bValue } = b.unrealizedApy || { value: '0' }
        return aValue - bValue
      },
      render: data => {
        if (isEmpty(data)) return <span>0.00%</span>
        const { value, detail } = data

        const jsxElement = <span>{formatApyLabel((100 * value).toFixed(2))}%</span>
        if (isEmpty(detail)) return jsxElement
        const nextWeekApyJsx = (
          <div>
            {map(detail, (i, index) => (
              <span key={index} style={{ display: 'block' }}>
                {i.feeName}: {formatApyLabel((100 * i.feeApy).toFixed(2))}%
              </span>
            ))}
          </div>
        )
        return (
          <span>
            {jsxElement}&nbsp;
            <Tooltip title={nextWeekApyJsx}>
              <InfoCircleOutlined />
            </Tooltip>
          </span>
        )
      }
    },
    {
      title: (
        <Space>
          Harvested Profit
          <Tooltip placement="top" arrow title="including government token and transaction fee of uni v3 in last 7 days">
            <InfoCircleOutlined />
          </Tooltip>
        </Space>
      ),
      dataIndex: 'weekProfit',
      key: 'weekProfit',
      render: (text = 0, item) => {
        const { estimateProfit, tokenUnit = '' } = item
        const withoutEstimate = isNil(estimateProfit)
        const jsxElement = (
          <Badge dot={!withoutEstimate} color="gold">
            <span style={{ color: '#BEBEBE' }}>
              {toFixed(text || '0', decimals, displayDecimals)} {tokenUnit || ''}
            </span>
          </Badge>
        )
        if (withoutEstimate) {
          return jsxElement
        }
        const nextWeekProfitJsx = (
          <span>
            Estimate Profit: {toFixed(estimateProfit, decimals, displayDecimals)} {tokenUnit || ''}
          </span>
        )
        return <Tooltip title={nextWeekProfitJsx}>{jsxElement}</Tooltip>
      }
    },
    {
      title: (
        <Space>
          Valuation Changed
          <Tooltip placement="top" arrow title="7 days">
            <InfoCircleOutlined />
          </Tooltip>
        </Space>
      ),
      dataIndex: 'weeklyAssetChanged',
      key: 'weeklyAssetChanged',
      render: text => {
        if (isEmpty(text)) return 'N/A'
        return toFixed(text, decimals, displayDecimals)
      }
    },
    {
      title: 'Strategy Report',
      dataIndex: 'strategyAddress',
      key: 'strategyAddress',
      align: 'center',
      render: (text, item) => (
        <a
          title={text}
          target={'_blank'}
          rel="noreferrer"
          href={`${isMarketingHost() ? 'https://dashboard.bankofchain.io' : DASHBOARD_ROOT}/#/strategy?id=${item.strategyAddress}&chain=${
            initialState.chain
          }&vault=${initialState.vault}`}
        >
          <FileTextOutlined className="text-violet-400 text-5" />
        </a>
      )
    }
  ]
  const data = showAll ? searchData : filter(searchData, i => BN(i.totalAsset).gt(0))
  const responsiveConfig = {
    [DEVICE_TYPE.Desktop]: {
      tableProps: {
        scroll: { x: 1000 }
      }
    },
    [DEVICE_TYPE.Tablet]: {
      cardProps: {
        size: 'small'
      },
      tableProps: {
        size: 'small',
        rowClassName: 'tablet-font-size',
        scroll: { x: 900 }
      }
    },
    [DEVICE_TYPE.Mobile]: {
      cardProps: {
        size: 'small'
      },
      tableProps: {
        size: 'small',
        rowClassName: 'mobile-font-size',
        scroll: { x: 900 }
      }
    }
  }[deviceType]

  let title = 'Vault Strategies Allocations'
  if (deviceType === DEVICE_TYPE.Mobile) {
    title = 'Strategies Allocations'
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
        <span>{title}</span>
        <div>
          <Tooltip title="show all strategies added in vault">
            <span className="pr-4">Show All</span>
          </Tooltip>
          <Switch checked={showAll} onChange={() => setShowAll(!showAll)} />
        </div>
      </div>
      <Table
        loading={dataLoading}
        rowKey={record => record.strategyAddress}
        columns={columns}
        dataSource={data}
        pagination={
          data?.length > 10 && {
            style: {
              marginBottom: 0
            },
            pageSize: 10
          }
        }
        {...responsiveConfig.tableProps}
      />
    </Card>
  )
}

export default StrategyTable
