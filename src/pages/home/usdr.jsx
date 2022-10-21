import React from 'react'
import { Suspense } from 'react'

// === Components === //
import { GridContent } from '@ant-design/pro-layout'
import { Row, Col, Card } from 'antd'
import IntroduceRow from './components/IntroduceRow'
import { LineEchart } from '@/components/echarts'
import VaultChange from '@/components/VaultChange'
import ChainChange from '@/components/ChainChange'
import OnBuilding from '@/components/OnBuilding'

// === Constants === //
import { VAULT_FACTORY_ABI } from '@/constants/abis'
import { USDC_ADDRESS_MATIC } from '@/constants/tokens'
import { BN_6 } from '@/constants/big-number'

// === Services === //
import { getDataByType } from '@/services/api-service'

// === Hooks === //
import useWallet from '@/hooks/useWallet'
import useVaultFactory from '@/hooks/useVaultFactory'
import { useAsync } from 'react-async-hook'

// === Utils === //
import numeral from 'numeral'
import get from 'lodash/get'
import { groupBy, reduce } from 'lodash'
import * as ethers from 'ethers'
import { toFixed } from '@/utils/number-format'

// === Styles === //

const { BigNumber } = ethers

const CHAINS = [
  { label: 'Polygon', key: '137' }
  // { label: 'Arbitrum', key: '42161' }
]

const CHAIN_ID = 137

const symbol = 'USDC'

const UsdrHome = () => {
  const VAULT_FACTORY_ADDRESS = '0x8013Dd64084e9c9122567563AA86981F4C20576B'

  const { userProvider } = useWallet()
  const { personalVault } = useVaultFactory(VAULT_FACTORY_ADDRESS, VAULT_FACTORY_ABI, userProvider)
  const groupMap = groupBy(personalVault, 'token')
  const calcArray = get(groupMap, USDC_ADDRESS_MATIC, [])
  console.log('calcArray=', calcArray)

  const netMarketMakingAmountTotal = reduce(
    calcArray,
    (rs, item) => {
      rs.add(item.netMarketMakingAmount)
      return rs
    },
    BigNumber.from(0)
  )
  const estimatedTotalAssetsTotal = reduce(
    calcArray,
    (rs, item) => {
      rs.add(item.estimatedTotalAssets)
      return rs
    },
    BigNumber.from(0)
  )

  const currentBorrowTotal = reduce(
    calcArray,
    (rs, item) => {
      rs.add(item.currentBorrow)
      return rs
    },
    BigNumber.from(0)
  )
  const totalCollateralTokenAmountTotal = reduce(
    calcArray,
    (rs, item) => {
      rs.add(item.totalCollateralTokenAmount)
      return rs
    },
    BigNumber.from(0)
  )
  const depositTo3rdPoolTotalAssetsTotal = reduce(
    calcArray,
    (rs, item) => {
      rs.add(item.depositTo3rdPoolTotalAssets)
      return rs
    },
    BigNumber.from(0)
  )

  console.log('netMarketMakingAmountTotal=', netMarketMakingAmountTotal.toString())
  console.log('estimatedTotalAssetsTotal=', estimatedTotalAssetsTotal.toString())
  console.log('currentBorrow=', currentBorrowTotal.toString())
  console.log('totalCollateralTokenAmountTotal=', totalCollateralTokenAmountTotal.toString())
  console.log('depositTo3rdPoolTotalAssetsTotal=', depositTo3rdPoolTotalAssetsTotal.toString())

  const aaaa = useAsync(() => getDataByType(CHAIN_ID, VAULT_FACTORY_ADDRESS, 'aave-outstanding-loan'), [VAULT_FACTORY_ADDRESS])
  const bbbb = useAsync(() => getDataByType(CHAIN_ID, VAULT_FACTORY_ADDRESS, 'aave-collateral'), [VAULT_FACTORY_ADDRESS])
  const cccc = useAsync(() => getDataByType(CHAIN_ID, VAULT_FACTORY_ADDRESS, 'aave-health-ratio'), [VAULT_FACTORY_ADDRESS])
  const dddd = useAsync(() => getDataByType(CHAIN_ID, VAULT_FACTORY_ADDRESS, 'uniswap-position-value'), [VAULT_FACTORY_ADDRESS])
  const eeee = useAsync(() => getDataByType(CHAIN_ID, VAULT_FACTORY_ADDRESS, 'profit'), [VAULT_FACTORY_ADDRESS])
  const ffff = useAsync(() => getDataByType(CHAIN_ID, VAULT_FACTORY_ADDRESS, 'net-deposit'), [VAULT_FACTORY_ADDRESS])
  console.log('aaaa=', aaaa, bbbb, cccc, dddd, eeee, ffff)
  const loading = false
  const introduceData = [
    {
      title: 'Deposit',
      tip: 'All Vault Net Deposit.',
      content: numeral(toFixed(netMarketMakingAmountTotal, BN_6)).format('0.[0000]a'),
      loading,
      unit: symbol
    },
    {
      title: 'Current Value',
      tip: 'All Vault Current Value.',
      content: numeral(toFixed(estimatedTotalAssetsTotal, BN_6)).format('0.[0000]a'),
      loading,
      unit: symbol
    },
    {
      title: 'Unrealized Profit',
      tip: 'All Vault Unrealized Profit.',
      content: numeral('123124').format('0.[0000]a'),
      loading,
      unit: symbol
    },
    {
      title: 'Holders',
      tip: 'Number Of USDi holders.',
      content: numeral('5').format('0.[0000]a'),
      loading,
      unit: ''
    },
    {
      title: 'AAVE Outstanding Loan',
      tip: 'All Vault AAVE Outstanding Loan.',
      content: numeral(toFixed(currentBorrowTotal, BN_6)).format('0.[0000]a'),
      loading,
      unit: symbol
    },
    {
      title: 'AAVE Collateral',
      tip: 'All Vault AAVE Collateral.',
      content: numeral(toFixed(totalCollateralTokenAmountTotal, BN_6)).format('0.[0000]a'),
      loading,
      unit: symbol
    },
    {
      title: 'Uniswap Position Value',
      tip: 'All Vault Uniswap Position Value.',
      content: numeral(toFixed(depositTo3rdPoolTotalAssetsTotal, BN_6)).format('0.[0000]a'),
      loading,
      unit: symbol
    }
  ]

  const options = {
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
      type: 'category',
      data: [
        '2022-09-14 00:00 (UTC)',
        '2022-09-15 00:00 (UTC)',
        '2022-09-16 00:00 (UTC)',
        '2022-09-17 00:00 (UTC)',
        '2022-09-18 00:00 (UTC)',
        '2022-09-19 00:00 (UTC)',
        '2022-09-20 00:00 (UTC)',
        '2022-09-21 00:00 (UTC)',
        '2022-09-22 00:00 (UTC)',
        '2022-09-23 00:00 (UTC)',
        '2022-09-24 00:00 (UTC)',
        '2022-09-25 00:00 (UTC)',
        '2022-09-26 00:00 (UTC)',
        '2022-09-27 00:00 (UTC)',
        '2022-09-28 00:00 (UTC)',
        '2022-09-29 00:00 (UTC)',
        '2022-09-30 00:00 (UTC)',
        '2022-10-01 00:00 (UTC)',
        '2022-10-02 00:00 (UTC)',
        '2022-10-03 00:00 (UTC)',
        '2022-10-04 00:00 (UTC)',
        '2022-10-05 00:00 (UTC)',
        '2022-10-06 00:00 (UTC)',
        '2022-10-07 00:00 (UTC)',
        '2022-10-08 00:00 (UTC)',
        '2022-10-09 00:00 (UTC)',
        '2022-10-10 00:00 (UTC)',
        '2022-10-11 00:00 (UTC)',
        '2022-10-12 00:00 (UTC)',
        '2022-10-13 00:00 (UTC)',
        '2022-10-14 00:00 (UTC)'
      ],
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
    dataZoom: null,
    color: ['#A68EFE', '#5470c6', '#91cc75'],
    series: [
      {
        name: 'USDi',
        data: [
          '1.88',
          '1.25',
          '1.86',
          '1.86',
          '1.75',
          '1.49',
          '1.59',
          '1.32',
          '1.19',
          '1.19',
          '1.19',
          '0.99',
          '1.79',
          '2.47',
          '2.47',
          '4.76',
          '4.76',
          '4.78',
          '4.94',
          '4.94',
          '4.83',
          '4.24',
          '4.00',
          '4.00',
          '4.69',
          '4.40',
          '4.40',
          '4.80',
          '4.13',
          '4.13',
          '4.72'
        ],
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

  return (
    <GridContent>
      <Row gutter={[0, 24]}>
        <Col span={24}>
          <Suspense fallback={null}>
            <VaultChange />
            <ChainChange chains={CHAINS} />
          </Suspense>
        </Col>
        <Col span={24}>
          <Row gutter={[24, 24]}>
            <Col span={24}>
              <Suspense fallback={null}>
                <IntroduceRow data={introduceData} />
              </Suspense>
            </Col>
            <Col span={24}>
              <Suspense fallback={null}>
                <Card title="Uniswap APY (%)">
                  <LineEchart option={options} style={{ minHeight: '500px', width: '100%' }} />
                </Card>
              </Suspense>
            </Col>
            <Col span={24}>
              <Suspense>
                <OnBuilding>
                  <Card title="Sample APY (%)">
                    <LineEchart option={options} style={{ minHeight: '500px', width: '100%' }} />
                  </Card>
                </OnBuilding>
              </Suspense>
            </Col>
          </Row>
        </Col>
      </Row>
    </GridContent>
  )
}

export default UsdrHome
