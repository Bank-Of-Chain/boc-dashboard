import { InfoCircleOutlined } from '@ant-design/icons';
import { TinyColumn } from '@ant-design/charts';
import { Col, Row, Tooltip } from 'antd';
import numeral from 'numeral';
import { ChartCard, Field } from './Charts';
import Trend from './Trend';
import Dollar from '../utils/Dollar';
import styles from '../style.less';

// === Utils === //
import { map, get } from 'lodash';
import moment from 'moment';
import { toFixed } from './../../../../helper/number-format';
import { getDecimals } from './../../../../apollo/client';

const topColResponsiveProps = {
  xs: 24,
  sm: 12,
  md: 12,
  lg: 12,
  xl: 12,
};

const IntroduceRow = ({ loading, visitData = {} }) => {
  const { vaultDailyData = [], vaultDetail = {} } = visitData;
  // // 一周前的锁仓量
  // const weekTvl = get(vaultDailyData, `[${vaultDailyData.length - 7}].tvl`, 1)
  // // 一天前的锁仓量
  // const dailyTvl = get(vaultDailyData, `[${vaultDailyData.length - 2}].tvl`, 1)
  // const weekPercent = 100 - (100 * vaultDetail?.tvl) / weekTvl
  // const dailyPercent = 100 - (100 * vaultDetail?.tvl) / dailyTvl
  const weekPercent = 0,
    dailyPercent = 0;
  return (
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
          total={() => toFixed(vaultDetail?.tvl, getDecimals(), 2)}
          contentHeight={100}
        >
          <Trend
            flag={weekPercent > 0 ? 'up' : 'down'}
            style={{
              marginRight: 16,
            }}
          >
            周同比
            <span className={styles.trendText}>{`${Math.abs(weekPercent).toFixed(2)}%`}</span>
          </Trend>
          <Trend flag={dailyPercent > 0 ? 'up' : 'down'}>
            日同比
            <span className={styles.trendText}>{`${Math.abs(dailyPercent).toFixed(2)}%`}</span>
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
          contentHeight={70}
        >
          <TinyColumn
            xField="x"
            height={70}
            forceFit
            yField="y"
            data={map(vaultDailyData, (i) => {
              return { x: moment(1000 * i.id).format('yyyy-MM-DD'), y: 1 * i.holderCount };
            })}
          />
        </ChartCard>
      </Col>
    </Row>
  );
};
export default IntroduceRow;
