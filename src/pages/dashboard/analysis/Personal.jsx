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
import { getDaysAgoTimestamp } from '@/services/dashboard-service'

import moment from 'moment';
import lineSimple from '@/components/echarts/options/line/lineSimple';
import _min from 'lodash/min';
import _max from 'lodash/max';

const topColResponsiveProps = {
  xs: 24,
  sm: 8,
  md: 8,
  lg: 8,
  xl: 8,
}

const getLineEchartOpt = (data, dataValueKey, seriesName, needMinMax = true) => {
  const xAxisData = [];
  const seriesData = [];
  data.forEach((o) => {
    xAxisData.push(moment(Number(o.date)).format('MM-DD HH:mm'));
    seriesData.push(o[dataValueKey]);
  });
  const option = lineSimple(
    {
      xAxisData,
      seriesName: seriesName,
      seriesData
    }
  );
  option.yAxis.splitLine = {
    lineStyle: {
      color: 'black'
    }
  };
  const filterValueArray = data.filter(o => {
    return o[dataValueKey]
  }).map(o => {
    return o[dataValueKey]
  });
  if (needMinMax) {
    option.yAxis.min = _min(filterValueArray);
    option.yAxis.max = _max(filterValueArray);
  }
  option.series[0].connectNulls = true;
  return option;
}

const Personal = props => {
  const [hasConnect, setHasConnect] = useState(true)
  const [totalAssets, setTotalAssets] = useState(0)
  const [bocBalance, setBOCBalance] = useState(0)
  const [profit, setProfit] = useState(0)
  const [totalProfit, setTotalProfit] = useState(0)
  const [depositedPercent, setDepositedPercent] = useState(0)
  const [dailyTvlEchartOpt, setDailyTvlEchartOpt] = useState({})
  const {dataSource, reload, loading} = useModel('usePersonalData')

  const {initialState} = useModel('@@initialState')

  const decimals = dataSource?.vaultSummary?.decimals
  const sharePrice = dataSource?.vaultSummary?.pricePerShare
  const totalShares = dataSource?.vaultSummary?.totalShares
  const shares = dataSource?.accountDetail?.shares
  const depositedUSDT = dataSource?.accountDetail?.depositedUSDT
  const accumulatedProfit = dataSource?.accountDetail?.accumulatedProfit
  const accountDailyDatas = dataSource?.accountDetail?.accountDailyDatas
  const pastLatestAccountDailyData = dataSource?.pastLatestAccountDailyData
  const vaultDailyDatas = dataSource?.vaultDailyDatas
  const pastLatestVaultDailyData = dataSource?.pastLatestVaultDailyData

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

  const fillAccountDailyDatas = (accountDailyDatas) => {
    const accountDailyDataMap = new Map()
    for (const accountDailyData of accountDailyDatas) {
      accountDailyDataMap.set(accountDailyData.dayTimestamp, accountDailyData)
    }
    const thirtyDaysDailyDatas = []

    const offset = 86400
    let correctTimestamp = getDaysAgoTimestamp(30) + offset
    if (isEmpty(accountDailyDatas) || !accountDailyDataMap.get(correctTimestamp)) {
      thirtyDaysDailyDatas.push({
        id: pastLatestAccountDailyData.id,
        currentShares: pastLatestAccountDailyData.currentShares,
        currentDepositedUSDT: pastLatestAccountDailyData.currentDepositedUSDT,
        accumulatedProfit: pastLatestAccountDailyData.accumulatedProfit,
        dayTimestamp: correctTimestamp,
      })
    }
    
    // fill 30 days
    for (let index = 1; index < 30; index++) {
      correctTimestamp += offset
      const accountTodayData = accountDailyDataMap.get(correctTimestamp.toString())
      if (accountTodayData) {
        thirtyDaysDailyDatas.push(accountTodayData)
      } else {
        thirtyDaysDailyDatas.push({
          id: thirtyDaysDailyDatas[index - 1].id,
          currentShares: thirtyDaysDailyDatas[index - 1].currentShares,
          currentDepositedUSDT: thirtyDaysDailyDatas[index - 1].currentDepositedUSDT,
          accumulatedProfit: thirtyDaysDailyDatas[index - 1].accumulatedProfit,
          dayTimestamp: correctTimestamp,
        })
      }
    }
    return thirtyDaysDailyDatas
  }

  const fillVaultDailyDatas = (vaultDailyDatas) => {
    const vaultDailyDataMap = new Map()
    for (const vaultDailyData of vaultDailyDatas) {
      vaultDailyDataMap.set(vaultDailyData.id, vaultDailyData)
    }
    const thirtyDaysDailyDatas = []

    const offset = 86400
    let correctTimestamp = getDaysAgoTimestamp(30) + offset
    if (isEmpty(vaultDailyDatas) || !vaultDailyDataMap.get(correctTimestamp)) {
      thirtyDaysDailyDatas.push({
        pricePerShare: pastLatestVaultDailyData.pricePerShare,
      })
    }
    
    // fill 30 days
    for (let index = 1; index < 30; index++) {
      correctTimestamp += offset
      const vaultTodayData = vaultDailyDataMap.get(correctTimestamp.toString())
      if (vaultTodayData) {
        thirtyDaysDailyDatas.push(vaultTodayData)
        const dayTimestamp = vaultTodayData.lockedProfitDegradationTimestamp - vaultTodayData.lockedProfitDegradationTimestamp % 86400
        if (!vaultDailyDataMap.get(dayTimestamp) && dayTimestamp !== 0) {
          vaultDailyDataMap.set(dayTimestamp.toString(), {
            pricePerShare: vaultTodayData.unlockedPricePerShare
          })
        }
      } else {
        thirtyDaysDailyDatas.push(thirtyDaysDailyDatas[index - 1])
      }
    }
    return thirtyDaysDailyDatas
  }
  
  useEffect(() => {
    if (!accountDailyDatas || !pastLatestAccountDailyData) return
    if (!vaultDailyDatas || !pastLatestVaultDailyData) return
    const fullAccountDailyDatas = fillAccountDailyDatas(accountDailyDatas)
    const fullVaultDailyDatas = fillVaultDailyDatas(vaultDailyDatas)
    let array = []
    let decimals = getDecimals()
    for (let index = 0; index < 30; index++) {
      const accountDailyData = fullAccountDailyDatas[index]
      const vaultDailyData = fullVaultDailyDatas[index]
      array.push({
        date: accountDailyData.dayTimestamp * 1000,
        tvl: accountDailyData.currentShares * vaultDailyData.pricePerShare / (decimals ** 2),
      })
    }
    setDailyTvlEchartOpt(getLineEchartOpt(array, 'tvl', 'USDT'))
  }, [accountDailyDatas, pastLatestAccountDailyData, vaultDailyDatas, pastLatestVaultDailyData])

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
          <LineEchart option={dailyTvlEchartOpt} style={{ height: '100%' }} />
        </Card>
      </Suspense>
    </GridContent>
  )
}

export default Personal
