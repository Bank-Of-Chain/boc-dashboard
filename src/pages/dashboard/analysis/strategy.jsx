import { Suspense, useState } from 'react'
import { EllipsisOutlined } from '@ant-design/icons'
import { Col, Dropdown, Menu, Row, Card, Image, Descriptions } from 'antd'
import { GridContent } from '@ant-design/pro-layout'
import TransationsTable from './components/TransationsTable'
import ReportTable from './components/ReportTable'
import ApyData from './components/ApyData'
import { useRequest, useModel, history } from 'umi'
import { fakeChartData } from './service'
import { getTimeDistance } from './utils/utils'
import { LeftOutlined } from '@ant-design/icons'
import styles from './style.less'

const Strategy = () => {
  const [salesType, setSalesType] = useState('all')
  const [currentTabKey, setCurrentTabKey] = useState('')
  const [rangePickerValue, setRangePickerValue] = useState(getTimeDistance('year'))
  const { data } = useRequest(fakeChartData)

  const { dataSource, reload, loading } = useModel('useDashboardData')
  console.log('dataSource=', dataSource)

  const isActive = type => {
    if (!rangePickerValue) {
      return ''
    }

    const value = getTimeDistance(type)

    if (!value) {
      return ''
    }

    if (!rangePickerValue[0] || !rangePickerValue[1]) {
      return ''
    }

    if (
      rangePickerValue[0].isSame(value[0], 'day') &&
      rangePickerValue[1].isSame(value[1], 'day')
    ) {
      return styles.currentDate
    }

    return ''
  }

  let salesPieData

  if (salesType === 'all') {
    salesPieData = data?.salesTypeData
  } else {
    salesPieData = salesType === 'online' ? data?.salesTypeDataOnline : data?.salesTypeDataOffline
  }

  const handleTabChange = key => {
    setCurrentTabKey(key)
  }

  const activeKey = currentTabKey || (data?.offlineData[0] && data?.offlineData[0].name) || ''
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
        <ApyData
          activeKey={activeKey}
          loading={loading}
          offlineData={data?.offlineData || []}
          offlineChartData={data?.offlineChartData || []}
          handleTabChange={handleTabChange}
        />
      </Suspense>
      <Suspense fallback={null}>
        <ReportTable
          loading={loading}
          visitData2={data?.visitData2 || []}
          searchData={data?.searchData || []}
        />
      </Suspense>
      <Suspense fallback={null}>
        <TransationsTable
          loading={loading}
          visitData2={data?.visitData2 || []}
          searchData={data?.searchData || []}
        />
      </Suspense>
    </GridContent>
  )
}

export default Strategy
