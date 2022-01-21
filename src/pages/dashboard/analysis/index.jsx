import {Suspense, useEffect, useState} from 'react';
import {Col, Row, Card, Button, Tabs} from 'antd';
import {Line} from '@ant-design/charts';
import {GridContent} from '@ant-design/pro-layout';
import IntroduceRow from './components/IntroduceRow';
import StrategyTable from './components/StrategyTable';
import TransationsTable from './components/TransationsTable';
import TopSearch from './components/TopSearch';
import ProportionSales from './components/ProportionSales';
import {useModel} from 'umi';
import minBy from 'lodash/minBy';
import maxBy from 'lodash/maxBy';

// === Services === //
import {
  getVaultDailyData,
  getVaultHourlyData,
  getTransations,
} from './../../../services/dashboard-service';

// === Utils === //
import numeral from 'numeral';
import {map, isEmpty} from 'lodash';
import {getDecimals, setClient} from './../../../apollo/client';
import {arrayAppendOfDay, arrayAppendOfHour, usedPreValue} from './../../../helper/array-append';

// === Styles === //
import styles from './style.less';
import moment from 'moment';
import {toFixed} from '@/helper/number-format';

import {LineEchart} from "@/components/echarts";
import lineOnly from "@/components/echarts/options/line/lineOnly";
import lineSimple from "@/components/echarts/options/line/lineSimple";

const {TabPane} = Tabs;
const buttons = ['1W', '1M', '1Y'];
const calls = [
  () => getVaultDailyData(7).then((array) => arrayAppendOfDay(array, 7)),
  () => getVaultDailyData(30).then((array) => arrayAppendOfDay(array, 30)),
  () => getVaultDailyData(365).then((array) => arrayAppendOfDay(array, 356)),
];

const getLineEchartOpt = (data, seriesName) => {
  const xAxisData = [];
  const seriesData = [];
  data.forEach((o) => {
    xAxisData.push(moment(Number(o.date)).format('MM-DD HH:mm'));
    seriesData.push(o.value);
  });
  const option = lineSimple(
    {
      xAxisData,
      seriesName: seriesName,
      seriesData
    }
  );
  option.yAxis.splitLine = {
    lineStyle: {
      color: 'black'
    }
  };
  option.yAxis.min = minBy(data, function (o) {
    return o.value;
  }).value;
  option.yAxis.max = maxBy(data, function (o) {
    return o.value;
  }).value;
  console.log('-----data------',JSON.stringify(data));
  console.log('-----max------',option.yAxis.max);
  return option;
};

const Analysis = (props) => {
  const [calDateRange, setCalDateRange] = useState(0);
  const [tvlEchartOpt, setTvlEchartOpt] = useState({});
  const [sharePriceEchartOpt, setSharePriceEchartOpt] = useState({});
  const [transations, setTransations] = useState([]);

  const {initialState} = useModel('@@initialState');

  const {dataSource, reload, loading} = useModel('useDashboardData');

  const vaultAddress = dataSource?.vaultDetail?.id;

  useEffect(() => {
    reload();
  }, [initialState.chain]);

  useEffect(() => {
    calls[calDateRange]()
      .then((array) =>
        map(array, (item) => {
          return {
            id: item.id,
            date: 1000 * item.id,
            value: Number(toFixed(item.tvl, getDecimals(), 2)),
          };
        }),
      )
      .then(a => usedPreValue(a, 'value', 0))
      .then(array => {
        setTvlEchartOpt(getLineEchartOpt(array, "USDT"));
      });
  }, [calDateRange]);

  useEffect(() => {
    if (isEmpty(vaultAddress)) return;
    getTransations(vaultAddress).then(setTransations);
  }, [vaultAddress]);

  useEffect(() => {
    calls[calDateRange]()
      .then((array) =>
        map(array, (item) => {
          return {
            id: item.id,
            date: 1000 * item.id,
            value: Number(toFixed(item.pricePerShare, getDecimals(), 6)),
          };
        }),
      )
      .then(a => usedPreValue(a, 'value', 1))
      .then(array => {
        setSharePriceEchartOpt(getLineEchartOpt(array, "USDT Per Share"));
      });
  }, [calDateRange]);

  if (isEmpty(initialState.chain)) return null

  return (
    <GridContent>
      <Suspense fallback={null}>
        <Card loading={loading} bordered={false} bodyStyle={{padding: 0}}>
          <div className={styles.vaultKeyCard}>
            <Tabs
              tabBarExtraContent={
                <div>{
                  map(buttons, (b, i) => (
                    <Button
                      key={b}
                      ghost
                      style={{marginLeft: 10}}
                      type={calDateRange === i ? 'primary' : ''}
                      onClick={() => setCalDateRange(i)}
                    >
                      {b}
                    </Button>
                  ))
                }
                </div>
              }
              size="large"
            >
              <TabPane tab="Share Price" key="sharePrice">
                <div className={styles.chartDiv}>
                  <LineEchart option={sharePriceEchartOpt} style={{height: '100%', width: '100%'}}/>
                </div>
              </TabPane>
              <TabPane tab="TVL" key="tvl">
                <div className={styles.chartDiv}>
                  <LineEchart option={tvlEchartOpt} style={{height: '100%', width: '100%'}}/>
                </div>
              </TabPane>
            </Tabs>
          </div>
        </Card>
      </Suspense>
      <Suspense fallback={null}>
        <IntroduceRow loading={loading} visitData={dataSource}/>
      </Suspense>
      <Row
        gutter={24}
        style={{
          marginTop: 24,
        }}
      >
        <Col xl={12} lg={24} md={24} sm={24} xs={24}>
          <Suspense fallback={null}>
            <ProportionSales loading={loading} visitData={dataSource?.vaultDetail}/>
          </Suspense>
        </Col>
        <Col xl={12} lg={24} md={24} sm={24} xs={24}>
          <Suspense fallback={null}>
            <TopSearch loading={loading} visitData={dataSource?.vaultDetail}/>
          </Suspense>
        </Col>
      </Row>
      <Suspense fallback={null}>
        <StrategyTable loading={loading} searchData={dataSource?.vaultDetail?.strategies || []}/>
      </Suspense>
      <Suspense fallback={null}>
        <TransationsTable loading={loading} visitData={transations}/>
      </Suspense>
    </GridContent>
  );
};

export default Analysis;
