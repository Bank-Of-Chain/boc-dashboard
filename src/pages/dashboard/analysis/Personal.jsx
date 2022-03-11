import React, {Suspense, useEffect, useState} from 'react'
import {useModel} from 'umi'
import {getDecimals} from '@/apollo/client'
import numeral from 'numeral';

// === Components === //
import {InfoCircleOutlined} from '@ant-design/icons'
import {GridContent} from '@ant-design/pro-layout'
import {Col, Row, Tooltip, Result, Card, Input} from 'antd'
import {ChartCard} from './components/Charts'
import {BarEchart, LineEchart} from '@/components/echarts'

// === Utils === //
import moment from 'moment'
import filter from 'lodash/filter'
import last from 'lodash/last'
import sumBy from 'lodash/sumBy'
import _min from 'lodash/min'
import _max from 'lodash/max'
import isUndefined from 'lodash/isUndefined'
import map from 'lodash/map'
import groupBy from 'lodash/groupBy'
import isEmpty from 'lodash/isEmpty'
import compact from 'lodash/compact'
import reduce from 'lodash/reduce'
import isNull from 'lodash/isNull'
import {toFixed} from '@/helper/number-format'
import BN from 'bignumber.js'
import getLineEchartOpt from '@/components/echarts/options/line/getLineEchartOpt'
import {getDaysAgoTimestamp} from "@/services/dashboard-service";
import * as ethers from "ethers"

const { BigNumber } = ethers

const topColResponsiveProps = {
  xs: 24,
  sm: 8,
  md: 8,
  lg: 8,
  xl: 8,
}

const Personal = () => {
  const [totalAssets, setTotalAssets] = useState(0)
  const [liveTotalAssets, setLiveTotalAssets] = useState(BigNumber.from(0))
  const [bocBalance, setBOCBalance] = useState(BigNumber.from(0))
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
  const vaultLastUpdateTime = dataSource?.vaultLastUpdateTime
  const liveAcountShares = dataSource?.liveAcountShares
  const livePricePerShare = dataSource?.livePricePerShare
  // 计算apy
  const {accountDailyDatasInYear, vaultDailyDatesInYear} = dataSource
  const yearData = map(accountDailyDatasInYear, (i, index) => {
    return {
      ...i,
      ...vaultDailyDatesInYear[index],
    }
  })
  const totalAccumulatedProfit = sumBy(yearData, o => {
    if (o.hasOwnProperty('accumulatedProfit')) {
      return +o.accumulatedProfit
    }
    return 0
  })
  const totalTvl = sumBy(yearData, i => {
    if (isUndefined(i.currentShares) || isUndefined(i.pricePerShare)) return 0
    return i.currentShares * i.pricePerShare
  })
  const accountApyInYear =
    totalTvl === 0 ? 0 : (365 * 100 * totalAccumulatedProfit * 10 ** decimals) / totalTvl
  useEffect(() => {
    if (!sharePrice || !shares || !decimals) return
    setTotalAssets((sharePrice * shares) / 10 ** decimals)
  }, [sharePrice, shares, decimals])

  useEffect(() => {
    if (!liveAcountShares || !livePricePerShare) return
    setLiveTotalAssets(liveAcountShares.mul(livePricePerShare).div(BigNumber.from(getDecimals().toString())))
  }, [liveAcountShares, livePricePerShare])

  useEffect(() => {
    if (!liveAcountShares) return
    setBOCBalance(liveAcountShares)
  }, [liveAcountShares])

  useEffect(() => {
    if (!totalAssets || totalAssets === 0) return
    setProfit(+totalAssets - +depositedUSDT)
  }, [totalAssets, depositedUSDT])

  useEffect(() => {
    if (!profit || profit === 0 || !accumulatedProfit) return
    setTotalProfit(+profit + +accumulatedProfit)
  }, [profit, accumulatedProfit])

  useEffect(() => {
    if (!shares || !totalShares) return
    setDepositedPercent((shares * 100) / totalShares)
  }, [shares, totalShares])

  const monthOffset = moment().month() + 1
  const groupByMonth = groupBy(
    filter(yearData, i => i.currentShares > 0 && i.pricePerShare > 0 && i.currentDepositedUSDT > 0),
    i =>
      moment(1000 * i.id)
        .locale('en')
        .format('MMM'),
  )
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ]
  const array = months.slice(monthOffset)
  const array1 = months.splice(0, monthOffset)
  const nextMonths = [...array, ...array1]

  const yearValidData = filter(yearData, i => BN(i.currentDepositedUSDT).gt(0))
  // console.log('yearValidData=', yearValidData, groupByMonth)
  const lastItem = last(yearValidData) || {
    pricePerShare: 1,
    currentShares: 0,
    currentDepositedUSDT: 0,
  }

// 未实现的盈利
  const value1 = BN(lastItem?.pricePerShare)
    .multipliedBy(lastItem?.currentShares)
    .div(10 ** decimals)
    .minus(BN(lastItem?.currentDepositedUSDT))
// 已实现的盈利
  const value2 = reduce(
    yearValidData,
    (rs, item) => {
      if (isEmpty(item.accumulatedProfit)) return rs
      const nextValue = BN(item.accumulatedProfit)
      return rs.plus(nextValue)
    },
    BN(0),
  )

  const costChangeArray = [];
  let lastPoint = {};
  let minId = getDaysAgoTimestamp(30);
  let apyCalData = filter(yearData, i => i.id >= minId && i.id <=vaultLastUpdateTime);
  if(initialState.chain === '1')
  {
    apyCalData = filter(apyCalData, i => i.id >= 1644249600);
  }
  // console.log('apyCalData',JSON.stringify(apyCalData));
  for (let i = 0; i < apyCalData.length; i++) {
    let currentData = apyCalData[i];
    if (currentData.currentDepositedUSDT) {
      // cost not change
      if (lastPoint.userCost && lastPoint.userCost === currentData.currentDepositedUSDT) {
        lastPoint.duration += currentData.id - lastPoint.endTime;
        lastPoint.endTime = currentData.id;
        lastPoint.endValue = currentData.pricePerShare * lastPoint.shares / (10 ** decimals);
        costChangeArray[costChangeArray.length - 1] = lastPoint;
      } else if (lastPoint.userCost && lastPoint.userCost !== currentData.currentDepositedUSDT) {
        lastPoint.duration += currentData.id - lastPoint.endTime;
        lastPoint.endTime = currentData.id;
        lastPoint.endValue = currentData.pricePerShare * lastPoint.shares / (10 ** decimals);
        costChangeArray[costChangeArray.length - 1] = lastPoint;
        lastPoint = {
          beginValue: currentData.pricePerShare * currentData.currentShares / (10 ** decimals),
          endValue: currentData.pricePerShare * currentData.currentShares / (10 ** decimals),
          shares: currentData.currentShares,
          userCost: currentData.currentDepositedUSDT,
          beginTime: currentData.id,
          endTime: currentData.id,
          duration: 0
        };
        costChangeArray.push(lastPoint);
      } else {
        lastPoint = {
          beginValue: currentData.pricePerShare * currentData.currentShares / (10 ** decimals),
          endValue: currentData.pricePerShare * currentData.currentShares / (10 ** decimals),
          shares: currentData.currentShares,
          userCost: currentData.currentDepositedUSDT,
          beginTime: currentData.id,
          endTime: currentData.id,
          duration: 0
        };
        costChangeArray.push(lastPoint);
      }
    } else {
      lastPoint = {};
    }
  }

  // console.log('costChangeArray',JSON.stringify(costChangeArray));
  let APY = 0;
  let userTotalTvl = 0;
  let duration = 0;
  let changeValue = 0;
  for (let i = 0; i < costChangeArray.length; i++) {
    userTotalTvl += costChangeArray[i].beginValue * costChangeArray[i].duration;
    duration += costChangeArray[i].duration;
    changeValue += costChangeArray[i].endValue - costChangeArray[i].beginValue;
  }
  if (userTotalTvl > 0) {
    // console.log(changeValue, userTotalTvl, duration, userTotalTvl / duration, 365 * 24 * 3600 / duration)
    APY = Math.pow(((changeValue) / (userTotalTvl / duration) + 1), 365 * 24 * 3600 / duration) - 1
  }

// 总盈利
  const profitTotal = value1.plus(value2)

// 平均tvl
  const avgTvl = isEmpty(yearValidData)
    ? BN(0)
    : reduce(
      yearValidData,
      (rs, item) => {
        const nextPricePerShare = BN(item.pricePerShare)
        const nextCurrentShares = BN(item.currentShares)
        if (nextPricePerShare.lt(0) || nextCurrentShares.lt(0)) return rs
        const nextValue = nextCurrentShares.multipliedBy(nextPricePerShare).div(10 ** decimals)
        return rs.plus(nextValue)
      },
      BN(0),
    ).div(yearValidData.length)

  const value5 = map(nextMonths, i =>
    toFixed(
      `${reduce(
        groupByMonth[i],
        (rs, item) => {
          if (isEmpty(item.accumulatedProfit)) return rs
          const nextValue = BN(item.accumulatedProfit)
          return rs.plus(nextValue)
        },
        BN(0),
      )}`,
      10 ** decimals,
      4,
    ),
  )
  const profitOfLastDayOfMonth = map(nextMonths, i => {
    const monthArray = groupByMonth[i]
    if (isEmpty(monthArray)) return null
    const lastItem = last(monthArray)
    const lastDayProfit = BN(lastItem.currentShares)
      .multipliedBy(BN(lastItem.pricePerShare))
      .div(10 ** decimals)
      .minus(lastItem.currentDepositedUSDT)
      .div(10 ** decimals)
    return toFixed(lastDayProfit, 1, 4)
  })
  const avgTvlOfMonth = map(nextMonths, i => {
    const monthArray = groupByMonth[i]
    if (isEmpty(monthArray)) return null
    return toFixed(
      reduce(
        monthArray,
        (rs, item) => {
          const nextPricePerShare = BN(item.pricePerShare)
          const nextCurrentShares = BN(item.currentShares)
          if (nextPricePerShare.lt(0) || nextCurrentShares.lt(0)) return rs
          const nextValue = nextCurrentShares.multipliedBy(nextPricePerShare).div(10 ** decimals)
          return rs.plus(nextValue)
        },
        BN(0),
      ).div(monthArray.length),
      10 ** decimals,
      4,
    )
  })
  const monthProfitTotal = map(profitOfLastDayOfMonth, (i, index) => {
    if (isNull(i) || isNull(value5[index])) return null
    return sumBy([i, value5[index]], o => parseFloat(o)).toFixed(4)
  })
  const result = {
    未实现的盈利: toFixed(value1, 10 ** decimals),
    已实现的盈利: toFixed(value2, 10 ** decimals),
    总盈利: toFixed(profitTotal, 10 ** decimals),
    平均tvl: toFixed(avgTvl, 10 ** decimals),
    apy: toFixed(
      profitTotal
        .multipliedBy(365)
        .div(avgTvl)
        .div(yearValidData.length),
    ),
    每月的已实现的盈利: value5.toString(),
    每月最后一天未实现的盈利: profitOfLastDayOfMonth.toString(),
    每月最后一天总盈利: monthProfitTotal.toString(),
    每月单独的盈利: map(monthProfitTotal, (i, index) => {
      if (index === 0) return i
      if (isNull(i)) return null
      if (isNull(profitOfLastDayOfMonth[index - 1])) return i
      return (parseFloat(i) - parseFloat(profitOfLastDayOfMonth[index - 1])).toFixed(4)
    }).toString(),
    月平均锁仓: avgTvlOfMonth.toString(),
  }
  console.table(result)
  const option = {
    textStyle: {
      color: '#fff',
    },
    color: ['#5470c6'],
    tooltip: {},
    xAxis: {
      data: nextMonths,
      axisLine: {onZero: true},
      splitLine: {show: false},
      splitArea: {show: false},
    },
    yAxis: {},
    grid: {},
    series: [
      {
        name: 'Total',
        type: 'bar',
        stack: 'one',
        data: map(monthProfitTotal, (i, index) => {
          if (index === 0) return i
          if (isNull(i)) return null
          if (isNull(profitOfLastDayOfMonth[index - 1])) return i
          return (parseFloat(i) - parseFloat(profitOfLastDayOfMonth[index - 1])).toFixed(4)
        }),
      },
    ],
  }

  const option1 = getLineEchartOpt(
    compact(
      map(yearData, i => {
        if (isUndefined(i.currentShares) || isUndefined(i.pricePerShare)) return
        return {
          date: 1000 * i.dayTimestamp,
          tvl: parseFloat(
            BN(i.currentShares)
              .multipliedBy(BN(i.pricePerShare))
              .div(BN(10).pow(decimals * 2))
              .toFixed(4),
          ),
        }
      }),
    ),
    'tvl',
    'USDT',
    true,
    {
      format: 'MM-DD',
      dataZoom: [{
        start: 0,
        end: 100
      }]
    },
  )
  if (isEmpty(initialState.address)) {
    return (
      <Result
        status='500'
        title={isUndefined(window.ethereum) ? '' : 'No Connect!'}
        subTitle={
          isUndefined(window.ethereum) ? 'Please install Metamask first.' : 'Please connect metamask first.'
        }
      />
    )
  }
  return (
    <GridContent>
      <Suspense fallback={null}>
        <Row gutter={[24, 24]} style={{ display: 'none' }}>
          <Col>
            <Input
              value={initialState.address}
              placeholder='请输入用户地址'
              onChange={e => setInitialState({...initialState, address: e.target.value})}
            />
            <a
              onClick={() => setInitialState({...initialState, address: '0x2346c6b1024e97c50370c783a66d80f577fe991d'})}>eth/bsc:
              0x2346c6b1024e97c50370c783a66d80f577fe991d</a>
            <br/>
            <a
              onClick={() => setInitialState({...initialState, address: '0x375d80da4271f5dcdf821802f981a765a0f11763'})}>matic:
              0x375d80da4271f5dcdf821802f981a765a0f11763</a>
            <br/>
            <p>该输入框为测试使用，发布前需要删除</p>
          </Col>
        </Row>
        <Row gutter={[24, 24]}>
          <Col {...topColResponsiveProps}>
            <ChartCard
              bordered={false}
              title='Total Assets (USDT)'
              action={
                <Tooltip title='The value of shares currently'>
                  <InfoCircleOutlined/>
                </Tooltip>
              }
              loading={loading}
              total={() => toFixed(liveTotalAssets, getDecimals(), 2)}
              contentHeight={100}
            />
          </Col>
          <Col {...topColResponsiveProps}>
            <ChartCard
              bordered={false}
              title='Current shares'
              action={
                <Tooltip title='Total shares amounts'>
                  <InfoCircleOutlined/>
                </Tooltip>
              }
              loading={loading}
              total={() => toFixed(bocBalance, getDecimals(), 2)}
              contentHeight={100}
            />
          </Col>
          <Col {...topColResponsiveProps}>
            <ChartCard
              bordered={false}
              loading={loading}
              title='APY(last 30 days)'
              action={
                <Tooltip title={`Yield over the past 1 month ${initialState.chain === '1' ? '(From Feb. 8)' : ''}`}>
                  <InfoCircleOutlined/>
                </Tooltip>
              }
              total={`${numeral(APY * 100).format('0,0.00')}%`}
              contentHeight={70}
            />
          </Col>

          <Col {...topColResponsiveProps}>
            <ChartCard
              bordered={false}
              title='Unrealized profits (USDT)'
              action={
                <Tooltip title='Potential profit that has not been effected'>
                  <InfoCircleOutlined/>
                </Tooltip>
              }
              loading={loading}
              total={() => toFixed(value1, getDecimals(), 2)}
              contentHeight={100}
            />
          </Col>

          <Col {...topColResponsiveProps}>
            <ChartCard
              bordered={false}
              title='Realized profits (USDT)'
              action={
                <Tooltip title='The profits that have been actualized'>
                  <InfoCircleOutlined/>
                </Tooltip>
              }
              loading={loading}
              total={() => toFixed(sumBy(value5, o => parseFloat(o)).toString(), 1, 2)}
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
          bodyStyle={{height: '452px'}}
          style={{marginTop: 24}}
          title='Daily TVL'
        >
          <LineEchart option={option1} style={{height: '100%'}}/>
        </Card>
      </Suspense>
      <Suspense fallback={null}>
        <Card
          loading={loading}
          bordered={false}
          bodyStyle={{paddingLeft: 0, paddingRight: 0, height: '450px'}}
          style={{marginTop: 24}}
          title='Monthly Profit'
        >
          <BarEchart option={option} style={{height: '100%', width: '100%'}}/>
        </Card>
      </Suspense>
    </GridContent>
  )
}

export default Personal
