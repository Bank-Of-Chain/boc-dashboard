import { Suspense } from 'react'
import { Col, Row, Card, Image, Descriptions } from 'antd'
import { GridContent } from '@ant-design/pro-layout'
import ReportTable from './components/ReportTable'
import { Line } from '@ant-design/charts'
import { useRequest, useModel, history } from 'umi'
import { fakeChartData } from './service'
import { LeftOutlined } from '@ant-design/icons'

// === Constants === //
import { MATIC_STRATEGIES_MAP } from './../../../constants/strategies'

// === Components === //
import CoinSuperPosition from './components/CoinSuperPosition/index'

// === Utils === //
import find from 'lodash/find'

// === Styles === //
import styles from './style.less'
import { filter, map } from 'lodash'

const Strategy = props => {
  const { id } = props?.match?.params
  const { data } = useRequest(fakeChartData)

  const { dataSource, reload, loading } = useModel('useDashboardData')
  console.log('dataSource=', dataSource)
  const { vaultDetail } = dataSource
  const strategy = find(vaultDetail.strategies, { id })

  const { underlyingTokens, depositedAssets } = strategy
  return (
    <GridContent>
      <Suspense fallback={null}>
        <Card title={<LeftOutlined onClick={() => history.push('/')} />} bordered={false}>
          <Row justify='space-around'>
            <Col xl={8} lg={8} md={8} sm={8} xs={8}>
              <Image preview={false} width={300} src={`/images/${MATIC_STRATEGIES_MAP[strategy?.protocol.id]}.webp`} fallback={'/images/default.webp'} />
            </Col>
            <Col xl={10} lg={10} md={10} sm={10} xs={10}>
              <Descriptions
                column={1}
                title='Base Info'
                style={{
                  marginBottom: 32,
                }}
              >
                <Descriptions.Item label='Underlying Token'>
                  <CoinSuperPosition array={map(underlyingTokens, 'token.id')} />
                </Descriptions.Item>
                <Descriptions.Item label='Deposited'>{depositedAssets}</Descriptions.Item>
                <Descriptions.Item label='Status'>Active</Descriptions.Item>
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
      <Suspense fallback={null}>
        <ReportTable loading={loading} visitData={strategy.reports || []} />
      </Suspense>
    </GridContent>
  )
}

export default Strategy
