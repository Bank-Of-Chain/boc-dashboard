import React, { useState, Suspense } from 'react'

// === Components === //
import { GridContent } from '@ant-design/pro-layout'
import { Row, Col, Card, Table, Radio, Tooltip } from 'antd'
import IntroduceRow from './components/IntroduceRow'
import { LineEchart } from '@/components/echarts'
import VaultChange from '@/components/VaultChange'
import ChainChange from '@/components/ChainChange'
import OnBuilding from '@/components/OnBuilding'
import { InfoCircleOutlined } from '@ant-design/icons'

// === Constants === //
import { WETH_ADDRESS_MATIC } from '@/constants/tokens'
import { BN_18 } from '@/constants/big-number'
import { MATIC } from '@/constants/chain'
import { ETHI_DISPLAY_DECIMALS } from '@/constants/ethi'

// === Services === //
import { getVerifiedApyInRiskOn, getOffcialApyInRiskOn, getApyInRiskOn, getProfitsByType } from '@/services/api-service'

// === Hooks === //
import useWallet from '@/hooks/useWallet'
import useVaultFactoryAll from '@/hooks/useVaultFactoryAll'
import { useAsync } from 'react-async-hook'

// === Utils === //
import numeral from 'numeral'
import _filter from 'lodash/filter'
import map from 'lodash/map'
import reduce from 'lodash/reduce'
import size from 'lodash/size'
import forEach from 'lodash/forEach'
import find from 'lodash/find'
import * as ethers from 'ethers'
import { toFixed } from '@/utils/number-format'

// === Styles === //
import styles from './style.less'

const { BigNumber } = ethers

const CHAINS = [
  { label: 'Polygon', key: '137' }
  // { label: 'Arbitrum', key: '42161' }
]

const symbol = 'WETH'

const EthrHome = props => {
  const { ori = false } = props?.location?.query
  const VAULT_FACTORY_ADDRESS = USDR.VAULT_FACTORY_ADDRESS[MATIC.id]

  const { userProvider } = useWallet()
  const { vaults, loading, holderInfo } = useVaultFactoryAll(VAULT_FACTORY_ADDRESS, userProvider)
  const calcArray = _filter(vaults, item => item?.wantInfo?.wantToken === WETH_ADDRESS_MATIC)
  const [filter, setFilter] = useState('All')

  const profits = useAsync(() => getProfitsByType(MATIC.id, 'ETHr').catch(() => BigNumber.from('0')))

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

  const _wethInvestorSetLen = holderInfo._wethInvestorSetLen.toString()

  const introduceData = [
    {
      title: 'Deposit',
      tip: 'All Vault Net Deposit.',
      content: numeral(toFixed(netMarketMakingAmountTotal, BN_18)).format('0.[0000]a'),
      loading,
      unit: symbol
    },
    {
      title: 'Current Value',
      tip: 'All Vault Current Value.',
      content: numeral(toFixed(estimatedTotalAssetsTotal, BN_18)).format('0.[0000]a'),
      loading,
      unit: symbol
    },
    {
      title: 'Profits',
      tip: 'All Vault Profits.',
      content: numeral(toFixed(profits?.result?.result, BN_18, ETHI_DISPLAY_DECIMALS)).format('0.[0000]a'),
      loading,
      unit: symbol
    },
    {
      title: 'Holders',
      tip: 'Number Of ETHr holders.',
      content: numeral(_wethInvestorSetLen).format('0.[0000]a'),
      loading,
      unit: ''
    },
    {
      title: 'AAVE Outstanding Loan',
      tip: 'All Vault AAVE Outstanding Loan.',
      content: numeral(toFixed(currentBorrowTotal, BN_18)).format('0.[0000]a'),
      loading,
      unit: symbol
    },
    {
      title: 'AAVE Collateral',
      tip: 'All Vault AAVE Collateral.',
      content: numeral(toFixed(totalCollateralTokenAmountTotal, BN_18)).format('0.[0000]a'),
      loading,
      unit: symbol
    },
    {
      title: 'Uniswap Position Value',
      tip: 'All Vault Uniswap Position Value.',
      content: numeral(toFixed(depositTo3rdPoolTotalAssetsTotal, BN_18)).format('0.[0000]a'),
      loading,
      unit: symbol
    }
  ]

  const officialApy = useAsync(() => getOffcialApyInRiskOn({ type: 'ETHr' }), [VAULT_FACTORY_ADDRESS])
  const verifiedApy = useAsync(() => getVerifiedApyInRiskOn({ type: 'ETHr' }), [VAULT_FACTORY_ADDRESS])
  const dateArray = []
  const verifiedApyArray = []
  const verifiedDailyApyArray = []
  // Maybe the data of verifiedApy is less than officialApy
  forEach(officialApy.result?.content, item => {
    dateArray.push(item.apyValidateTime)
    const findItem = find(verifiedApy.result?.content, el => el.apyValidateTime === item.apyValidateTime)
    const verify = findItem ? (findItem.verifiedApy * 100).toFixed(2) : ''
    const verifyDaily = findItem ? (findItem.dailyVerifiedApy * 100).toFixed(2) : ''
    verifiedApyArray.push(verify)
    verifiedDailyApyArray.push(verifyDaily)
  })

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
      data: dateArray,
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
        showSymbol: size(officialApy.result?.content) === 1
      },
      {
        name: 'Verified Weekly APY',
        data: verifiedApyArray,
        type: 'line',
        lineStyle: {
          width: 5,
          cap: 'round'
        },
        connectNulls: true,
        showSymbol: size(verifiedApy.result?.content) === 1
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
        showSymbol: size(officialApy.result?.content) === 1
      },
      {
        name: 'Verified Daily APY',
        data: verifiedDailyApyArray,
        type: 'line',
        lineStyle: {
          width: 5,
          cap: 'round'
        },
        connectNulls: true,
        showSymbol: size(verifiedApy.result?.content) === 1
      }
    )
  }

  const sampleApy = useAsync(() => getApyInRiskOn({ underlyingToken: 'ETH' }), [VAULT_FACTORY_ADDRESS])
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
        showSymbol: size(sampleApy.result?.data) === 1
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
            <Card
              title="Sample APY (%)"
              extra={
                <Tooltip
                  placement="topRight"
                  title={'The estimated return if invested on any day in the past 365 days and held it on vault until today'}
                >
                  <InfoCircleOutlined style={{ fontSize: 22 }} />
                </Tooltip>
              }
              loading={sampleApy.loading}
            >
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

export default EthrHome
