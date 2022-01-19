import { Card, Table } from 'antd';
import React from 'react';

// === Utils === //
import numeral from 'numeral';
import moment from 'moment';
import { toFixed } from './../../../../helper/number-format'
import { getDecimals } from './../../../../apollo/client'

// === Styles === //
import styles from '../style.less';
const columns = [
  {
    title: 'Txn Hash',
    dataIndex: 'id',
    key: 'id',
    width: 550,
    ellipsis: {
      showTitle: false,
    },
    render: (text) => <a title={text}>{text}</a>,
  },
  {
    title: 'Amount',
    dataIndex: 'nowStrategyTotalDebt',
    key: 'nowStrategyTotalDebt',
    render: (text) => <span>{toFixed(text, getDecimals(),2)}</span>,
  },
  {
    title: 'Profit',
    dataIndex: 'profit',
    key: 'profit',
    render: (text) => <span>{toFixed(text, getDecimals(),2)}</span>,
  },
  {
    title: 'Date',
    dataIndex: 'timestamp',
    key: 'timestamp',
    render: (text) => moment(1000 * text).fromNow(),
  },
];

const ReportTable = ({ loading, visitData, dropdownGroup }) => (
  <Card
    loading={loading}
    bordered={false}
    title="Reports"
    extra={dropdownGroup}
    style={{
      height: '100%',
      marginTop: 32,
    }}
  >
    <Table
      rowKey={(record) => record.id}
      size="small"
      columns={columns}
      dataSource={visitData}
      pagination={{
        style: {
          marginBottom: 0,
        },
        pageSize: 10,
      }}
    />
  </Card>
);

export default ReportTable;
