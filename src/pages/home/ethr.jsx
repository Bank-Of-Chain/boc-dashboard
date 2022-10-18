import React from 'react'
import { Suspense } from 'react'

// === Components === //
import { GridContent } from '@ant-design/pro-layout'
import { Row, Col, Card } from 'antd'
import IntroduceRow from './components/IntroduceRow'
import { LineEchart } from '@/components/echarts'
import ChainChange from '@/components/ChainChange'

// === Constants === //

// === Services === //

// === Utils === //
import numeral from 'numeral'

// === Styles === //

const USDiHome = () => {
  const loading = false
  const introduceData = [
    {
      title: 'Deposit',
      tip: 'All Vault Net Deposit.',
      content: numeral('332221').format('0.[0000]a'),
      loading,
      unit: 'WETH'
    },
    {
      title: 'Current Value',
      tip: 'All Vault Current Value.',
      content: numeral('123124').format('0.[0000]a'),
      loading,
      unit: 'WETH'
    },
    {
      title: 'Unrealized Profit',
      tip: 'All Vault Unrealized Profit.',
      content: numeral('123124').format('0.[0000]a'),
      loading,
      unit: 'WETH'
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
      content: numeral('123124').format('0.[0000]a'),
      loading,
      unit: 'WETH'
    },
    {
      title: 'AAVE Collateral',
      tip: 'All Vault AAVE Collateral.',
      content: numeral('123124').format('0.[0000]a'),
      loading,
      unit: 'WETH'
    },
    {
      title: 'Uniswap Position Value',
      tip: 'All Vault Uniswap Position Value.',
      content: numeral('123124').format('0.[0000]a'),
      loading,
      unit: 'WETH'
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

  const jsx = (
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
          <Card title="Sample APY (%)">
            <LineEchart option={options} style={{ minHeight: '500px', width: '100%' }} />
          </Card>
        </Suspense>
      </Col>
    </Row>
  )

  return (
    <GridContent>
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Suspense fallback={null}>
            <ChainChange />
          </Suspense>
        </Col>
        <Col span={24}>
          {jsx}
          {/* <Collapse defaultActiveKey={['1']}>
            <Panel header="xxxxxxxxxxxxxxxxxxxxx" key="1">
            </Panel>
            <Panel header="xxxxxxxxxxxxxxxxxxxxx" key="2">
              {jsx}
            </Panel>
            <Panel header="xxxxxxxxxxxxxxxxxxx" key="3">
              {jsx}
            </Panel>
          </Collapse> */}
        </Col>
      </Row>
    </GridContent>
  )
}

export default USDiHome
