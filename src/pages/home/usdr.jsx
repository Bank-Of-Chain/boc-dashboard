import React from 'react'
import { Suspense } from 'react'

// === Components === //
import { GridContent } from '@ant-design/pro-layout'
import { Row, Col, Typography, Table, Card, Collapse } from 'antd'
import IntroduceRow from './components/IntroduceRow'
import { LineEchart } from '@/components/echarts'
import ChainChange from '@/components/ChainChange'

// === Constants === //

// === Services === //

// === Utils === //
import numeral from 'numeral'

// === Styles === //

const { Title } = Typography
const { Panel } = Collapse

const USDiHome = () => {
  const loading = false
  const introduceData = [
    {
      title: 'Vaults',
      tip: 'Current total USDi supply.',
      content: numeral('33222112').format('0.[0000]a'),
      loading,
      unit: '',
      subTitle: <p>+ 335 (last 24h)</p>
    },
    {
      title: 'Holders',
      tip: 'Number Of USDi holders.',
      content: numeral('123124').format('0.[0000]a'),
      loading
    },
    {
      title: 'APY (last 30 days)',
      tip: 'Yield over the past month.',
      content: numeral('123124').format('0.[0000]a'),
      loading,
      unit: ''
    }
  ]

  const dataSource = [
    {
      key: '1',
      name: '胡彦斌',
      age: 32,
      address: '西湖区湖底公园1号'
    },
    {
      key: '2',
      name: '胡彦祖',
      age: 42,
      address: '西湖区湖底公园1号'
    },
    {
      key: '3',
      name: '胡彦斌',
      age: 32,
      address: '西湖区湖底公园1号'
    },
    {
      key: '4',
      name: '胡彦祖',
      age: 42,
      address: '西湖区湖底公园1号'
    },
    {
      key: '5',
      name: '胡彦斌',
      age: 32,
      address: '西湖区湖底公园1号'
    },
    {
      key: '6',
      name: '胡彦祖',
      age: 42,
      address: '西湖区湖底公园1号'
    }
  ]

  const columns = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: '年龄',
      dataIndex: 'age',
      key: 'age'
    },
    {
      title: '住址',
      dataIndex: 'address',
      key: 'address'
    }
  ]
  const options = {
    animation: false,
    textStyle: {
      color: '#fff'
    },
    grid: {
      top: 40,
      left: '0%',
      right: '5%',
      bottom: '0%',
      containLabel: true
    },
    tooltip: {
      trigger: 'axis',
      borderWidth: 0,
      backgroundColor: '#292B2E',
      textStyle: {
        color: '#fff'
      }
    },
    xAxis: {
      axisLabel: {},
      type: 'category',
      data: [
        '2022-09-14 00:00 (UTC)',
        '2022-09-15 00:00 (UTC)',
        '2022-09-16 00:00 (UTC)',
        '2022-09-17 00:00 (UTC)',
        '2022-09-18 00:00 (UTC)',
        '2022-09-19 00:00 (UTC)',
        '2022-09-20 00:00 (UTC)',
        '2022-09-21 00:00 (UTC)',
        '2022-09-22 00:00 (UTC)',
        '2022-09-23 00:00 (UTC)',
        '2022-09-24 00:00 (UTC)',
        '2022-09-25 00:00 (UTC)',
        '2022-09-26 00:00 (UTC)',
        '2022-09-27 00:00 (UTC)',
        '2022-09-28 00:00 (UTC)',
        '2022-09-29 00:00 (UTC)',
        '2022-09-30 00:00 (UTC)',
        '2022-10-01 00:00 (UTC)',
        '2022-10-02 00:00 (UTC)',
        '2022-10-03 00:00 (UTC)',
        '2022-10-04 00:00 (UTC)',
        '2022-10-05 00:00 (UTC)',
        '2022-10-06 00:00 (UTC)',
        '2022-10-07 00:00 (UTC)',
        '2022-10-08 00:00 (UTC)',
        '2022-10-09 00:00 (UTC)',
        '2022-10-10 00:00 (UTC)',
        '2022-10-11 00:00 (UTC)',
        '2022-10-12 00:00 (UTC)',
        '2022-10-13 00:00 (UTC)',
        '2022-10-14 00:00 (UTC)'
      ],
      axisTick: {
        alignWithLabel: true
      }
    },
    yAxis: {
      type: 'value',
      splitLine: {
        lineStyle: {
          color: '#454459'
        }
      }
    },
    dataZoom: null,
    color: ['#A68EFE', '#5470c6', '#91cc75'],
    series: [
      {
        name: 'USDi',
        data: [
          '149291.88',
          '149314.25',
          '149362.86',
          '149362.86',
          '149376.75',
          '149398.49',
          '149400.59',
          '149465.32',
          '149357.19',
          '149357.19',
          '149357.19',
          '49416.99',
          '49999.79',
          '200015.47',
          '200015.47',
          '400992.76',
          '400992.76',
          '401081.78',
          '401256.94',
          '401256.94',
          '401280.83',
          '401542.24',
          '401679.00',
          '401679.00',
          '401696.69',
          '401729.40',
          '401729.40',
          '401856.80',
          '401921.13',
          '401921.13',
          '404621.72'
        ],
        type: 'line',
        lineStyle: {
          width: 5,
          cap: 'round'
        },
        smooth: false,
        connectNulls: true,
        showSymbol: false
      }
    ]
  }

  const jsx = (
    <Row gutter={[24, 24]}>
      <Col span={24}>
        <Suspense fallback={null}>
          <IntroduceRow data={introduceData} />
        </Suspense>
      </Col>
      <Col span={24}>
        <Suspense fallback={null}>
          <IntroduceRow data={introduceData} />
        </Suspense>
      </Col>
      <Col span={24}>
        <Suspense fallback={null}>
          <Card title={'IRR'}>
            <LineEchart option={options} style={{ minHeight: '500px', width: '100%' }} />
          </Card>
        </Suspense>
      </Col>
      <Col span={24}>
        <Suspense>
          <Card title={'My Vaults'}>
            <Table dataSource={dataSource} columns={columns} />
          </Card>
        </Suspense>
      </Col>
    </Row>
  )

  return (
    <GridContent>
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Suspense fallback={null}>
            <Title style={{ textAlign: 'center' }} level={1}>
              Board for USDr
            </Title>
            <ChainChange />
          </Suspense>
        </Col>
        <Col span={24}>
          <Collapse defaultActiveKey={['1']}>
            <Panel header="xxxxxxxxxxxxxxxxxxxxx" key="1">
              {jsx}
            </Panel>
            <Panel header="xxxxxxxxxxxxxxxxxxxxx" key="2">
              {jsx}
            </Panel>
            <Panel header="xxxxxxxxxxxxxxxxxxx" key="3">
              {jsx}
            </Panel>
          </Collapse>
        </Col>
      </Row>
    </GridContent>
  )
}

export default USDiHome
