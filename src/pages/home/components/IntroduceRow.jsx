import { InfoCircleOutlined } from '@ant-design/icons';
import { Col, Row, Tooltip } from 'antd';
import numeral from 'numeral';
import ChartCard from '@/components/ChartCard';
import BN from 'bignumber.js';
import { CREDIT_DECEMALS } from '@/constants/usdi';

// === Utils === //
import { toFixed } from '@/utils/number-format';

const topColResponsiveProps = {
  xs: 24,
  sm: 8,
  md: 8,
  lg: 8,
  xl: 8,
};

const IntroduceRow = ({ loading, visitData = {} }) => {
  const { apy30, usdi = {} } = visitData;

  return (
    <Row gutter={[24, 24]}>
      <Col {...topColResponsiveProps}>
        <ChartCard
          bordered={false}
          title="Total USDi Supply"
          loading={loading}
          total={() => usdi ? toFixed(BN(usdi?.rebasingCredits).div(BN(usdi?.rebasingCreditsPerToken).div(BN(10 ** CREDIT_DECEMALS))), BN(10 ** CREDIT_DECEMALS), 2) : 0}
          contentHeight={100}
        />
      </Col>

      <Col {...topColResponsiveProps}>
        <ChartCard
          bordered={false}
          loading={loading}
          title="Holders"
          action={
            <Tooltip title="Number Of USDi Holders">
              <InfoCircleOutlined />
            </Tooltip>
          }
          total={numeral(usdi?.holderCount).format('0,0')}
          contentHeight={70}
        />
      </Col>

      <Col {...topColResponsiveProps}>
        <ChartCard
          bordered={false}
          loading={loading}
          title="APY (last 30 days)"
          action={
            <Tooltip title={`Yield over the past 1 month`}>
              <InfoCircleOutlined />
            </Tooltip>
          }
          total={`${numeral(apy30).format('0,0.00')}%`}
          contentHeight={70}
        />
      </Col>
    </Row>
  );
};

export default IntroduceRow;
