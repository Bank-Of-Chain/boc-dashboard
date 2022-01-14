import { InfoCircleOutlined } from '@ant-design/icons'
import { Card, Col, Row, Table, Tooltip, Image } from 'antd'
import { TinyArea } from '@ant-design/charts'
import React from 'react'
import NumberInfo from './NumberInfo'
import styles from '../style.less'

// === Utils === //
import groupBy from 'lodash/groupBy'
import sumBy from 'lodash/sumBy'
import { mapValues, values } from 'lodash'

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    render: text => (
      <div className={styles.tableCell}>
        <Image
          width={30}
          preview={false}
          src={`./images/${text}.webp`}
          placeholder={text}
          alt={text}
        />
        <a className={styles.text}>{text}</a>
      </div>
    ),
  },
  {
    title: 'Percent',
    dataIndex: 'percent',
    key: 'percent',
  },
  {
    title: 'Amount',
    dataIndex: 'amount',
    key: 'amount',
  },
]

const TopSearch = ({ loading, visitData, dropdownGroup }) => {
  const visitData2 = [
    {
      x: '2022-01-13',
      y: 1,
    },
    {
      x: '2022-01-14',
      y: 6,
    },
    {
      x: '2022-01-15',
      y: 4,
    },
    {
      x: '2022-01-16',
      y: 8,
    },
    {
      x: '2022-01-17',
      y: 3,
    },
    {
      x: '2022-01-18',
      y: 7,
    },
    {
      x: '2022-01-19',
      y: 2,
    },
  ]
  const { strategies } = visitData
  const total = sumBy(strategies, 'debt.amount')

  const groupData = groupBy(strategies, 'protocol.id')
  const tableData = values(
    mapValues(groupData, (o, key) => {
      const amount = sumBy(o, 'debt.amount')
      return { name: key, amount, percent: `${((100 * amount) / total).toFixed(2)}%` }
    }),
  )
  return (
    <Card
      loading={loading}
      bordered={false}
      title='Group'
      extra={dropdownGroup}
      style={{
        height: '100%',
      }}
    >
      <Row gutter={68}>
        <Col
          sm={8}
          xs={24}
          style={{
            marginBottom: 24,
          }}
        >
          <NumberInfo
            subTitle={
              <span>
                日收益率
                <Tooltip title='昨日收益率'>
                  <InfoCircleOutlined
                    style={{
                      marginLeft: 8,
                    }}
                  />
                </Tooltip>
              </span>
            }
            gap={8}
            total={12.33}
            status='up'
            subTotal={17.1}
          />
          <TinyArea xField='x' height={45} forceFit yField='y' smooth data={visitData2} />
        </Col>
        <Col
          sm={8}
          xs={24}
          style={{
            marginBottom: 24,
          }}
        >
          <NumberInfo
            subTitle={
              <span>
                周收益率
                <Tooltip title='过去7日平均收益'>
                  <InfoCircleOutlined
                    style={{
                      marginLeft: 8,
                    }}
                  />
                </Tooltip>
              </span>
            }
            total={15.6}
            status='down'
            subTotal={26.2}
            gap={8}
          />
          <TinyArea xField='x' height={45} forceFit yField='y' smooth data={visitData2} />
        </Col>
        <Col
          sm={8}
          xs={24}
          style={{
            marginBottom: 24,
          }}
        >
          <NumberInfo
            subTitle={
              <span>
                年收益率
                <Tooltip title='365天平均收益'>
                  <InfoCircleOutlined
                    style={{
                      marginLeft: 8,
                    }}
                  />
                </Tooltip>
              </span>
            }
            total={12.7}
            status='down'
            subTotal={26.2}
            gap={8}
          />
          <TinyArea xField='x' height={45} forceFit yField='y' smooth data={visitData2} />
        </Col>
      </Row>
      <Table
        rowKey={record => record.name}
        size='small'
        columns={columns}
        dataSource={tableData}
        pagination={{
          style: {
            marginBottom: 0,
          },
          pageSize: 5,
        }}
      />
    </Card>
  )
}

export default TopSearch
