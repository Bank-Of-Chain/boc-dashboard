import {Donut} from '@ant-design/charts';
import {Empty} from 'antd';
import React from 'react';
import {useModel} from 'umi';

// === Utils === //
import {reduce, mapValues, groupBy, values, filter, isEmpty} from 'lodash';
import {toFixed} from './../../../../helper/number-format';
import {getDecimals} from './../../../../apollo/client';
import BN from 'bignumber.js';

// === Constants === //
import STRATEGIES_MAP from './../../../../constants/strategies';

const ProportionSales = ({loading, visitData = {}}) => {
  const {strategies = [], tvl} = visitData;
  const {initialState} = useModel('@@initialState');
  if (!initialState.chain) return null;

  const total = reduce(
    strategies,
    (rs, o) => {
      return rs.plus(o.debt);
    },
    BN(0),
    );
  const vaultPoolValue = BN(tvl).minus(total)
  const groupData = groupBy(filter(strategies, i => i.debt > 0), 'protocol.id');
  if(isEmpty(groupData)) return <Empty />
  const tableData = [...values(
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
  ), {
    name:'Vault',
    amount: toFixed(vaultPoolValue, getDecimals(), 2)
  }];
  return (
    <div>
      <Donut
        forceFit
        height={340}
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.1)'
        }}
        radius={1}
        innerRadius={0.75}
        angleField="amount"
        colorField="name"
        data={tableData}
        legend={{
          visible: true,
          text:{
            style:{
              fill: '#fff'
            },
          }
        }}
        label={{
          visible: false,
          type: 'spider',
          offset: 20,
          formatter: (text, item) => {
            return `${item._origin.name}: ${item._origin.amount}`;
          }
        }}
        tooltip={{
          formatter: (data) =>{
            console.log('----------',data);
            // `${(v.percent * 100).toFixed(0)}%`
          },
        }}
        interactions={[{type: 'element-selected'}, {type: 'element-active'}]}
        statistic={{
          visible: true,
          content: {
            value: toFixed(tvl, getDecimals(), 2),
            name: 'TVL',
          },
        }}
      />
    </div>
  );
};

export default ProportionSales;
