import React, { useState, Suspense } from 'react'
import { useRequest, useModel } from 'umi'
import moment from 'moment'

// === Components === //
import { GridContent } from '@ant-design/pro-layout'
import { Table, Card, Space, Tag, Modal, Descriptions, Row, Col } from 'antd'

// === Services === //
import { getReports } from './../../../services/api-service'

// === Utils === //
import get from 'lodash/get'
import map from 'lodash/map'
import sum from 'lodash/sum'
import { toFixed } from './../../../helper/number-format'
import { getDecimals } from './../../../apollo/client'

const usdtDecimals = getDecimals()

const detailsColumns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    fixed: 'left',
    width: 200,
    ellipsis: true,
    render: (text, item, index) => {
      return (
        <a title={text} key={index}>
          {text}
        </a>
      )
    },
  },
  {
    title: 'Total Debt(B.C.)',
    dataIndex: 'originalAmount',
    key: 'originalAmount',
    fixed: 'left',
    width: 100,
    render: value => {
      return <span>{toFixed(value, usdtDecimals, 2)}</span>
    },
  },
  {
    title: 'Total Debt(A.D.)',
    dataIndex: 'totalAmount',
    key: 'totalAmount',
    fixed: 'left',
    width: 100,
    render: value => {
      return <span>{toFixed(value, usdtDecimals, 2)}</span>
    },
  },
  {
    title: 'Amount',
    dataIndex: 'amount',
    key: 'amount',
    render: value => {
      return <span>{toFixed(value, usdtDecimals, 2)}</span>
    },
  },
  {
    title: 'Total Profit',
    dataIndex: 'deltaGain',
    key: 'deltaGain',
    render: value => {
      return <span>{value.toFixed(2)}</span>
    },
  },
  {
    title: 'APY(B.C.)',
    dataIndex: 'originalApr',
    key: 'originalApr',
    render: value => {
      return <span>{(100 * value).toFixed(4)}%</span>
    },
  },
  {
    title: 'APY(A.D.)',
    dataIndex: 'newApr',
    key: 'newApr',
    render: value => {
      return <span>{(100 * value).toFixed(4)}%</span>
    },
  },
  {
    title: 'Profit(B.C.)',
    dataIndex: 'originalGain',
    key: 'originalGain',
    render: value => {
      return <span>{value.toFixed(2)}</span>
    },
  },
  {
    title: 'Profit(A.D.)',
    dataIndex: 'newGain',
    key: 'newGain',
    render: value => {
      return <span>{value.toFixed(2)}</span>
    },
  },
  {
    title: 'Fee',
    dataIndex: 'operateFee',
    key: 'operateFee',
    render: value => {
      return <span>{value.toFixed(2)}</span>
    },
  },
  {
    title: 'Exchange Loss',
    dataIndex: 'exchangeLoss',
    key: 'exchangeLoss',
    render: value => {
      return <span>{value.toFixed(2)}</span>
    },
  },
  {
    title: 'Loss',
    dataIndex: 'operateLoss',
    key: 'operateLoss',
    render: value => {
      return <span>{value.toFixed(2)}</span>
    },
  },
]

const Reports = () => {
  const { initialState } = useModel('@@initialState')
  const [showIndex, setShowIndex] = useState(-1)

  const { data, error, loading, pagination } = useRequest(
    ({ current, pageSize }) => {
      return getReports({ chainId: initialState.chain }, (current - 1) * pageSize, pageSize)
    },
    {
      paginated: true,
      formatResult: resp => {
        const { content } = resp
        return {
          total: resp.totalElements,
          list: map(content, i => {
            return {
              ...i,
              investStrategies: JSON.parse(i.investStrategies),
              optimizeResult: JSON.parse(i.optimizeResult),
            }
          }),
        }
      },
    },
  )
  if (loading) {
    return <div>loading...</div>
  }
  if (error) {
    return <div>{error.message}</div>
  }

  const columns = [
    {
      title: 'Name',
      dataIndex: 'id',
      key: 'id',
      render: text => <a>Report-{text}</a>,
    },
    {
      title: 'Generate Time',
      dataIndex: 'geneTime',
      key: 'geneTime',
      render: text => moment(text).format('yyyy-MM-DD HH:mm:ss'),
    },
    {
      title: 'Mode',
      key: 'mode',
      dataIndex: 'mode',
      render: text => {
        if (text === 1)
          return (
            <Tag key={text} color='#2db7f5'>
              doHardwork
            </Tag>
          )
        if (text === 2)
          return (
            <Tag key={text} color='#87d068'>
              allocation
            </Tag>
          )
      },
    },
    {
      title: 'Created Time',
      key: 'fetchTime',
      dataIndex: 'fetchTime',
      render: text =>
        moment(text)
          .locale('en')
          .fromNow(),
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record, index) => (
        <Space size='middle'>
          <a onClick={() => setShowIndex(index)}>View</a>
        </Space>
      ),
    },
  ]
  const currentReport = get(data.list, showIndex, {})
  const { optimizeResult = {}, investStrategies = {} } = currentReport
  console.log('currentReport=', optimizeResult)
  const {
    address,
    name,
    deltaAssets,
    deltaGain,
    exchangeLoss,
    jac,
    newApr,
    newGain,
    operateFee,
    operateLoss,
    originalApr,
    originalGain,
    fun,
    durationDays,
  } = optimizeResult

  let displayData = map(address, (strategy, index) => {
    return {
      key: strategy,
      name: name[index],
      deltaGain: deltaGain[index],
      deltaAssets: deltaAssets[index],
      exchangeLoss: exchangeLoss[index],
      jac: jac[index],
      newApr: newApr[index],
      newGain: newGain[index],
      operateFee: operateFee[index],
      operateLoss: operateLoss[index],
      originalApr: originalApr[index],
      originalGain: originalGain[index],
      amount: get(investStrategies, `${strategy}.amount`, '0'),
      totalAmount: get(investStrategies, `${strategy}.totalAmount`, '0'),
      originalAmount: get(investStrategies, `${strategy}.originalAmount`, '0'),
      apy: get(investStrategies, `${strategy}.apy`, 0),
    }
  })
  return (
    <GridContent>
      <Suspense fallback={null}>
        <Card loading={loading} bordered={false} title='Allocation Reports'>
          <Table
            rowKey={record => record.id}
            columns={columns}
            dataSource={data.list}
            pagination={pagination}
          />
        </Card>
      </Suspense>
      <Modal
        title={''}
        style={{ top: 20 }}
        visible={showIndex !== -1}
        footer={null}
        onCancel={() => setShowIndex(-1)}
        width='1000px'
      >
        <Row>
          <Col span={24}>
            <Descriptions title='Report Details'>
              <Descriptions.Item
                label='建议操作'
                contentStyle={{ color: fun > 0 ? 'red' : 'green' }}
              >
                {fun > 0 ? '不调仓' : '调仓'}
              </Descriptions.Item>
              <Descriptions.Item label='执行调仓收益'>{(-1 * fun).toFixed(6)}</Descriptions.Item>
              <Descriptions.Item label='调仓计算周期'>{durationDays}天</Descriptions.Item>
              <Descriptions.Item label='Total Profit(B.C.)'>
                {sum(originalGain).toFixed(6)}
              </Descriptions.Item>
              <Descriptions.Item label='Total Profit(A.D.)'>
                {sum(newGain).toFixed(6)}
              </Descriptions.Item>
              <Descriptions.Item label='Profits'>
                {(sum(newGain) - sum(originalGain)).toFixed(6)}
              </Descriptions.Item>
              <Descriptions.Item label='Total Loss'>
                {sum(operateLoss).toFixed(6)}
              </Descriptions.Item>
              <Descriptions.Item label='Total Fee'>{sum(operateFee).toFixed(6)}</Descriptions.Item>
              <Descriptions.Item label='Total Exhange Loss'>
                {sum(exchangeLoss).toFixed(6)}
              </Descriptions.Item>
              <Descriptions.Item label='报告生成时间'>2022-02-02</Descriptions.Item>
            </Descriptions>
          </Col>

          <Col span={24}>
            <Table
              bordered
              columns={detailsColumns}
              dataSource={displayData}
              scroll={{ x: 1300 }}
              pagination={false}
            />
          </Col>
        </Row>
      </Modal>
    </GridContent>
  )
}

export default Reports
