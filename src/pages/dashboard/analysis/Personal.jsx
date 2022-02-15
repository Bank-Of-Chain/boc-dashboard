import React, { Suspense, useEffect, useState } from 'react'

// === Components === //
import { InfoCircleOutlined } from '@ant-design/icons'
import { GridContent } from '@ant-design/pro-layout'
import { Col, Row, Tooltip, Result, Button, Card } from 'antd'
import { ChartCard } from './components/Charts'
import { BarEchart, LineEchart } from '@/components/echarts'
import {useModel} from 'umi'
import { isEmpty } from 'lodash'
import { toFixed } from '@/helper/number-format'
import { getDecimals } from '@/apollo/client'

const topColResponsiveProps = {
  xs: 24,
  sm: 8,
  md: 8,
  lg: 8,
  xl: 8,
}

const Personal = props => {
  const [hasConnect, setHasConnect] = useState(true)
  const [totalAssets, setTotalAssets] = useState(0)
  const [bocBalance, setBOCBalance] = useState(0)
  const [profit, setProfit] = useState(0)
  const [totalProfit, setTotalProfit] = useState(0)
  const [depositedPercent, setDepositedPercent] = useState(0)
  const [dailyTVLs, setDailyTVLs] = useState([])
  const {dataSource, reload, loading} = useModel('usePersonalData')

  const {initialState} = useModel('@@initialState')

  const decimals = dataSource?.vaultSummary?.decimals
  const sharePrice = dataSource?.vaultSummary?.pricePerShare
  const totalShares = dataSource?.vaultSummary?.totalShares
  const shares = dataSource?.accountDetail?.shares
  const depositedUSDT = dataSource?.accountDetail?.depositedUSDT
  const accumulatedProfit = dataSource?.accountDetail?.accumulatedProfit
  const accountDailyDatas = dataSource?.accountDetail?.accountDailyDatas

  useEffect(() => {
    reload();
  }, [initialState.chain])

  useEffect(() => {
    if (!sharePrice || !shares || !decimals) return
    setTotalAssets(sharePrice * shares / (10 ** decimals))
  }, [sharePrice, shares, decimals])

  useEffect(() => {
    if (!shares) return
    setBOCBalance(shares)
  }, [shares])

  useEffect(() => {
    if (!totalAssets || totalAssets === 0) return
    setProfit(+totalAssets - depositedUSDT)
  }, [totalAssets, depositedUSDT])

  useEffect(() => {
    if ((!profit || profit === 0) || !accumulatedProfit) return
    setTotalProfit(+profit + +accumulatedProfit)
  }, [profit, accumulatedProfit])

  useEffect(() => {
    if (!shares || !totalShares) return
    setDepositedPercent(shares * 100 / totalShares)
  }, [shares, totalShares])

  useEffect(() => {
    if (isEmpty(accountDailyDatas)) return
    setDailyTVLs(accountDailyDatas.map(accountDailyData => {
      return {
        date: accountDailyData.dayTimestamp,
        tvl: accountDailyData.currentShares,
      }
    }))
    console.log('dailyTVLs=', dailyTVLs);
  }, [accountDailyDatas])

  const option = {
    xAxis: {
      type: 'category',
      data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    },
    yAxis: {
      type: 'value',
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },
    series: [
      {
        data: [120, 200, 150, 80, 70, 110, 130, 120, 200, 150, 80, 70],
        type: 'bar',
      },
    ],
  }
  const option1 = {
    color: '#fac858',
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: [
        '2-1',
        '2-2',
        '2-3',
        '2-4',
        '2-5',
        '2-6',
        '2-7',
        '2-8',
        '2-9',
        '2-10',
        '2-11',
        '2-12',
      ]
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 232.6, 320.0, 346.4, 423.3],
        type: 'line',
        areaStyle: {}
      }
    ]
  }

  if (!hasConnect) {
    return (
      <Result
        status='500'
        title='un connect'
        subTitle='connect metamask firstly'
        extra={<Button type='primary'>Connect</Button>}
      />
    )
  }

  return (
    <GridContent>
      <Suspense fallback={null}>
        <Row gutter={[24, 24]}>
          <Col {...topColResponsiveProps}>
            <ChartCard
              bordered={false}
              title='Total Assets (USDT)'
              action={
                <Tooltip title='Total Assets Amount'>
                  <InfoCircleOutlined />
                </Tooltip>
              }
              loading={false}
              total={() => toFixed(totalAssets.toString(), getDecimals(), 2)}
              contentHeight={100}
            />
          </Col>
          <Col {...topColResponsiveProps}>
            <ChartCard
              bordered={false}
              title='Total Shares'
              action={
                <Tooltip title='Total Share Amount'>
                  <InfoCircleOutlined />
                </Tooltip>
              }
              loading={false}
              total={() => toFixed(bocBalance.toString(), getDecimals(), 2)}
              contentHeight={100}
            />
          </Col>
          <Col {...topColResponsiveProps}>
            <ChartCard
              bordered={false}
              loading={false}
              title='APY'
              action={
                <Tooltip title='The amount of USDT'>
                  <InfoCircleOutlined />
                </Tooltip>
              }
              total='15.53%'
              contentHeight={70}
            />
          </Col>

          <Col {...topColResponsiveProps}>
            <ChartCard
              bordered={false}
              title='Profit (USDT)'
              action={
                <Tooltip title='The Amount of Profit'>
                  <InfoCircleOutlined />
                </Tooltip>
              }
              loading={false}
              total={() => toFixed(profit.toString(), getDecimals(), 2)}
              contentHeight={100}
            />
          </Col>

          <Col {...topColResponsiveProps}>
            <ChartCard
              bordered={false}
              title='Total Profit (USDT)'
              action={
                <Tooltip title='The Amount of Total Profit'>
                  <InfoCircleOutlined />
                </Tooltip>
              }
              loading={false}
              total={() => toFixed(totalProfit.toString(), getDecimals(), 2)}
              contentHeight={100}
            />
          </Col>

          <Col {...topColResponsiveProps}>
            <ChartCard
              bordered={false}
              title='Deposit Percent'
              action={
                <Tooltip title='Deposit Percent'>
                  <InfoCircleOutlined />
                </Tooltip>
              }
              loading={false}
              total={() => depositedPercent.toFixed(2) + '%'}
              contentHeight={100}
            />
          </Col>
        </Row>
      </Suspense>
      <Suspense fallback={null}>
        <Card
          loading={false}
          bordered={false}
          bodyStyle={{ paddingLeft: 0, paddingRight: 0, height: '600px' }}
          style={{ marginTop: 24 }}
          title='Month Profit'
        >
          <BarEchart option={option} style={{ height: '100%' }} />
        </Card>
      </Suspense>
      <Suspense fallback={null}>
        <Card
          loading={false}
          bordered={false}
          bodyStyle={{ paddingLeft: 0, paddingRight: 0, height: '600px' }}
          style={{ marginTop: 24 }}
          title='Daily TVL'
        >
          <LineEchart option={option1} style={{ height: '100%' }} />
        </Card>
      </Suspense>
    </GridContent>
  )
}

export default Personal
