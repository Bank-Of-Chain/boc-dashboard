import React, { Suspense, useState } from 'react'

// === Components === //
import { InfoCircleOutlined } from '@ant-design/icons'
import { GridContent } from '@ant-design/pro-layout'
import { Col, Row, Tooltip, Result, Button, Card } from 'antd'
import { ChartCard } from './components/Charts'
import { BarEchart } from '@/components/echarts'

const topColResponsiveProps = {
  xs: 24,
  sm: 6,
  md: 6,
  lg: 6,
  xl: 6,
}

const Personal = props => {
  const [hasConnect, setHasConnect] = useState(true)

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
  const option1 = {
    title: {
      text: '',
      subtext: '',
    },
    tooltip: {
      trigger: 'axis',
    },
    legend: {
      data: ['TVL', 'Profit'],
    },
    calculable: true,
    xAxis: [
      {
        type: 'category',
        data: [
          '2-1',
          '2-2',
          '2-3',
          '2-4',
          '2-5',
          '2-6',
          '2-7',
          '2-8',
          '2-9',
          '2-10',
          '2-11',
          '2-12',
        ],
      },
    ],
    yAxis: [
      {
        type: 'value',
      },
    ],
    series: [
      {
        name: 'TVL',
        type: 'bar',
        data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3],
      },
      {
        name: 'Profit',
        type: 'bar',
        data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3],
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
              total='132000.13'
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
              total='132000.13'
              contentHeight={100}
            />
          </Col>

          <Col {...topColResponsiveProps}>
            <ChartCard
              bordered={false}
              loading={false}
              title='Deposit-1W (USDT)'
              action={
                <Tooltip title='How much USDT was Deposited in the last week'>
                  <InfoCircleOutlined />
                </Tooltip>
              }
              total='1500'
              contentHeight={70}
            />
          </Col>
          <Col {...topColResponsiveProps}>
            <ChartCard
              bordered={false}
              loading={false}
              title='Withdraw-1W'
              action={
                <Tooltip title='How much Shares was Withdraw in the last week'>
                  <InfoCircleOutlined />
                </Tooltip>
              }
              total='2000'
              contentHeight={70}
            />
          </Col>
          <Col {...topColResponsiveProps}>
            <ChartCard
              bordered={false}
              loading={false}
              title='USDT Balance (USDT)'
              action={
                <Tooltip title='The amount of USDT'>
                  <InfoCircleOutlined />
                </Tooltip>
              }
              total='51511.2132'
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
              total='12.12'
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
              total='123.12'
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
              total='2.52%'
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
          title='Daily Profit & TVL'
        >
          <BarEchart option={option1} style={{ height: '100%' }} />
        </Card>
      </Suspense>
    </GridContent>
  )
}

export default Personal
