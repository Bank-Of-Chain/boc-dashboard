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
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    render: (text) => (
      <div className={styles.tableCell}>
        <Image
          width={30}
          preview={false}
          src={`./images/${text}.webp`}
          placeholder={text}
          alt={text}
          fallback={'./images/default.webp'}
        />
        <a className={styles.text}>{text}</a>
      </div>
    ),
  },
  {
    title: 'Percent',
    dataIndex: 'percent',
    key: 'percent',
    render: (text) => <span>{toFixed(text, 1e-2, 2)}%</span>,
  },
  {
    title: 'Amount',
    dataIndex: 'amount',
    key: 'amount',
    render: (text) => toFixed(text.toString(), getDecimals(), 2),
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
  const dailyApy = 0,
    weeklyApy = 0,
    yearApy = 0;
  return (
    <Card
      loading={loading}
      bordered={false}
      title="Group"
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
                <Tooltip title="昨日收益率">
                  <InfoCircleOutlined
                    style={{
                      marginLeft: 8,
                    }}
                  />
                </Tooltip>
              </span>
            }
            gap={8}
            total={'-'}
            status="up"
            // subTotal={`${dailyApy.toFixed(2)}%`}
            subTotal={'-%'}
          />
          <TinyArea xField="x" height={45} forceFit yField="y" smooth data={visitData2} />
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
                <Tooltip title="过去7日平均收益">
                  <InfoCircleOutlined
                    style={{
                      marginLeft: 8,
                    }}
                  />
                </Tooltip>
              </span>
            }
            total={'-'}
            status="up"
            // subTotal={`${weeklyApy.toFixed(2)}%`}
            subTotal={'-%'}
            gap={8}
          />
          <TinyArea xField="x" height={45} forceFit yField="y" smooth data={visitData2} />
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
                <Tooltip title="365天平均收益">
                  <InfoCircleOutlined
                    style={{
                      marginLeft: 8,
                    }}
                  />
                </Tooltip>
              </span>
            }
            total={'-'}
            status="up"
            subTotal={'-%'}
            // subTotal={`${yearApy.toFixed(2)}%`}
            gap={8}
          />
          <TinyArea xField="x" height={45} forceFit yField="y" smooth data={visitData2} />
        </Col>
      </Row>
      <Table
        rowKey={(record) => record.name}
        size="small"
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
  );
};

export default TopSearch;
