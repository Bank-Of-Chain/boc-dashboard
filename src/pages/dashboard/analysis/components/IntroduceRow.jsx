import {InfoCircleOutlined} from '@ant-design/icons';
import {Col, Row, Tooltip} from 'antd';
import numeral from 'numeral';
import {ChartCard} from './Charts';
import {useModel} from 'umi';

// === Utils === //
import {toFixed} from './../../../../helper/number-format';
import {getDecimals} from './../../../../apollo/client';
import {calVaultAPY} from "@/utils/Apy";

const topColResponsiveProps = {
  xs: 24,
  sm: 8,
  md: 8,
  lg: 8,
  xl: 8,
};

const IntroduceRow = ({loading, visitData = {}}) => {
  const {vaultDailyData = [], vaultDetail = {}} = visitData;
  const {initialState} = useModel('@@initialState');
  // const last7DaysTime = vaultDailyData.length > 0 ? Number(vaultDailyData[vaultDailyData.length - 1].id) - 7 * 24 * 3600 : 0;
  // const vaultWeeklyData = vaultDailyData.filter(x => x.id >= last7DaysTime);
  return (
    <Row gutter={[24, 24]}>
      <Col {...topColResponsiveProps}>
        <ChartCard
          bordered={false}
          title="TVL (USDT)"
          action={
            <Tooltip title="Total Value Locked">
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
            <Tooltip title={`Yield over the past 1 month ${initialState.chain === '1' ? '(From Feb. 8)' : ''}`}>
              <InfoCircleOutlined />
            </Tooltip>
          }
          total={() => numeral(calVaultAPY(vaultDailyData,30)* 100).format('0,0.00') +'%'}
          contentHeight={70}
         />
      </Col>

    </Row>
  );
};
export default IntroduceRow;
