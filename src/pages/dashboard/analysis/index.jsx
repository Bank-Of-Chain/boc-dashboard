import { Suspense } from 'react'
import { Col, Row, Card } from 'antd'
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

// === Utils === //
import { filter } from 'lodash'
// === Styles === //
import styles from './style.less'

const Analysis = () => {
  const { data } = useRequest(fakeChartData)

  const { dataSource, reload, loading } = useModel('useDashboardData')

  return (
    <GridContent>
      <>
        <Suspense fallback={<PageLoading />}>
          <IntroduceRow loading={loading} visitData={dataSource?.vaultDetail} />
        </Suspense>
        <Suspense fallback={null}>
          <Card
            loading={loading}
            title='TVL'
            className={styles.offlineCard}
            bordered={false}
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
                data={filter(data?.offlineChartData, { type: '支付笔数' })}
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
          <TransationsTable loading={loading} visitData={dataSource?.transations || []} />
        </Suspense>
      </>
    </GridContent>
  )
}

export default Analysis
