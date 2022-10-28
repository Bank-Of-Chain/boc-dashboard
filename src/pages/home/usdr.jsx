import React from 'react'
import { Suspense } from 'react'

// === Components === //
import { GridContent } from '@ant-design/pro-layout'
import { Row, Col, Card, Table, Radio } from 'antd'
import IntroduceRow from './components/IntroduceRow'
import { LineEchart } from '@/components/echarts'
import VaultChange from '@/components/VaultChange'
import ChainChange from '@/components/ChainChange'
import OnBuilding from '@/components/OnBuilding'

// === Constants === //
import { USDC_ADDRESS_MATIC } from '@/constants/tokens'
import { BN_6, BN_18 } from '@/constants/big-number'
import { TOKEN_DISPLAY_DECIMALS } from '@/constants/vault'

// === Services === //
import { getVerifiedApyInRiskOn, getOffcialApyInRiskOn, getApyInRiskOn, getProfitsByType } from '@/services/api-service'

// === Hooks === //
import useWallet from '@/hooks/useWallet'
import useVaultFactoryAll from '@/hooks/useVaultFactoryAll'
import { useAsync } from 'react-async-hook'

// === Utils === //
import numeral from 'numeral'
import map from 'lodash/map'
import _filter from 'lodash/filter'
import reduce from 'lodash/reduce'
import * as ethers from 'ethers'
import { toFixed } from '@/utils/number-format'
import { useState } from 'react'

// === Styles === //
import styles from './style.less'
import { MATIC } from '@/constants/chain'

const { BigNumber } = ethers

const CHAINS = [
  { label: 'Polygon', key: '137' }
  // { label: 'Arbitrum', key: '42161' }
]

const symbol = 'USDC'

const UsdrHome = props => {
  const { ori = false } = props?.location?.query
  const VAULT_FACTORY_ADDRESS = USDR.VAULT_FACTORY_ADDRESS[MATIC.id]

  const { userProvider } = useWallet()
  const { vaults, loading, holderInfo } = useVaultFactoryAll(VAULT_FACTORY_ADDRESS, userProvider)
  const calcArray = _filter(vaults, item => item?.wantInfo?.wantToken === USDC_ADDRESS_MATIC)
  const [filter, setFilter] = useState('All')

  const profits = useAsync(() => getProfitsByType(MATIC.id, 'USDr').catch(() => BigNumber.from('0')))

  const netMarketMakingAmountTotal = reduce(
    calcArray,
    (rs, item) => {
      if (!item.netMarketMakingAmount) {
        return rs
      }
      return rs.add(item.netMarketMakingAmount)
    },
    BigNumber.from(0)
  )
  const estimatedTotalAssetsTotal = reduce(
    calcArray,
    (rs, item) => {
      if (!item.estimatedTotalAssets) {
        return rs
      }
      return rs.add(item.estimatedTotalAssets)
    },
    BigNumber.from(0)
  )

  const currentBorrowTotal = reduce(
    calcArray,
    (rs, item) => {
      if (!item.currentBorrowWithCanonical) {
        return rs
      }
      return rs.add(item.currentBorrowWithCanonical)
    },
    BigNumber.from(0)
  )
  const totalCollateralTokenAmountTotal = reduce(
    calcArray,
    (rs, item) => {
      if (!item.totalCollateralTokenAmount) {
        return rs
      }
      return rs.add(item.totalCollateralTokenAmount)
    },
    BigNumber.from(0)
  )
  const depositTo3rdPoolTotalAssetsTotal = reduce(
    calcArray,
    (rs, item) => {
      if (!item.depositTo3rdPoolTotalAssets) {
        return rs
      }
      return rs.add(item.depositTo3rdPoolTotalAssets)
    },
    BigNumber.from(0)
  )

  const _stablecoinInvestorSetLen = holderInfo._stablecoinInvestorSetLen.toString()
  const introduceData = [
    {
      title: 'Deposit',
      tip: 'All Vault Net Deposit.',
      content: numeral(toFixed(netMarketMakingAmountTotal, BN_6)).format('0.[00]a'),
      loading,
      unit: symbol
    },
    {
      title: 'Current Value',
      tip: 'All Vault Current Value.',
      content: numeral(toFixed(estimatedTotalAssetsTotal, BN_6)).format('0.[00]a'),
      loading,
      unit: symbol
    },
    {
      title: 'Profits',
      tip: 'All Vault Profits.',
      content: numeral(toFixed(profits?.result?.result, BN_18, TOKEN_DISPLAY_DECIMALS)).format('0.[00]a'),
      loading,
      unit: symbol
    },
    {
      title: 'Holders',
      tip: 'Number Of USDr holders.',
      content: numeral(_stablecoinInvestorSetLen).format('0.[00]a'),
      loading,
      unit: ''
    },
    {
      title: 'AAVE Outstanding Loan',
      tip: 'All Vault AAVE Outstanding Loan.',
      content: numeral(toFixed(currentBorrowTotal, BN_6)).format('0.[00]a'),
      loading,
      unit: symbol
    },
    {
      title: 'AAVE Collateral',
      tip: 'All Vault AAVE Collateral.',
      content: numeral(toFixed(totalCollateralTokenAmountTotal, BN_6)).format('0.[00]a'),
      loading,
      unit: symbol
    },
    {
      title: 'Uniswap Position Value',
      tip: 'All Vault Uniswap Position Value.',
      content: numeral(toFixed(depositTo3rdPoolTotalAssetsTotal, BN_6)).format('0.[00]a'),
      loading,
      unit: symbol
    }
  ]

  const verifiedApy = useAsync(() => getVerifiedApyInRiskOn({ type: 'USDr' }), [VAULT_FACTORY_ADDRESS])
  const officialApy = useAsync(() => getOffcialApyInRiskOn({ type: 'USDr' }), [VAULT_FACTORY_ADDRESS])
  const sampleApy = useAsync(() => getApyInRiskOn({ underlyingToken: 'USD' }), [VAULT_FACTORY_ADDRESS])

  const uniswapApyOption = {
    animation: false,
    textStyle: {
      color: '#fff'
    },
    grid: {
      top: 40,
      left: '0%',
      right: '5%',
      bottom: '0%',
      containLabel: true
    },
    legend: {
      textStyle: {
        color: '#fff'
      }
    },
    tooltip: {
      trigger: 'axis',
      borderWidth: 0,
      backgroundColor: '#292B2E',
      textStyle: {
        color: '#fff'
      }
    },
    xAxis: {
      axisLabel: {},
      data: map(officialApy.result?.content, item => item.apyValidateTime),
      axisTick: {
        alignWithLabel: true
      }
    },
    yAxis: {
      splitLine: {
        lineStyle: {
          color: '#454459'
        }
      }
    },
    color: ['#A68EFE', '#2ec7c9', '#ffb980', '#d87a80', '#e5cf0d', '#97b552', '#8d98b3', '#07a2a4', '#95706d', '#dc69aa'],
    series: [
      {
        name: 'Official Weekly APY',
        data: map(officialApy.result?.content, item => (item.apy * 100).toFixed(2)),
        type: 'line',
        lineStyle: {
          width: 5,
          cap: 'round'
        },
        connectNulls: true,
        showSymbol: false
      },
      {
        name: 'Verified Weekly APY',
        data: map(verifiedApy.result?.content, item => (item.verifiedApy * 100).toFixed(2)),
        type: 'line',
        lineStyle: {
          width: 5,
          cap: 'round'
        },
        connectNulls: true,
        showSymbol: false
      }
    ]
  }
  if (ori) {
    uniswapApyOption.series.push(
      {
        name: 'Official Daily APY',
        data: map(officialApy.result?.content, item => (item.originApy * 100).toFixed(2)),
        type: 'line',
        lineStyle: {
          width: 5,
          cap: 'round'
        },
        connectNulls: true,
        showSymbol: false
      },
      {
        name: 'Verified Daily APY',
        data: map(verifiedApy.result?.content, item => (item.dailyVerifiedApy * 100).toFixed(2)),
        type: 'line',
        lineStyle: {
          width: 5,
          cap: 'round'
        },
        connectNulls: true,
        showSymbol: false
      }
    )
  }

  const sampleApyOption = {
    animation: false,
    textStyle: {
      color: '#fff'
    },
    grid: {
      top: 40,
      left: '0%',
      right: '5%',
      containLabel: true
    },
    tooltip: {
      trigger: 'axis',
      borderWidth: 0,
      backgroundColor: '#292B2E',
      textStyle: {
        color: '#fff'
      }
    },
    xAxis: {
      axisLabel: {},
      data: map(sampleApy.result?.data, item => item.apyValidateTime),
      axisTick: {
        alignWithLabel: true
      }
    },
    yAxis: {
      type: 'value',
      splitLine: {
        lineStyle: {
          color: '#454459'
        }
      }
    },
    dataZoom: [
      {
        type: 'slider'
      }
    ],
    color: ['#A68EFE', '#5470c6', '#91cc75'],
    series: [
      {
        data: map(sampleApy.result?.data, item => (item.apy * 100).toFixed(2)),
        type: 'line',
        lineStyle: {
          width: 5,
          cap: 'round'
        },
        smooth: false,
        connectNulls: true,
        showSymbol: false
      }
    ]
  }

  // TODO
  const dataSource = []

  const columns = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date'
    },
    {
      title: 'Operation',
      dataIndex: 'operation',
      key: 'operation'
    },
    {
      title: 'Details',
      dataIndex: 'details',
      key: 'details'
    },
    {
      title: 'Tx Address',
      dataIndex: 'tx',
      key: 'tx'
    }
  ]

  const FILTER_OPTIONS = { All: 'All', Create: 'Create', Deposit: 'Deposit', Burn: 'Burn' }
  const extra = (
    <Radio.Group value={filter} onChange={e => setFilter(e.target.value)} buttonStyle="solid" className={styles.buttons}>
      {map(FILTER_OPTIONS, (value, key) => (
        <Radio.Button value={value} key={key}>
          {value}
        </Radio.Button>
      ))}
    </Radio.Group>
  )

  return (
    <GridContent>
      <Row gutter={[0, 40]}>
        <Col span={24}>
          <Suspense fallback={null}>
            <VaultChange />
            <ChainChange chains={CHAINS} />
          </Suspense>
        </Col>
        <Col span={24}>
          <Suspense fallback={null}>
            <IntroduceRow data={introduceData} />
          </Suspense>
        </Col>
        <Col span={24}>
          <Suspense fallback={null}>
            <Card title="Uniswap APY (%)" loading={verifiedApy.loading || officialApy.loading}>
              {verifiedApy.error ? (
                <div style={{ minHeight: '10rem' }}>Error: {verifiedApy?.error?.message}</div>
              ) : (
                <LineEchart option={uniswapApyOption} style={{ minHeight: '500px', width: '100%' }} />
              )}
            </Card>
          </Suspense>
        </Col>
        <Col span={24}>
          <Suspense>
            <Card title="Sample APY (%)" loading={sampleApy.loading}>
              {sampleApy.error ? (
                <div style={{ minHeight: '10rem' }}>Error: {sampleApy.error.message}</div>
              ) : (
                <LineEchart option={sampleApyOption} style={{ minHeight: '500px', width: '100%' }} />
              )}
            </Card>
          </Suspense>
        </Col>
        <Col span={24}>
          <Suspense>
            <OnBuilding>
              <Card extra={extra} title="Recent Activity">
                <Table dataSource={dataSource} columns={columns} />
              </Card>
            </OnBuilding>
          </Suspense>
        </Col>
      </Row>
    </GridContent>
  )
}

export default UsdrHome
