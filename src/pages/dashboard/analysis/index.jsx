import { Suspense, useEffect, useState } from 'react'
import { Col, Row, Card, Button, Tabs, Tooltip } from 'antd'
import { GridContent } from '@ant-design/pro-layout'
import IntroduceRow from './components/IntroduceRow'
import StrategyTable from './components/StrategyTable'
import TransationsTable from './components/TransationsTable'
import TopSearch from './components/TopSearch'
import ProportionSales from './components/ProportionSales'
import { useModel } from 'umi'
import _min from 'lodash/min'
import _max from 'lodash/max'

// === Components === //
import { Desktop, Tablet, Mobile } from '@/components/Container/Container'

// === Services === //
import {
  getVaultDailyData,
  getTransations,
  getDaysAgoTimestamp,
} from './../../../services/dashboard-service'

// === Utils === //
import numeral from "numeral";
import {map, isEmpty} from 'lodash';
import {getDecimals} from './../../../apollo/client';
import {arrayAppendOfDay, usedPreValue} from './../../../helper/array-append';
import getLineEchartOpt from '@/components/echarts/options/line/getLineEchartOpt'

// === Styles === //
import styles from './style.less'
import { toFixed } from '@/helper/number-format'

import { LineEchart } from '@/components/echarts'
import {calVaultApyByRange} from "@/utils/Apy";

const { TabPane } = Tabs

const Analysis = () => {
  const [calDateRange, setCalDateRange] = useState(30)
  const [tvlEchartOpt, setTvlEchartOpt] = useState({})
  const [sharePriceEchartOpt, setSharePriceEchartOpt] = useState({})
  // const [apyEchartOpt, setApyEchartOpt] = useState({});
  const [transations, setTransations] = useState([])

  const { initialState } = useModel('@@initialState')

  const { dataSource, reload, loading } = useModel('useDashboardData')

  const vaultAddress = dataSource?.vaultDetail?.id

  useEffect(() => {
    reload()
  }, [initialState.chain])
  useEffect(() => {
    if (isEmpty(vaultAddress)) return
    getTransations(vaultAddress).then(setTransations)
  }, [vaultAddress])

  useEffect(() => {
    getVaultDailyData(calDateRange + 30).then((array) => arrayAppendOfDay(array, calDateRange + 30))
      .then((array) => usedPreValue(array, 'totalShares', undefined))
      .then((array) => usedPreValue(array, 'tvl', undefined))
      .then((array) =>
        map(array, (item) => {
          return {
            id: item.id,
            date: 1000 * item.id,
            pricePerShare: item.totalShares
              ? item.totalShares === 0
                ? 1
                : numeral(item.tvl / item.totalShares).format('0,0.000000')
              : undefined, //Number(toFixed(item.pricePerShare, getDecimals(), 6)),
            tvl: Number(toFixed(item.tvl, getDecimals(), 2)),
            totalShares: item.totalShares,
          }
        }),
      )
      .then(array => {
        let minId = getDaysAgoTimestamp(calDateRange)
        // let result = calVaultApyByRange(array, 30);
        // result = result.map(item => {
        //   if (item.apy) {
        //     item.apy = numeral(item.apy * 100).format('0,0.00');
        //   }
        //   return item;
        // }).filter(item => item.id >= minId);
        // setApyEchartOpt(getLineEchartOpt(result, 'apy', 'Trailing 30-day APY(%)', false));
        const rangeArray = array.filter(item => item.id >= minId)
        setSharePriceEchartOpt(
          getLineEchartOpt(
            rangeArray,
            'pricePerShare',
            'USDT',
            true,
            calDateRange > 7
              ? {
                  format: 'MM-DD',
                  smooth: false,
                  step: 'end',
                  xAxis: {
                    axisTick: {
                      alignWithLabel: true,
                    },
                  },
                }
              : {
                  smooth: false,
                  step: 'end',
                  xAxis: {
                    axisTick: {
                      alignWithLabel: true,
                    },
                  },
                },
          ),
        )
        setTvlEchartOpt(
          getLineEchartOpt(
            rangeArray,
            'tvl',
            'USDT',
            true,
            calDateRange > 7
              ? {
                  format: 'MM-DD',
                  xAxis: {
                    axisTick: {
                      alignWithLabel: true,
                    },
                  },
                }
              : {
                  xAxis: {
                    axisTick: {
                      alignWithLabel: true,
                    },
                  },
                },
          ),
        )
      })
  }, [calDateRange])

  if (isEmpty(initialState.chain)) return null

  return (
    <GridContent>
      <Suspense fallback={null}>
        <IntroduceRow loading={loading} visitData={dataSource} />
      </Suspense>
      <Suspense fallback={null}>
        <Card
          loading={loading}
          bordered={false}
          bodyStyle={{ padding: 0 }}
          style={{ marginTop: 24 }}
        >
          <Desktop>
            <div className={styles.vaultKeyCard}>
              <Tabs
                animated
                size='small'
                tabBarExtraContent={
                  <div>
                    <Tooltip title='last 7 days'>
                      <Button
                        ghost
                        type={calDateRange === 7 ? 'primary' : ''}
                        onClick={() => setCalDateRange(7)}
                      >
                        WEEK
                      </Button>
                    </Tooltip>
                    <Tooltip title='last 30 days'>
                      <Button
                        ghost
                        type={calDateRange === 30 ? 'primary' : ''}
                        onClick={() => setCalDateRange(30)}
                      >
                        MONTH
                      </Button>
                    </Tooltip>
                    <Tooltip title='last 365 days'>
                      <Button
                        ghost
                        type={calDateRange === 365 ? 'primary' : ''}
                        onClick={() => setCalDateRange(365)}
                      >
                        YEAR
                      </Button>
                    </Tooltip>
                  </div>
                }
              >
                {/*<TabPane tab="APY" key="apy">*/}
                {/*  <div className={styles.chartDiv}>*/}
                {/*    <LineEchart option={apyEchartOpt} style={{height: '100%', width: '100%'}}/>*/}
                {/*  </div>*/}
                {/*</TabPane>*/}
                <TabPane tab='Share Price' key='sharePrice'>
                  <div className={styles.chartDiv}>
                    <LineEchart
                      option={sharePriceEchartOpt}
                      style={{ height: '100%', width: '100%' }}
                    />
                  </div>
                </TabPane>
                <TabPane tab='TVL' key='tvl'>
                  <div className={styles.chartDiv}>
                    <LineEchart option={tvlEchartOpt} style={{ height: '100%', width: '100%' }} />
                  </div>
                </TabPane>
              </Tabs>
            </div>
          </Desktop>
          <Tablet>
            <div className={styles.vaultKeyCard}>
              <Tabs
                animated
                size='small'
                tabBarExtraContent={
                  <div>
                    <Tooltip title='last 7 days'>
                      <Button
                        ghost
                        size='small'
                        style={{ fontSize: '0.5rem' }}
                        type={calDateRange === 7 ? 'primary' : ''}
                        onClick={() => setCalDateRange(7)}
                      >
                        WEEK
                      </Button>
                    </Tooltip>
                    <Tooltip title='last 30 days'>
                      <Button
                        ghost
                        size='small'
                        style={{ fontSize: '0.5rem' }}
                        type={calDateRange === 30 ? 'primary' : ''}
                        onClick={() => setCalDateRange(30)}
                      >
                        MONTH
                      </Button>
                    </Tooltip>
                    <Tooltip title='last 365 days'>
                      <Button
                        ghost
                        size='small'
                        style={{ fontSize: '0.5rem' }}
                        type={calDateRange === 365 ? 'primary' : ''}
                        onClick={() => setCalDateRange(365)}
                      >
                        YEAR
                      </Button>
                    </Tooltip>
                  </div>
                }
              >
	        {/*<TabPane tab="APY" key="apy">*/}
          {/*        <div className={styles.chartDivMobile}>*/}
          {/*          <LineEchart option={apyEchartOpt} style={{height: '100%', width: '100%'}}/>*/}
          {/*        </div>*/}
          {/*      </TabPane>*/}
                <TabPane tab='Share Price' key='sharePrice'>
                  <div className={styles.chartDivMobile}>
                    <LineEchart
                      option={sharePriceEchartOpt}
                      style={{ height: '100%', width: '100%' }}
                    />
                  </div>
                </TabPane>
                <TabPane tab='TVL' key='tvl'>
                  <div className={styles.chartDivMobile}>
                    <LineEchart option={tvlEchartOpt} style={{ height: '100%', width: '100%' }} />
                  </div>
                </TabPane>
              </Tabs>
            </div>
          </Tablet>
          <Mobile>
            <div className={styles.vaultKeyCard}>
              <Tabs
                animated
                size='small'
                tabBarGutter={16}
                tabBarExtraContent={
                  <div>
                    <Tooltip title='last 7 days'>
                      <Button
                        ghost
                        size='small'
                        style={{ fontSize: '0.5rem' }}
                        type={calDateRange === 7 ? 'primary' : ''}
                        onClick={() => setCalDateRange(7)}
                      >
                        WEEK
                      </Button>
                    </Tooltip>
                    <Tooltip title='last 30 days'>
                      <Button
                        ghost
                        size='small'
                        style={{ fontSize: '0.5rem' }}
                        type={calDateRange === 30 ? 'primary' : ''}
                        onClick={() => setCalDateRange(30)}
                      >
                        MONTH
                      </Button>
                    </Tooltip>
                    <Tooltip title='last 365 days'>
                      <Button
                        ghost
                        size='small'
                        style={{ fontSize: '0.5rem' }}
                        type={calDateRange === 365 ? 'primary' : ''}
                        onClick={() => setCalDateRange(365)}
                      >
                        YEAR
                      </Button>
                    </Tooltip>
                  </div>
                }
              >
	       {/*<TabPane tab="APY" key="apy">*/}
         {/*         <div className={styles.chartDivMobile}>*/}
         {/*           <LineEchart option={apyEchartOpt} style={{height: '100%', width: '100%'}}/>*/}
         {/*         </div>*/}
         {/*       </TabPane>*/}
                <TabPane tab='Share Price' key='sharePrice'>
                  <div className={styles.chartDivMobile}>
                    <LineEchart
                      option={sharePriceEchartOpt}
                      style={{ height: '100%', width: '100%' }}
                    />
                  </div>
                </TabPane>
                <TabPane tab='TVL' key='tvl'>
                  <div className={styles.chartDivMobile}>
                    <LineEchart option={tvlEchartOpt} style={{ height: '100%', width: '100%' }} />
                  </div>
                </TabPane>
              </Tabs>
            </div>
          </Mobile>
        </Card>
      </Suspense>
      <Suspense fallback={null}>
        <Desktop>
          <Card
            loading={loading}
            className={styles.salesCard}
            bordered={false}
            title='Protocol Allocations'
            style={{
              height: '100%',
              marginTop: 24,
            }}
          >
            <Row
              gutter={24}
              style={{
                marginTop: 24,
              }}
            >
              <Col xl={12} lg={24} md={24} sm={24} xs={24}>
                <Suspense fallback={null}>
                  <ProportionSales loading={loading} visitData={dataSource?.vaultDetail} />
                </Suspense>
              </Col>
              <Col xl={12} lg={24} md={24} sm={24} xs={24}>
                <Suspense fallback={null}>
                  <TopSearch loading={loading} visitData={dataSource?.vaultDetail} />
                </Suspense>
              </Col>
            </Row>
          </Card>
        </Desktop>
        <Tablet>
          <Card
            loading={loading}
            className={styles.salesCard}
            size='small'
            bordered={false}
            title='Protocol Allocations'
            style={{
              height: '100%',
              marginTop: 24,
            }}
          >
            <Row
              gutter={24}
              style={{
                marginTop: 24,
              }}
            >
              <Col xl={12} lg={24} md={24} sm={24} xs={24}>
                <Suspense fallback={null}>
                  <ProportionSales loading={loading} visitData={dataSource?.vaultDetail} />
                </Suspense>
              </Col>
              <Col xl={12} lg={24} md={24} sm={24} xs={24}>
                <Suspense fallback={null}>
                  <TopSearch loading={loading} visitData={dataSource?.vaultDetail} />
                </Suspense>
              </Col>
            </Row>
          </Card>
        </Tablet>
        <Mobile>
          <Card
            loading={loading}
            className={styles.salesCard}
            size='small'
            bordered={false}
            title='Protocol Allocations'
            style={{
              height: '100%',
              marginTop: 24,
            }}
          >
            <Row
              gutter={24}
              style={{
                marginTop: 24,
              }}
            >
              <Col xl={12} lg={24} md={24} sm={24} xs={24}>
                <Suspense fallback={null}>
                  <ProportionSales loading={loading} visitData={dataSource?.vaultDetail} />
                </Suspense>
              </Col>
              <Col xl={12} lg={24} md={24} sm={24} xs={24}>
                <Suspense fallback={null}>
                  <TopSearch loading={loading} visitData={dataSource?.vaultDetail} />
                </Suspense>
              </Col>
            </Row>
          </Card>
        </Mobile>
      </Suspense>

      <Suspense fallback={null}>
        <StrategyTable loading={loading} />
      </Suspense>
      <Suspense fallback={null}>
        <TransationsTable loading={loading} visitData={transations} />
      </Suspense>
    </GridContent>
  )
}

export default Analysis
