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
import { VAULT_FACTORY_ABI } from '@/constants/abis'
import { USDC_ADDRESS_MATIC } from '@/constants/tokens'
import { BN_6 } from '@/constants/big-number'

// === Services === //
import { getVerifiedApyInRiskOn, getOffcialApyInRiskOn, getApyInRiskOn } from '@/services/api-service'

// === Hooks === //
import useWallet from '@/hooks/useWallet'
import useVaultFactory from '@/hooks/useVaultFactory'
import { useAsync } from 'react-async-hook'

// === Utils === //
import numeral from 'numeral'
import get from 'lodash/get'
import map from 'lodash/map'
import { groupBy, reduce } from 'lodash'
import * as ethers from 'ethers'
import { toFixed } from '@/utils/number-format'
import { useState } from 'react'

// === Styles === //
import styles from './style.less'

const { BigNumber } = ethers

const CHAINS = [
  { label: 'Polygon', key: '137' }
  // { label: 'Arbitrum', key: '42161' }
]

const symbol = 'USDC'

const UsdrHome = () => {
  const VAULT_FACTORY_ADDRESS = USDR.VAULT_FACTORY_ADDRESS['137']

  const { userProvider } = useWallet()
  const { personalVault, loading } = useVaultFactory(VAULT_FACTORY_ADDRESS, VAULT_FACTORY_ABI, userProvider)
  const groupMap = groupBy(personalVault, 'token')
  const calcArray = get(groupMap, USDC_ADDRESS_MATIC, [])
  const [filter, setFilter] = useState('All')

  const netMarketMakingAmountTotal = reduce(
    calcArray,
    (rs, item) => {
      return rs.add(item.netMarketMakingAmount)
    },
    BigNumber.from(0)
  )
  const estimatedTotalAssetsTotal = reduce(
    calcArray,
    (rs, item) => {
      return rs.add(item.estimatedTotalAssets)
    },
    BigNumber.from(0)
  )

  const currentBorrowTotal = reduce(
    calcArray,
    (rs, item) => {
      return rs.add(item.currentBorrowWithCanonical)
    },
    BigNumber.from(0)
  )
  const totalCollateralTokenAmountTotal = reduce(
    calcArray,
    (rs, item) => {
      return rs.add(item.totalCollateralTokenAmount)
    },
    BigNumber.from(0)
  )
  const depositTo3rdPoolTotalAssetsTotal = reduce(
    calcArray,
    (rs, item) => {
      return rs.add(item.depositTo3rdPoolTotalAssets)
    },
    BigNumber.from(0)
  )

  const stablecoinInvestorSetLenTotal = reduce(
    calcArray,
    (rs, item) => {
      return rs.add(item._stablecoinInvestorSetLen)
    },
    BigNumber.from(0)
  )

  const profitTotal = reduce(
    calcArray,
    (rs, item) => {
      return rs.add(item.profit)
    },
    BigNumber.from(0)
  )

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
      title: 'Profits',
      tip: 'All Vault Profits.',
      content: numeral(toFixed(profitTotal, BN_6)).format('0.[0000]a'),
      loading,
      unit: symbol
    },
    {
      title: 'Holders',
      tip: 'Number Of USDi holders.',
      content: numeral(stablecoinInvestorSetLenTotal).format('0.[0000]a'),
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

  const verifiedApy = useAsync(() => getVerifiedApyInRiskOn(), [VAULT_FACTORY_ADDRESS])
  const officialApy = useAsync(() => getOffcialApyInRiskOn(), [VAULT_FACTORY_ADDRESS])
  const sampleApy = useAsync(() => getApyInRiskOn(), [VAULT_FACTORY_ADDRESS])

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
            <OnBuilding>
              <Card title="Uniswap APY (%)" loading={verifiedApy.loading || officialApy.loading}>
                {verifiedApy.error ? (
                  <div style={{ minHeight: '10rem' }}>Error: {verifiedApy?.error?.message}</div>
                ) : (
                  <LineEchart
                    option={{
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
                    }}
                    style={{ minHeight: '500px', width: '100%' }}
                  />
                )}
              </Card>
            </OnBuilding>
          </Suspense>
        </Col>
        <Col span={24}>
          <Suspense>
            <OnBuilding>
              <Card title="Sample APY (%)" loading={sampleApy.loading}>
                {sampleApy.error ? (
                  <div style={{ minHeight: '10rem' }}>Error: {sampleApy.error.message}</div>
                ) : (
                  <LineEchart
                    option={{
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
                    }}
                    style={{ minHeight: '500px', width: '100%' }}
                  />
                )}
              </Card>
            </OnBuilding>
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
