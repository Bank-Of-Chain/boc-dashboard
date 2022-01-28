import { InfoCircleOutlined } from '@ant-design/icons';
import { Col, Row, Tooltip } from 'antd';
import numeral from 'numeral';
import { ChartCard } from './Charts';

// === Utils === //
import { toFixed } from './../../../../helper/number-format';
import { getDecimals } from './../../../../apollo/client';
import {calVaultAPY} from "@/utils/Apy";
import { isEmpty, sumBy } from 'lodash';

const topColResponsiveProps = {
  xs: 24,
  sm: 8,
  md: 8,
  lg: 8,
  xl: 8,
};

const secondRowColResponsiveProps = {
  xs: 24,
  sm: 12,
  md: 12,
  lg: 12,
  xl: 12,
};

const IntroduceRow = ({ loading, visitData = {} }) => {
  const { vaultDailyData = [], vaultDetail = {} } = visitData;
  const earningsPastOneMonth = sumBy(vaultDailyData, o => {
    if (isEmpty(o.totalProfit)) {
      return 0
    }
    return parseInt(o.totalProfit)
  })
  return (
    <Row gutter={[24,24]}>
      <Col {...topColResponsiveProps}>
        <ChartCard
          bordered={false}
          title="TVL (USDT)"
          action={
            <Tooltip title="Total Value Locked">
              <InfoCircleOutlined />
            </Tooltip>
          }
          loading={loading}
          total={() => toFixed(vaultDetail?.tvl, getDecimals(), 2)}
          contentHeight={100}
        >
        </ChartCard>
      </Col>

      <Col {...topColResponsiveProps}>
        <ChartCard
          bordered={false}
          loading={loading}
          title="Depositors"
          action={
            <Tooltip title="Number Of Holders">
              <InfoCircleOutlined />
            </Tooltip>
          }
          total={numeral(visitData?.vaultDetail?.holderCount).format('0,0')}
          contentHeight={70}
        >
        </ChartCard>
      </Col>

      <Col {...topColResponsiveProps}>
        <ChartCard
          bordered={false}
          loading={loading}
          title="APY Past 1M"
          action={
            <Tooltip title="Yield over the past 1 month">
              <InfoCircleOutlined />
            </Tooltip>
          }
          total={() => numeral(calVaultAPY(vaultDailyData)* 100).format('0,0.00') +'%'}
          contentHeight={70}
        >
        </ChartCard>
      </Col>

      <Col {...secondRowColResponsiveProps}>
        <ChartCard
          bordered={false}
          loading={loading}
          title="Earnings Total (USDT)"
          action={
            <Tooltip title="Earnings Total (USDT)">
              <InfoCircleOutlined />
            </Tooltip>
          }
          total={() => toFixed(vaultDetail?.totalProfit, getDecimals(), 2)}
          contentHeight={70}
        >
        </ChartCard>
      </Col>

      <Col {...secondRowColResponsiveProps}>
        <ChartCard
          bordered={false}
          loading={loading}
          title="Earnings(1 Month)"
          action={
            <Tooltip title="Earnings over the past 1 month">
              <InfoCircleOutlined />
            </Tooltip>
          }
          total={() => toFixed(earningsPastOneMonth.toFixed(), getDecimals(), 2)}
          contentHeight={70}
        >
        </ChartCard>
      </Col>

    </Row>
  );
};
export default IntroduceRow;
