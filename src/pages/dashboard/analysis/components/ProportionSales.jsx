import { Card } from 'antd';
import { Donut } from '@ant-design/charts';
import React from 'react';
import { useModel } from 'umi';

// === Utils === //
import { sumBy, mapValues, groupBy, values } from 'lodash';
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
  const groupData = groupBy(strategies, 'protocol.id');
  const tableData = values(
    mapValues(groupData, (o, key) => {
      const amount = sumBy(o, (o) => Number(o.debt));
      return { name: STRATEGIES_MAP[initialState.chain][key], amount };
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
            visible: false,
          }}
          label={{
            visible: true,
            type: 'outer-center',
            offset: 20,
            formatter: (text, item) => {
              return `${item._origin.name}: ${toFixed(
                BN(item._origin.amount).toString(),
                getDecimals(),
                2,
              )}`;
            },
          }}
          statistic={{
            totalLabel: 'TVL',
          }}
        />
      </div>
    </Card>
  );
};

export default ProportionSales;
