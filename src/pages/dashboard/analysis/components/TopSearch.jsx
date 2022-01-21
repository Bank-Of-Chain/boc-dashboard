import { InfoCircleOutlined } from '@ant-design/icons';
import { Card, Col, Row, Table, Tooltip, Image } from 'antd';
import { TinyArea } from '@ant-design/charts';
import React from 'react';
import NumberInfo from './NumberInfo';
import styles from '../style.less';
import { useModel } from 'umi';

// === Constants === //
import STRATEGIES_MAP from './../../../../constants/strategies';

// === Utils === //
import groupBy from 'lodash/groupBy';
import reduce from 'lodash/reduce';
import { mapValues, values } from 'lodash';
import { toFixed } from './../../../../helper/number-format';
import { getDecimals } from './../../../../apollo/client';
import BN from 'bignumber.js';

const columns = [
  {
    title: 'Protocol Name',
    dataIndex: 'name',
    key: 'name',
    render: (text) => (
      <div className={styles.tableCell}>
        <Image
          width={30}
          preview={false}
          src={`${IMAGE_ROOT}/images/${text}.webp`}
          placeholder={text}
          alt={text}
          fallback={`${IMAGE_ROOT}/images/default.webp`}
        />
        <a className={styles.text}>{text}</a>
      </div>
    ),
  },
  {
    title: 'Asset (USDT)',
    dataIndex: 'amount',
    key: 'amount',
    render: (text) => toFixed(text.toString(), getDecimals(), 2),
  },
  {
    title: 'Asset Ratio',
    dataIndex: 'percent',
    key: 'percent',
    render: (text) => <span>{toFixed(text, 1e-2, 2)}%</span>,
  },
];

const TopSearch = ({ loading, visitData = {}, dropdownGroup }) => {
  const { initialState } = useModel('@@initialState');
  if (!initialState.chain) return null;
  const visitData2 = [];
  const { strategies = [] } = visitData;
  const total = reduce(
    strategies,
    (rs, o) => {
      return rs.plus(o.debt);
    },
    BN(0),
  );

  const groupData = groupBy(strategies, 'protocol.id');
  const tableData = values(
    mapValues(groupData, (o, key) => {
      const amount = reduce(
        o,
        (rs, ob) => {
          return rs.plus(ob.debt);
        },
        BN(0),
      );
      return {
        name: STRATEGIES_MAP[initialState.chain][key],
        amount,
        percent: amount.div(total),
      };
    }),
  );
  return (
    <Table
      rowKey={(record) => record.name}
      size="large"
      columns={columns}
      dataSource={tableData}
      pagination={{
        style: {
          marginBottom: 0,
        },
        pageSize: 10,
      }}
    />
  );
};

export default TopSearch;
