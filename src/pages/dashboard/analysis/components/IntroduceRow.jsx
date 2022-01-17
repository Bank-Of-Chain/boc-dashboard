import { InfoCircleOutlined } from '@ant-design/icons';
import { TinyArea, TinyColumn, Progress } from '@ant-design/charts';
import { Col, Row, Tooltip } from 'antd';
import numeral from 'numeral';
import { ChartCard, Field } from './Charts';
import Trend from './Trend';
import Dollar from '../utils/Dollar';
import styles from '../style.less';
const topColResponsiveProps = {
  xs: 24,
  sm: 12,
  md: 12,
  lg: 12,
  xl: 12,
};

const visitData2 = [
  {
    x: '2022-01-13',
    y: 1,
  },
  {
    x: '2022-01-14',
    y: 6,
  },
  {
    x: '2022-01-15',
    y: 4,
  },
  {
    x: '2022-01-16',
    y: 8,
  },
  {
    x: '2022-01-17',
    y: 3,
  },
  {
    x: '2022-01-18',
    y: 7,
  },
  {
    x: '2022-01-19',
    y: 2,
  },
];

const IntroduceRow = ({ loading, visitData }) => (
  <Row gutter={24}>
    <Col {...topColResponsiveProps}>
      <ChartCard
        bordered={false}
        title="TVL"
        action={
          <Tooltip title="总锁仓量">
            <InfoCircleOutlined />
          </Tooltip>
        }
        loading={loading}
        total={() => (
          <Dollar>{visitData?.vaultDetail?.tvl * visitData?.vaultDetail?.usdtPrice}</Dollar>
        )}
        contentHeight={100}
      >
        <Trend
          flag="up"
          style={{
            marginRight: 16,
          }}
        >
          周同比
          <span className={styles.trendText}>12%</span>
        </Trend>
        <Trend flag="down">
          日同比
          <span className={styles.trendText}>11%</span>
        </Trend>
      </ChartCard>
    </Col>

    <Col {...topColResponsiveProps}>
      <ChartCard
        bordered={false}
        loading={loading}
        title="Holders"
        action={
          <Tooltip title="持仓人数">
            <InfoCircleOutlined />
          </Tooltip>
        }
        total={numeral(visitData?.vaultDetail?.holderCount).format('0,0')}
        footer={
          <Field
            label="当日新增"
            value={numeral(visitData?.vaultTodayData?.newHolderCount).format('0,0')}
          />
        }
        contentHeight={100}
      >
        <TinyColumn xField="x" height={100} forceFit yField="y" data={visitData2} />
      </ChartCard>
    </Col>
  </Row>
);
export default IntroduceRow;
