import { Card } from 'antd';
import { Donut } from '@ant-design/charts';
import React from 'react';
import { useModel } from 'umi';

// === Utils === //
import { reduce, mapValues, groupBy, values } from 'lodash';
import { toFixed } from './../../../../helper/number-format';
import { getDecimals } from './../../../../apollo/client';
import BN from 'bignumber.js';

// === Constants === //
import STRATEGIES_MAP from './../../../../constants/strategies';

// === Styles === //
import styles from '../style.less';

const ProportionSales = ({ loading, visitData = {} }) => {
  const { strategies = [] } = visitData;
  const { initialState } = useModel('@@initialState');
  if (!initialState.chain) return null;

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
        amount: toFixed(amount, getDecimals(), 2),
      };
    }),
  );
  return (
    <Card
      loading={loading}
      className={styles.salesCard}
      bordered={false}
      title="Funding Ratio"
      style={{
        height: '100%',
      }}
    >
      <div>
        <Donut
          forceFit
          height={340}
          radius={1}
          innerRadius={0.75}
          angleField="amount"
          colorField="name"
          data={tableData}
          legend={{
            visible: true,
          }}
          label={{
            visible: true,
            type: 'spider',
            offset: 20,
            formatter: (text, item) => {
              return `${item._origin.name}: ${item._origin.amount}`;
            },
          }}
          statistic={{
            visible: true,
            content: {
              value: toFixed(total, getDecimals(), 2),
              name: 'TVL',
            },
          }}
        />
      </div>
    </Card>
  );
};

export default ProportionSales;
