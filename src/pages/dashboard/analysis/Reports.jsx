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
    title: 'Total Debt (Before)',
    dataIndex: 'originalAmount',
    key: 'originalAmount',
    fixed: 'left',
    width: 100,
    render: value => {
      return <span>{toFixed(value, usdtDecimals, 2)}</span>
    },
  },
  {
    title: 'Total Debt (After)',
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
    title: 'APY (Before)',
    dataIndex: 'originalApr',
    key: 'originalApr',
    render: value => {
      return <span>{(100 * value).toFixed(4)}%</span>
    },
  },
  {
    title: 'APY (After)',
    dataIndex: 'newApr',
    key: 'newApr',
    render: value => {
      return <span>{(100 * value).toFixed(4)}%</span>
    },
  },
  {
    title: 'Profit (Before)',
    dataIndex: 'originalGain',
    key: 'originalGain',
    render: value => {
      return <span>{value.toFixed(2)}</span>
    },
  },
  {
    title: 'Profit (After)',
    dataIndex: 'newGain',
    key: 'newGain',
    render: value => {
      return <span>{value.toFixed(2)}</span>
    },
  },
  {
    title: 'Harvest Fee',
    dataIndex: 'harvestFee',
    key: 'harvestFee',
    render: value => {
      return <span>{value.toFixed(2)}</span>
    },
  },
  {
    title: 'Operate Fee',
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
    title: 'Operate Loss',
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
      render: (text, item, index) => <a onClick={() => setShowIndex(index)}>Report-{text}</a>,
    },
    {
      title: 'Generate Time',
      dataIndex: 'geneTime',
      key: 'geneTime',
      render: text => moment(text).format('yyyy-MM-DD HH:mm:ss'),
    },
    {
      title: 'Operation Type',
      key: 'mode',
      dataIndex: 'mode',
      render: text => {
        if (text === 1)
          return (
            <Tag key={text} color='#2db7f5'>
              DoHardwork
            </Tag>
          )
        if (text === 2)
          return (
            <Tag key={text} color='#87d068'>
              Allocation
            </Tag>
          )
      },
    },
    {
      title: 'Result',
      dataIndex: 'type',
      key: 'type',
      render: text => {
        if (text === 0) return <span key={text}>unexecuted</span>
        if (text === 1) return <span key={text}>executed</span>
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
      render: (text, record, index) => (
        <Space size='middle'>
          <a onClick={() => setShowIndex(index)}>View</a>
        </Space>
      ),
    },
  ]
  const currentReport = get(data.list, showIndex, {})
  const { optimizeResult = {}, investStrategies = {}, isExec } = currentReport
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
    harvestFee,
    totalAssets,
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
      harvestFee: harvestFee[index],
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
            pagination={{
              ...pagination,
              showSizeChanger: false,
            }}
          />
        </Card>
      </Suspense>
      <Modal
        title={''}
        style={{ top: 20 }}
        visible={showIndex !== -1}
        footer={null}
        onCancel={() => setShowIndex(-1)}
        width='1200px'
      >
        <Row>
          <Col span={24}>
            <Descriptions title='Report Details'>
              <Descriptions.Item
                label='Implementation type'
                contentStyle={{ color: isExec === 0 ? 'red' : 'green', fontWeight: 'bold' }}
              >
                {isExec === 0 && 'undo（Not recommended）'}
                {isExec === 1 && 'Implemented（Recommended）'}
                {isExec === 2 && 'enforced（Not recommended）'}
              </Descriptions.Item>
              <Descriptions.Item label='Allocation Profit'>
                {(-1 * fun).toFixed(6)}
              </Descriptions.Item>
              <Descriptions.Item label='Period'>{durationDays} days</Descriptions.Item>
              <Descriptions.Item label='Total Profit(Before)'>
                {sum(originalGain).toFixed(6)} (
                {((365 * 100 * sum(originalGain)) / (totalAssets * durationDays)).toFixed(2)}%)
              </Descriptions.Item>
              <Descriptions.Item label='Total Profit(After)'>
                {sum(newGain).toFixed(6)} (
                {((365 * 100 * sum(newGain)) / (totalAssets * durationDays)).toFixed(2)}%)
              </Descriptions.Item>
              <Descriptions.Item label='Profits Growth'>
                {(sum(newGain) - sum(originalGain)).toFixed(6)}
              </Descriptions.Item>
              <Descriptions.Item label='Total Operate Loss'>
                {sum(operateLoss).toFixed(6)}
              </Descriptions.Item>
              <Descriptions.Item label='Total Operate Fee'>{sum(operateFee).toFixed(6)}</Descriptions.Item>
              <Descriptions.Item label='Total Exhange Loss'>
                {sum(exchangeLoss).toFixed(6)}
              </Descriptions.Item>
              <Descriptions.Item label='Report Time'>
                {moment(currentReport.geneTime).format('yyyy-MM-DD HH:mm:ss')}
              </Descriptions.Item>
            </Descriptions>
          </Col>

          <Col span={24}>
            <Table
              bordered
              columns={detailsColumns}
              dataSource={displayData}
              scroll={{ x: 1300, y: 500 }}
              pagination={false}
            />
          </Col>
        </Row>
      </Modal>
    </GridContent>
  )
}

export default Reports
