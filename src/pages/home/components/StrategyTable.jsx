import { Card, Table, Image, Switch, Tooltip, Badge } from 'antd'
import React, { useState } from 'react'
import { useModel, useRequest } from 'umi'
import { filter, isNil } from 'lodash'

// === Components === //
import CoinSuperPosition from '@/components/CoinSuperPosition'
import { useDeviceType, DEVICE_TYPE } from '@/components/Container/Container'

// === Utils === //
import { toFixed } from '@/utils/number-format'
import BN from 'bignumber.js'

// === Services === //
import { getStrategyDetails } from '@/services/api-service'
import { TOKEN_DISPLAY_DECIMALS } from '@/constants/vault'

import styles from '../style.less'

const StrategyTable = ({ loading, strategyMap, displayDecimals = TOKEN_DISPLAY_DECIMALS, unit = 'USD' }) => {
  const [showAll, setShowAll] = useState(true)
  const { initialState } = useModel('@@initialState')
  const deviceType = useDeviceType()
  const { data: searchData } = useRequest(() => getStrategyDetails(initialState.chain, initialState.vaultAddress, 0, 100), {
    formatResult: resp => resp.content,
  })
  if (!initialState.chain) return null

  // boc-service fixed the number to 6
  const decimals = BN(1e6)
  const columns = [
    {
      title: 'Name',
      dataIndex: 'strategyName',
      key: 'strategyName',
      width: 320,
      render: (text, item) => (
        <div className={styles.tableCell}>
          <Image
            preview={false}
            width={30}
            src={`${IMAGE_ROOT}/images/amms/${
              strategyMap[initialState.chain][item.protocol]
            }.png`}
            placeholder={item.protocol}
            style={{ backgroundColor: '#fff', borderRadius: '50%' }}
            alt={strategyMap[initialState.chain][item.protocol]}
            fallback={`${IMAGE_ROOT}/default.png`}
          />
          <a
            target={'_blank'}
            rel='noreferrer'
            href={`${DASHBOARD_ROOT}/#/strategy?id=${item.strategyAddress}&chain=${initialState.chain}&vault=${initialState.vault}`}
            className={styles.text}
          >
            {text}
          </a>
        </div>
      ),
    },
    {
      title: 'Tokens',
      dataIndex: 'underlyingTokens',
      key: 'underlyingTokens',
      width: 130,
      render: text => <CoinSuperPosition array={text} />,
    },
    {
      title: `Asset (${unit})`,
      dataIndex: 'totalAssetBaseUsd',
      key: 'totalAssetBaseUsd',
      showSorterTooltip: false,
      defaultSortOrder: 'descend',
      sorter: (a, b) => {
        return BN(a.totalAssetBaseUsd || '0').minus(BN(b.totalAssetBaseUsd || '0'))
      },
      render: text => <span>{toFixed(text || '0', decimals, displayDecimals)}</span>,
    },
    {
      title: <Tooltip title='Official weekly average APY'>
        <span>Official APY</span>
      </Tooltip>,
      dataIndex: 'officialApyAvg',
      key: 'officialApyAvg',
      showSorterTooltip: false,
      sorter: (a, b) => {
        return a.officialApyAvg - b.officialApyAvg
      },
      render: text => <span>{(100 * text).toFixed(2)} %</span>,
    },
    {
      title: 'Weekly APY',
      dataIndex: 'apyLP',
      key: 'apyLP',
      showSorterTooltip: false,
      sorter: (a, b) => {
        return a.apyLP - b.apyLP
      },
      render: (text = 0, item) => {
        const { estimateApy } = item
        const withoutEstimate = isNil(estimateApy)
        const jsxElement = <Badge dot={!withoutEstimate} color="gold">
          <span>{(100 * text).toFixed(2)} %</span>
        </Badge>
        if (withoutEstimate) {
          return jsxElement
        }
        const nextWeekApyJsx = <span>Estimate Apy: {(100 * estimateApy).toFixed(2)} %</span>
        return <Tooltip title={nextWeekApyJsx}>
          {jsxElement}
        </Tooltip>
      }
    },
    {
      title: 'Weekly Profit',
      dataIndex: 'weeklyProfit',
      key: 'weeklyProfit',
      render: (text = 0, item) => {
        const { estimateProfit, tokenUnit = '' } = item
        const withoutEstimate = isNil(estimateProfit)
        const jsxElement = <Badge dot={!withoutEstimate} color="gold" >
          <span>{toFixed(text || '0', decimals, displayDecimals)} {tokenUnit || ''}</span>
        </Badge>
        if (withoutEstimate) {
          return jsxElement
        }
        const nextWeekProfitJsx = <span>Estimate Profit: {toFixed(estimateProfit, decimals, displayDecimals)} {tokenUnit || ''}</span>
        return <Tooltip title={nextWeekProfitJsx}>
          {jsxElement}
        </Tooltip>
      }
    },
    {
      title: 'Strategy Address',
      dataIndex: 'strategyAddress',
      key: 'strategyAddress',
      align: 'center',
      render: (text, item) => (
        <a
          target="_blank"
          rel="noreferrer"
          href={`${CHAIN_BROWSER_URL[initialState.chain]}/address/${item.strategyAddress}`}
        >
          <img width={21} src="./images/link.png" alt="link" />
        </a>
      ),
    },
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
        rowClassName: 'tablet-font-size'
      }
    },
    [DEVICE_TYPE.Mobile]: {
      cardProps: {
        size: 'small'
      },
      tableProps: {
        size: 'small',
        rowClassName: 'mobile-font-sizee'
      }
    }
  }[deviceType]

  return (
    <div>
      <Card
        loading={loading}
        bordered={false}
        title='Vault Strategies Allocations'
        extra={
          <div>
            <Switch checked={showAll} onChange={() => setShowAll(!showAll)} />
            <Tooltip title='show all strategies added in vault'>
              <span style={{ padding: 10 }}>Show All</span>
            </Tooltip>
          </div>
        }
        style={{
          height: '100%',
          marginTop: 40,
        }}
        {...responsiveConfig.cardProps}
      >
        <Table
          rowKey={record => record.strategyAddress}
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

export default StrategyTable
