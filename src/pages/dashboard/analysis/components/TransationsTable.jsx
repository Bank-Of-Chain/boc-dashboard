import { Card, Table } from 'antd';
import React from 'react';

// === Styles === //
import styles from '../style.less';

// === Utils === //
import moment from 'moment';
import numeral from 'numeral';

const columns = [
  {
    title: 'Txn Hash',
    dataIndex: 'id',
    key: 'id',
    width: 300,
    ellipsis: {
      showTitle: false,
    },
    render: (text) => <a title={text}>{text}</a>,
  },
  {
    title: 'Method',
    dataIndex: 'method',
    key: 'method',
    render: (text) => <a style={{ color: text === 'Deposit' ? '#80FF80' : '#FF8080' }}>{text}</a>,
  },
  {
    title: 'Account',
    dataIndex: 'address',
    key: 'address',
    width: 300,
    ellipsis: {
      showTitle: false,
    },
    render: (text) => <a title={text}>{text}</a>,
  },
  {
    title: 'Shares(USDT Amount)',
    render: (text, item) =>
      `${numeral(item.shares).format('0,0')}(${numeral(item.shareValue).format('0,0')})`,
  },
  {
    title: 'From',
    dataIndex: 'from',
    key: 'from',
    width: 200,
    ellipsis: {
      showTitle: false,
    },
    render: (text) => <a title={text}>{text}</a>,
  },
  {
    title: 'Date',
    dataIndex: 'timestamp',
    key: 'timestamp',
    render: (text) => moment(1000 * text).fromNow(),
  },
];

const TransationsTable = ({ loading, visitData, dropdownGroup }) => (
  <Card
    loading={loading}
    bordered={false}
    title="Transations"
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

export default TransationsTable;
