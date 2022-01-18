import { Suspense, useEffect, useState } from 'react'
import { Col, Row, Card, Button } from 'antd'
import { Line } from '@ant-design/charts'
import { GridContent } from '@ant-design/pro-layout'
import IntroduceRow from './components/IntroduceRow'
import StrategyTable from './components/StrategyTable'
import TransationsTable from './components/TransationsTable'
import TopSearch from './components/TopSearch'
import ProportionSales from './components/ProportionSales'
import { useModel } from 'umi'
import PageLoading from './components/PageLoading'

// === Services === //
import {
  getVaultDailyData,
  getVaultHourlyData,
  getTransations,
} from './../../../services/dashboard-service'

// === Utils === //
import numeral from 'numeral'
import { map, isEmpty } from 'lodash'

// === Styles === //
import styles from './style.less'
import moment from 'moment'

const buttons = ['1D', '1W', '1M', '1Y']
const calls = [
  () => getVaultHourlyData(20),
  () => getVaultDailyData(7),
  () => getVaultDailyData(30),
  () => getVaultDailyData(365),
]

const Analysis = () => {
  const [currentTab4tvl, setCurrentTab1] = useState(0)
  const [currentTab4sp, setCurrentTab2] = useState(0)
  const [tvlArray, setTvlArray] = useState([])
  const [spArray, setSpArray] = useState([])
  const [transations, setTransations] = useState([])

  const { dataSource, reload, loading } = useModel('useDashboardData')

  const vaultAddress = dataSource?.vaultDetail?.id

  console.log('dataSource=', dataSource)
  console.log('tvlArray=', currentTab4tvl, tvlArray)
  console.log('spArray=', currentTab4sp, spArray)

  useEffect(() => {
    calls[currentTab4tvl]()
      .then(array =>
        map(array, item => {
          return {
            id: item.id,
            date: 1000 * item.id,
            value: item.tvl,
          }
        }),
      )
      .then(setTvlArray)
  }, [currentTab4tvl])

  useEffect(() => {
    if (isEmpty(vaultAddress)) return
    getTransations(vaultAddress).then(setTransations)
  }, [vaultAddress])

  useEffect(() => {
    calls[currentTab4sp]()
      .then(array =>
        map(array, item => {
          return {
            id: item.id,
            date: 1000 * item.id,
            value: item.pricePerShare,
          }
        }),
      )
      .then(setSpArray)
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
          extra={map(buttons, (b, i) => (
            <Button
              key={b}
              ghost
              style={{ marginLeft: 10 }}
              type={currentTab4tvl === i ? 'primary' : ''}
              onClick={() => setCurrentTab1(i)}
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
              yAxis={{
                label: {
                  formatter: v => {
                    return numeral(v).format('0,0')
                  },
                },
              }}
              xAxis={{
                label: {
                  formatter: v => {
                    return moment(Number(v)).format('MM-DD HH:mm')
                  },
                },
              }}
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
          extra={map(buttons, (b, i) => (
            <Button
              key={b}
              ghost
              style={{ marginLeft: 10 }}
              type={currentTab4sp === i ? 'primary' : ''}
              onClick={() => setCurrentTab2(i)}
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
              yAxis={{
                label: {
                  formatter: v => {
                    return numeral(v).format('0,0')
                  },
                },
              }}
              xAxis={{
                label: {
                  formatter: v => {
                    return moment(Number(v)).format('MM-DD HH:mm')
                  },
                },
              }}
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
