import { Suspense, useEffect } from 'react';
import { Col, Row, Card, Image, Descriptions } from 'antd';
import { GridContent } from '@ant-design/pro-layout';
import ReportTable from './components/ReportTable';
import { Line } from '@ant-design/charts';
import { history, useModel } from 'umi';
import { LeftOutlined } from '@ant-design/icons';

// === Constants === //
import STRATEGIES_MAP from './../../../constants/strategies';

// === Components === //
import CoinSuperPosition from './components/CoinSuperPosition/index';

// === Utils === //
import { toFixed } from './../../../helper/number-format';
import { getDecimals } from './../../../apollo/client';

// === Services === //
import { getStrategyById } from './../../../services/dashboard-service';
import { getStrategyApysInChain, getStrategyApysOffChain } from './../../../services/api-service';

// === Styles === //
import styles from './style.less';
import { isEmpty, map } from 'lodash';
import { useState } from 'react';
import moment from 'moment';

const Strategy = (props) => {
  const { id } = props?.match?.params;
  const loading = false;
  const [strategy, setStrategy] = useState({});
  const [apys, setApys] = useState([]);
  const [offChainApys, setOffChainApys] = useState([]);
  const { initialState } = useModel('@@initialState');
  useEffect(() => {
    getStrategyById(id).then(setStrategy);
    getStrategyApysInChain(id, 0, 100)
      .then((rs) =>
        map(rs.content, (i) => {
          return {
            value: i.apy,
            date: i.apyValidateTime,
          };
        }),
      )
      .then(setApys);
    getStrategyApysOffChain(id, 0, 100)
      .then((rs) =>
        map(rs.content, (i) => {
          return {
            value: i.apy,
            date: i.apyValidateTime,
          };
        }),
      )
      .then(setOffChainApys);
  }, [id]);
  if (!initialState.chain || isEmpty(strategy)) return null;
  const { underlyingTokens, depositedAssets } = strategy;
  return (
    <GridContent>
      <Suspense fallback={null}>
        <Card title={<LeftOutlined onClick={() => history.push('/')} />} bordered={false}>
          <Row justify="space-around">
            <Col xl={8} lg={8} md={8} sm={8} xs={8}>
              <Image
                preview={false}
                width={300}
                src={`/images/${STRATEGIES_MAP[initialState.chain][strategy?.protocol.id]}.webp`}
                fallback={'/images/default.webp'}
              />
            </Col>
            <Col xl={10} lg={10} md={10} sm={10} xs={10}>
              <Descriptions
                column={1}
                title="Base Info"
                style={{
                  marginBottom: 32,
                }}
              >
                <Descriptions.Item label="name">
                  <a>{strategy.name}</a>
                </Descriptions.Item>
                <Descriptions.Item label="Underlying Token">
                  <CoinSuperPosition array={map(underlyingTokens, 'token.id')} />
                </Descriptions.Item>
                <Descriptions.Item label="Deposited">
                  {toFixed(depositedAssets, getDecimals(), 2)}
                </Descriptions.Item>
                <Descriptions.Item label="Status">Active</Descriptions.Item>
              </Descriptions>
            </Col>
          </Row>
        </Card>
      </Suspense>
      <Suspense fallback={null}>
        <Card
          loading={loading}
          title="Apy"
          className={styles.offlineCard}
          bordered={false}
          style={{
            marginTop: 32,
          }}
        >
          <div
            style={{
              padding: '0 24px',
            }}
          >
            <Line
              forceFit
              responsive
              data={[
                ...map(apys, i => {
                  return {
                    ...i,
                    type: '链内',
                  }
                }),
                ...map(offChainApys, i => {
                  return {
                    ...i,
                    type: '链外',
                  }
                }),
              ]}
              padding="auto"
              xField="date"
              yField="value"
              seriesField="type"
              height={400}
              meta={{
                value: {
                  formatter: (v) => {
                    return `${(100 * v).toFixed(2)}%`
                  },
                }
              }}
              yAxis={{
                label: {
                  formatter: (v) => {
                    return v
                  },
                },
              }}
              // smooth
            />
          </div>
        </Card>
      </Suspense>
      <Suspense fallback={null}>
        <ReportTable loading={loading} visitData={strategy.reports || []} />
      </Suspense>
    </GridContent>
  );
};

export default Strategy;
