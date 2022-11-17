import React, { useState } from 'react'

// === Components === //
import { Card, Table, Image, Switch, Tooltip, Badge, Space } from 'antd'
import CoinSuperPosition from '@/components/CoinSuperPosition'
import { useDeviceType, DEVICE_TYPE } from '@/components/Container/Container'
import Icon, { InfoCircleOutlined } from '@ant-design/icons'
import { GoIcon } from '@/components/SvgIcons'

// === Utils === //
import { useModel, useRequest } from 'umi'
import { toFixed, formatApyLabel } from '@/utils/number-format'
import { isEmpty, filter, isNil, map, sortBy } from 'lodash'
import BN from 'bignumber.js'
import { isMarketingHost } from '@/utils/location'

// === Services === //
import { getStrategyDetails } from '@/services/api-service'
import { TOKEN_DISPLAY_DECIMALS } from '@/constants/vault'

const StrategyTable = ({ loading, strategyMap, displayDecimals = TOKEN_DISPLAY_DECIMALS, unit = 'USD' }) => {
  const [showAll, setShowAll] = useState(true)
  const { initialState } = useModel('@@initialState')
  const deviceType = useDeviceType()
  const { data: searchData } = useRequest(() => getStrategyDetails(initialState.chain, initialState.vaultAddress, 0, 100), {
    formatResult: resp => sortBy(resp.content, ['strategyName'])
  })
  if (!initialState.chain) return null

  // boc-service fixed the number to 6
  const decimals = BN(1e18)
  const columns = [
    {
      title: (
        <Space>
          Name
          <Tooltip
            placement="topLeft"
            arrowPointAtCenter
            overlayStyle={{ width: 300 }}
            title="By clicking on the strategy name you will be directed to the strategy page with all the related information viewable, e.g., strategy profits and official APY."
          >
            <InfoCircleOutlined />
          </Tooltip>
        </Space>
      ),
      dataIndex: 'strategyName',
      key: 'strategyName',
      render: (text, item) => (
        <Space>
          <Image
            preview={false}
            width={30}
            src={`${IMAGE_ROOT}/images/amms/${strategyMap[initialState.chain][item.protocol]}.png`}
            placeholder={item.protocol}
            style={{ borderRadius: '50%' }}
            alt={strategyMap[initialState.chain][item.protocol]}
            fallback={`${IMAGE_ROOT}/default.png`}
          />
          <a
            title={text}
            target={'_blank'}
            rel="noreferrer"
            href={`${isMarketingHost() ? 'https://dashboard.bankofchain.io' : DASHBOARD_ROOT}/#/strategy?id=${item.strategyAddress}&chain=${
              initialState.chain
            }&vault=${initialState.vault}`}
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
      width: 100,
      render: text => !isEmpty(text) && <CoinSuperPosition array={text.split(',')} />
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
          <Tooltip placement="top" arrowPointAtCenter title="7 days">
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
          Realized APY
          <Tooltip placement="top" arrowPointAtCenter title="7 days">
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
          Unrealized APY
          <Tooltip placement="top" arrowPointAtCenter title="7 days">
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
          Realized Profit
          <Tooltip placement="top" arrowPointAtCenter title="7 days">
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
      title: 'Strategy Address',
      dataIndex: 'strategyAddress',
      key: 'strategyAddress',
      align: 'center',
      render: (text, item) => (
        <a target="_blank" rel="noreferrer" href={`${CHAIN_BROWSER_URL[initialState.chain]}/address/${item.strategyAddress}`}>
          <Icon component={GoIcon} />
        </a>
      )
    }
  ]
  const data = showAll ? searchData : filter(searchData, i => BN(i.totalAsset).gt(0))
  const responsiveConfig = {
    [DEVICE_TYPE.Desktop]: {},
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
    <div>
      <Card
        loading={loading}
        bordered={false}
        title={title}
        extra={
          <div>
            <Tooltip title="show all strategies added in vault">
              <span style={{ padding: 10 }}>Show All</span>
            </Tooltip>
            <Switch checked={showAll} onChange={() => setShowAll(!showAll)} />
          </div>
        }
        {...responsiveConfig.cardProps}
      >
        <Table
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
    </div>
  )
}

export default StrategyTable
