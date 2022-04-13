import {InfoCircleOutlined} from '@ant-design/icons';
import {Col, Row, Tooltip} from 'antd';
import numeral from 'numeral';
import ChartCard from '@/components/ChartCard';
import {useModel} from 'umi';

// === Utils === //
import {toFixed} from '@/utils/number-format';
import {getDecimals} from '@/apollo/client';
import {calVaultAPY} from "@/utils/apy";

const topColResponsiveProps = {
  xs: 24,
  sm: 8,
  md: 8,
  lg: 8,
  xl: 8,
};

const IntroduceRow = ({loading, visitData = {}}) => {
  const {vaultDailyData = [], vaultDetail = {}} = visitData;
  // const last7DaysTime = vaultDailyData.length > 0 ? Number(vaultDailyData[vaultDailyData.length - 1].id) - 7 * 24 * 3600 : 0;
  // const vaultWeeklyData = vaultDailyData.filter(x => x.id >= last7DaysTime);
  return (
    <Row gutter={[24, 24]}>
      <Col {...topColResponsiveProps}>
        <ChartCard
          bordered={false}
          title="Total Supply (USDi)"
          action={
            <Tooltip title="USDi Total Supply">
              <InfoCircleOutlined/>
            </Tooltip>
          }
          loading={loading}
          total={() => toFixed(vaultDetail?.tvl, getDecimals(), 2)}
          contentHeight={100}
         />
      </Col>

      <Col {...topColResponsiveProps}>
        <ChartCard
          bordered={false}
          loading={loading}
          title="Depositors"
          action={
            <Tooltip title="Number Of Holders">
              <InfoCircleOutlined/>
            </Tooltip>
          }
          total={numeral(visitData?.vaultDetail?.holderCount).format('0,0')}
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
          total={() => numeral(calVaultAPY(vaultDailyData)* 100).format('0,0.00') +'%'}
          contentHeight={70}
         />
      </Col>
    </Row>
  );
};
export default IntroduceRow;
