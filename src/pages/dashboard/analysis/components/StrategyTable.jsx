import { Card, Table, Image, Button, Switch, Tooltip } from 'antd'
import React, { useState } from 'react'
import styles from '../style.less'
import { useModel, useRequest } from 'umi'
import { filter } from 'lodash'

// === Constants === //
import STRATEGIES_MAP from './../../../../constants/strategies'

// === Components === //
import CoinSuperPosition from './CoinSuperPosition/index'
import { InfoCircleOutlined } from '@ant-design/icons'

// === Utils === //
import { toFixed } from './../../../../helper/number-format'
import { getDecimals } from './../../../../apollo/client'
import BN from 'bignumber.js'
import { MoreOutlined } from '@ant-design/icons'
import map from 'lodash/map'

// === Services === //
import { getStrategyDetails } from '@/services/api-service'

const StrategyTable = ({ dropdownGroup }) => {
  const [showAll, setShowAll] = useState(false)
  const { initialState } = useModel('@@initialState')
  const { data: searchData, loading } = useRequest(
    () => getStrategyDetails(initialState.chain, 0, 100),
    {
      formatResult: resp => resp.content,
    },
  )
  if (!initialState.chain) return null
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
            src={`https://bankofchain.io/images/amms/${
              STRATEGIES_MAP[initialState.chain][item.protocol]
            }.png`}
            placeholder={item.protocol.id}
            style={{ backgroundColor: '#fff', borderRadius: '50%' }}
            alt={STRATEGIES_MAP[initialState.chain][item.protocol.id]}
            fallback={`https://bankofchain.io/default.webp`}
          />
          <a
            target={'_blank'}
            rel='noreferrer'
            href={`${CHAIN_BROWSER_URL[initialState.chain]}/address/${item.strategyAddress}`}
            className={styles.text}
          >
            {text}
          </a>
        </div>
      ),
    },
    {
      title: 'Wants',
      dataIndex: 'underlyingTokens',
      key: 'underlyingTokens',
      render: text => <CoinSuperPosition array={text} />,
    },
    {
      title: 'Asset (USDT)',
      dataIndex: 'totalAsset',
      key: 'totalAsset',
      showSorterTooltip: false,
      defaultSortOrder: 'descend',
      sorter: (a, b) => {
        return BN(a.totalAsset || '0').minus(BN(b.totalAsset || '0'))
      },
      render: text => <span>{toFixed(text || '0', getDecimals(), 2)}</span>,
    },
    {
      title: (
        <Tooltip title='official apy'>
          <span>APY</span> <InfoCircleOutlined />
        </Tooltip>
      ),
      dataIndex: 'apyOffLatest',
      key: 'apyOffLatest',
      showSorterTooltip: false,
      sorter: (a, b) => {
        return a.apyOffLatest - b.apyOffLatest
      },
      render: (text, item) => {
        return (
          <Tooltip
            title={[
              <p key={`${item.strategyAddress}-apyLP`} style={{ marginBottom: 0, borderBottom: '1px solid rgba(200, 200, 200, 0.85)' }}>
                LP apy : {(100 * item.apyLP).toFixed(2)}%
                <br />
              </p>,
              ...map(item.weeklyProfit, (i, index) => (
                <p key={index} style={{ marginBottom: 0 }}>
                  {toFixed(i.value, getDecimals(), 2)} {i.unit}
                </p>
              )),
            ]}
          >
            <a>{(100 * text).toFixed(2)} %</a>
          </Tooltip>
        )
      },
    },
    {
      title: 'Detail',
      dataIndex: 'strategyAddress',
      key: 'strategyAddress',
      width: 90,
      render: text => (
        <Button
          type='dashed'
          icon={<MoreOutlined />}
          size={'Default'}
          target={'_blank'}
          href={`${IMAGE_ROOT}/#/strategy?id=${text}&chain=${initialState.chain}`}
          rel='noreferrer'
        />
      ),
    },
  ]
  const data = showAll ? searchData : filter(searchData, i => BN(i.totalAsset).gt(0))
  return (
    <Card
      loading={loading}
      bordered={false}
      title='Strategies Allocations'
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
        marginTop: 32,
      }}
    >
      <Table
        rowKey={record => record.strategyAddress}
        size='small'
        columns={columns}
        dataSource={data}
        pagination={{
          style: {
            marginBottom: 0,
          },
          pageSize: 10,
        }}
      />
    </Card>
  )
}

export default StrategyTable
