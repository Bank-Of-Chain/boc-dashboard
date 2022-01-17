import { Suspense, useEffect, useState } from 'react'
import { Col, Row, Card, Button } from 'antd'
import { Line } from '@ant-design/charts'
import { GridContent } from '@ant-design/pro-layout'
import IntroduceRow from './components/IntroduceRow'
import StrategyTable from './components/StrategyTable'
import TransationsTable from './components/TransationsTable'
import TopSearch from './components/TopSearch'
import ProportionSales from './components/ProportionSales'
import { useRequest, useModel } from 'umi'
import { fakeChartData } from './service'
import PageLoading from './components/PageLoading'

// === Services === //
import {
  getVaultDailyData,
  getVaultHourlyData,
  getTransations,
} from './../../../services/dashboard-service'

// === Utils === //
import { filter, map, isEmpty } from 'lodash'
// === Styles === //
import styles from './style.less'
import moment from 'moment'

const buttons = ['1D', '1W', '1M', '1Y']

const Analysis = () => {
  const [currentTab4tvl, setCurrentTab1] = useState(buttons[0])
  const [currentTab4sp, setCurrentTab2] = useState(buttons[0])
  const [tvlArray, setTvlArray] = useState([])
  const [spArray, setSpArray] = useState([])
  const [transations, setTransations] = useState([])

  const { dataSource, reload, loading } = useModel('useDashboardData')

  const vaultAddress = dataSource?.vaultDetail?.id

  console.log('dataSource=', dataSource, transations)

  useEffect(() => {
    if (currentTab4tvl === buttons[0]) {
      getVaultHourlyData(10)
        .then(array =>
          map(array, item => {
            return { date: moment(3600 * item.id).format('HH:mm'), value: item.tvl }
          }),
        )
        .then(setTvlArray) //6400
    }
    // else if (currentTab4tvl === buttons[1]) {
    //   getVaultDailyData(7)
    //     .then(array =>
    //       map(array, item => {
    //         return { date: moment(86400 * item.id).format('yyyy-MM-DD'), value: item.tvl }
    //       }),
    //     )
    //     .then(setTvlArray) //6400
    // } else if (currentTab4tvl === buttons[2]) {
    //   getVaultDailyData(30)
    //     .then(array =>
    //       map(array, item => {
    //         return { date: moment(86400 * item.id).format('yyyy-MM-DD'), value: item.tvl }
    //       }),
    //     )
    //     .then(setTvlArray) //6400
    // } else if (currentTab4tvl === buttons[3]) {
    //   getVaultDailyData(365)
    //     .then(array =>
    //       map(array, item => {
    //         return { date: moment(86400 * item.id).format('yyyy-MM-DD'), value: item.tvl }
    //       }),
    //     )
    //     .then(setTvlArray) //6400
    // }
    // getVaultDailyData(24).then(aa => console.log('aa=', aa)) //86400
  }, [currentTab4tvl])

  useEffect(() => {
    if (isEmpty(vaultAddress)) return
    getTransations(vaultAddress).then(setTransations)
  }, [vaultAddress])

  useEffect(() => {
    getVaultHourlyData(5)
      .then(array =>
        map(array, item => {
          return {
            date: moment(3600 * item.id).format('yyyy-MM-DD HH:mm'),
            value: item.pricePerShare,
          }
        }),
      )
      .then(setSpArray) //6400
  }, [currentTab4sp])

  return (
    <GridContent>
      <Suspense fallback={<PageLoading />}>
        <IntroduceRow loading={loading} visitData={dataSource} />
      </Suspense>
      <Suspense fallback={null}>
        <Card
          loading={loading}
          title='TVL'
          className={styles.offlineCard}
          bordered={false}
          extra={map(buttons, b => (
            <Button
              key={b}
              ghost
              style={{ marginLeft: 10 }}
              type={currentTab4tvl === b ? 'primary' : ''}
              onClick={() => setCurrentTab1(b)}
            >
              {b}
            </Button>
          ))}
          style={{
            marginTop: 32,
          }}
        >
          <div
            style={{
              padding: '0 24px',
            }}
          >
            <Line
              forceFit
              responsive
              data={tvlArray}
              padding='auto'
              xField='date'
              yField='value'
              height={400}
              smooth
            />
          </div>
        </Card>
      </Suspense>
      <Suspense fallback={null}>
        <Card
          loading={loading}
          title='Share Price'
          className={styles.offlineCard}
          bordered={false}
          extra={map(buttons, b => (
            <Button
              key={b}
              ghost
              style={{ marginLeft: 10 }}
              type={currentTab4sp === b ? 'primary' : ''}
              onClick={() => setCurrentTab2(b)}
            >
              {b}
            </Button>
          ))}
          style={{
            marginTop: 32,
          }}
        >
          <div
            style={{
              padding: '0 24px',
            }}
          >
            <Line
              forceFit
              responsive
              color={['#2ca02c']}
              data={spArray}
              padding='auto'
              xField='date'
              yField='value'
              height={400}
              smooth
            />
          </div>
        </Card>
      </Suspense>
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
      <Suspense fallback={null}>
        <StrategyTable loading={loading} searchData={dataSource?.vaultDetail?.strategies || []} />
      </Suspense>
      <Suspense fallback={null}>
        <TransationsTable loading={loading} visitData={transations} />
      </Suspense>
    </GridContent>
  )
}

export default Analysis
