import React, { Suspense, useEffect, useState } from 'react'
import {useModel} from 'umi'
import { getDecimals } from '@/apollo/client'

// === Components === //
import { InfoCircleOutlined } from '@ant-design/icons'
import { GridContent } from '@ant-design/pro-layout'
import { Col, Row, Tooltip, Result, Card, Input } from 'antd'

// === Components === //
import { ChartCard } from './components/Charts'
import { BarEchart, LineEchart } from '@/components/echarts'

// === Utils === //
import moment from 'moment';
import filter from 'lodash/filter';
import first from 'lodash/first';
import last from 'lodash/last';
import sumBy from 'lodash/sumBy';
import _min from 'lodash/min';
import _max from 'lodash/max';
import isUndefined from 'lodash/isUndefined';
import map from 'lodash/map';
import groupBy from 'lodash/groupBy';
import isEmpty from 'lodash/isEmpty';
import compact from 'lodash/compact';
import { toFixed } from '@/helper/number-format'
import BN from 'bignumber.js';
import getLineEchartOpt from '@/components/echarts/options/line/getLineEchartOpt'

const topColResponsiveProps = {
  xs: 24,
  sm: 8,
  md: 8,
  lg: 8,
  xl: 8,
}


const Personal = () => {
  const [totalAssets, setTotalAssets] = useState(0)
  const [bocBalance, setBOCBalance] = useState(0)
  const [profit, setProfit] = useState(0)
  const [totalProfit, setTotalProfit] = useState(0)
  const [depositedPercent, setDepositedPercent] = useState(0)
  const {dataSource, loading} = useModel('usePersonalData')
  const {initialState, setInitialState} = useModel('@@initialState')

  const decimals = dataSource?.vaultSummary?.decimals
  const sharePrice = dataSource?.vaultSummary?.pricePerShare
  const totalShares = dataSource?.vaultSummary?.totalShares
  const shares = dataSource?.accountDetail?.shares
  const depositedUSDT = dataSource?.accountDetail?.depositedUSDT
  const accumulatedProfit = dataSource?.accountDetail?.accumulatedProfit

  // 计算apy
  const { accountDailyDatasInYear, vaultDailyDatesInYear } = dataSource
  const yearData = map(accountDailyDatasInYear, (i, index) => {
    return {
      ...i,
      ...vaultDailyDatesInYear[index]
    }
  })
  const totalAccumulatedProfit = sumBy(yearData, (o) => {
    if (o.hasOwnProperty('accumulatedProfit')) {
      return +o.accumulatedProfit
    }
    return 0
  })
  const totalTvl = sumBy(yearData, i => {
    if(isUndefined(i.currentShares) || isUndefined(i.pricePerShare)) return 0
    return i.currentShares * i.pricePerShare
  })
  const accountApyInYear = totalTvl === 0 ? 0 : (365 * 100 * totalAccumulatedProfit * 10 ** decimals / totalTvl)
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
    setProfit(+totalAssets - +depositedUSDT)
  }, [totalAssets, depositedUSDT])

  useEffect(() => {
    if ((!profit || profit === 0) || !accumulatedProfit) return
    setTotalProfit(+profit + +accumulatedProfit)
  }, [profit, accumulatedProfit])

  useEffect(() => {
    if (!shares || !totalShares) return
    setDepositedPercent(shares * 100 / totalShares)
  }, [shares, totalShares])

  const monthOffset = moment().month() + 1;
  const groupByMonth = groupBy(filter(yearData, i=> i.currentShares > 0 && i.pricePerShare > 0 && i.currentDepositedUSDT > 0), i=> moment(1000 * i.id).locale('en').format('MMM'))
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const array = months.slice(monthOffset)
  const array1 = months.splice(0, monthOffset)
  const nextMonths = [...array, ...array1]
  const ObtainedProfitArray = map(nextMonths, i => toFixed(`${sumBy(groupByMonth[i] || [], 'accumulatedProfit')}`, 10 ** decimals, 4))
  const totalProfitArray = map(nextMonths, (i, index) => {
    const monthArray =  groupByMonth[i]
    if(isEmpty(monthArray)) return '0';
    if(monthArray.length < 2) return '0';
    const firstItem = first(monthArray)
    const lastItem = last(monthArray)
    // 当前份额估值 减去 成本
    const lastDayProfit = ((lastItem.currentShares * lastItem.pricePerShare / 10 ** decimals) - lastItem.currentDepositedUSDT) / 10 ** decimals
    const firstDayProfit = ((firstItem.currentShares * firstItem.pricePerShare / 10 ** decimals) - firstItem.currentDepositedUSDT) / 10 ** decimals
    return toFixed(`${lastDayProfit - firstDayProfit + 1 * ObtainedProfitArray[index]}`, 1, 4)
  })
  const option = {
    textStyle:{
      color: '#fff'
    },
    color:['#91cc75', '#5470c6'],
    legend: {
      data: ['Total', 'Obtained'],
      align: 'auto',
      textStyle: {
        color: '#fff'
      }
    },
    tooltip: {},
    xAxis: {
      data: nextMonths,
      axisLine: { onZero: true },
      splitLine: { show: false },
      splitArea: { show: false }
    },
    yAxis: {},
    grid: {
      bottom: 100
    },
    series: [
      {
        name: 'Obtained',
        type: 'bar',
        stack: 'two',
        data: ObtainedProfitArray
      },
      {
        name: 'Total',
        type: 'bar',
        stack: 'one',
        data:  totalProfitArray
      },
    ]
  }

  const option1 = getLineEchartOpt(compact(map(yearData, i => {
    if(isUndefined(i.currentShares) || isUndefined(i.pricePerShare)) return
    return {
      date: 1000 * i.dayTimestamp,
      tvl: parseFloat(BN(i.currentShares).multipliedBy(BN(i.pricePerShare)).div(BN(10).pow(decimals * 2)).toFixed(4))
    }
  })), 'tvl', 'USDT', true, { format: 'MM-DD' })
  if (isEmpty(initialState.address)) {
    return (
      <Result
        status='500'
        title='un connect'
        subTitle='connect metamask firstly'
      />
    )
  }
  console.log('option=', option)
  return (
    <GridContent>
      <Suspense fallback={null}>
      <Row gutter={[24, 24]}>
        <Col>
          <Input placeholder="请输入用户地址" onChange={(e) => setInitialState({...initialState, address: e.target.value}) } />
          <p>该输入框为测试使用，发布前需要删除</p>
        </Col>
      </Row>
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
              loading={loading}
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
              loading={loading}
              total={() => toFixed(bocBalance.toString(), getDecimals(), 2)}
              contentHeight={100}
            />
          </Col>
          <Col {...topColResponsiveProps}>
            <ChartCard
              bordered={false}
              loading={loading}
              title='APY'
              action={
                <Tooltip title='last 1 year'>
                  <InfoCircleOutlined />
                </Tooltip>
              }
              total={`${accountApyInYear.toFixed(2)}%`}
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
              loading={loading}
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
              loading={loading}
              total={() => toFixed(totalProfit.toString(), getDecimals(), 2)}
              contentHeight={100}
            />
          </Col>

          {/* <Col {...topColResponsiveProps}>
            <ChartCard
              bordered={false}
              title='Deposit Percent'
              action={
                <Tooltip title='Deposit Percent'>
                  <InfoCircleOutlined />
                </Tooltip>
              }
              loading={loading}
              total={() => depositedPercent.toFixed(2) + '%'}
              contentHeight={100}
            />
          </Col> */}
        </Row>
      </Suspense>
      <Suspense fallback={null}>
        <Card
          loading={loading}
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
          loading={loading}
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
