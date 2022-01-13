import { Suspense } from 'react'
import { Col, Row, Card, Image, Descriptions } from 'antd'
import { GridContent } from '@ant-design/pro-layout'
import ReportTable from './components/ReportTable'
import { Line } from '@ant-design/charts'
import { useRequest, useModel, history } from 'umi'
import { fakeChartData } from './service'
import { LeftOutlined } from '@ant-design/icons'

// === Utils === //
import find from 'lodash/find'

// === Styles === //
import styles from './style.less'

const Strategy = props => {
  const { id } = props?.match?.params
  const { data } = useRequest(fakeChartData)

  const { dataSource, reload, loading } = useModel('useDashboardData')
  const { vaultDetail } = dataSource
  //TODO:  默认选中第一个
  const strategy = find(vaultDetail.strategies, { id }) || vaultDetail.strategies[0]
  return (
    <GridContent>
      <Suspense fallback={null}>
        <Card title={<LeftOutlined onClick={() => history.push('/')} />} bordered={false}>
          <Row justify='space-around'>
            <Col xl={8} lg={8} md={8} sm={8} xs={8}>
              <Image
                preview={false}
                width={300}
                src='https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
              />
            </Col>
            <Col xl={10} lg={10} md={10} sm={10} xs={10}>
              <Descriptions
                title='Base Info'
                style={{
                  marginBottom: 32,
                }}
              >
                <Descriptions.Item label='取货单号'>1000000000</Descriptions.Item>
                <Descriptions.Item label='状态'>已取货</Descriptions.Item>
                <Descriptions.Item label='销售单号'>1234123421</Descriptions.Item>
                <Descriptions.Item label='子订单'>3214321432</Descriptions.Item>
                <Descriptions.Item label='取货单号'>1000000000</Descriptions.Item>
                <Descriptions.Item label='状态'>已取货</Descriptions.Item>
                <Descriptions.Item label='销售单号'>1234123421</Descriptions.Item>
                <Descriptions.Item label='子订单'>3214321432</Descriptions.Item>
                <Descriptions.Item label='取货单号'>1000000000</Descriptions.Item>
                <Descriptions.Item label='状态'>已取货</Descriptions.Item>
                <Descriptions.Item label='销售单号'>1234123421</Descriptions.Item>
                <Descriptions.Item label='子订单'>3214321432</Descriptions.Item>
              </Descriptions>
            </Col>
          </Row>
        </Card>
      </Suspense>
      <Suspense fallback={null}>
        <Card
          loading={loading}
          title='Apy'
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
              height={400}
              data={data?.offlineChartData}
              responsive
              xField='date'
              yField='value'
              seriesField='type'
              interactions={[
                {
                  type: 'slider',
                  cfg: {},
                },
              ]}
              legend={{
                position: 'top-center',
              }}
            />
          </div>
        </Card>
      </Suspense>
      <Suspense fallback={null}>
        <ReportTable loading={loading} visitData={strategy.reports || []} />
      </Suspense>
    </GridContent>
  )
}

export default Strategy
