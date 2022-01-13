import { InfoCircleOutlined } from '@ant-design/icons'
import { Card, Col, Row, Table, Tooltip } from 'antd'
import { TinyArea } from '@ant-design/charts'
import React from 'react'
import numeral from 'numeral'
import NumberInfo from './NumberInfo'
import Trend from './Trend'
import styles from '../style.less'
const columns = [
  {
    title: 'Name',
    dataIndex: 'index',
    key: 'index',
  },
  {
    title: 'Percent',
    dataIndex: 'keyword',
    key: 'keyword',
  },
  {
    title: 'Amount',
    dataIndex: 'count',
    key: 'count',
    className: styles.alignRight,
  },
]

const TopSearch = ({ loading, visitData2, searchData, dropdownGroup }) => (
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
        sm={12}
        xs={24}
        style={{
          marginBottom: 24,
        }}
      >
        <NumberInfo
          subTitle={
            <span>
              搜索用户数
              <Tooltip title='指标说明'>
                <InfoCircleOutlined
                  style={{
                    marginLeft: 8,
                  }}
                />
              </Tooltip>
            </span>
          }
          gap={8}
          total={numeral(12321).format('0,0')}
          status='up'
          subTotal={17.1}
        />
        <TinyArea xField='x' height={45} forceFit yField='y' smooth data={visitData2} />
      </Col>
      <Col
        sm={12}
        xs={24}
        style={{
          marginBottom: 24,
        }}
      >
        <NumberInfo
          subTitle={
            <span>
              人均搜索次数
              <Tooltip title='指标说明'>
                <InfoCircleOutlined
                  style={{
                    marginLeft: 8,
                  }}
                />
              </Tooltip>
            </span>
          }
          total={2.7}
          status='down'
          subTotal={26.2}
          gap={8}
        />
        <TinyArea xField='x' height={45} forceFit yField='y' smooth data={visitData2} />
      </Col>
    </Row>
    <Table
      rowKey={record => record.index}
      size='small'
      columns={columns}
      dataSource={searchData}
      pagination={{
        style: {
          marginBottom: 0,
        },
        pageSize: 5,
      }}
    />
  </Card>
)

export default TopSearch
