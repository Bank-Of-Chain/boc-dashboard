import { InfoCircleOutlined } from '@ant-design/icons';
import { Col, Row, Tooltip } from 'antd';
import numeral from 'numeral';
import { ChartCard } from './Charts';

// === Utils === //
import { toFixed } from './../../../../helper/number-format';
import { getDecimals } from './../../../../apollo/client';

const topColResponsiveProps = {
  xs: 24,
  sm: 8,
  md: 8,
  lg: 8,
  xl: 8,
};

const calVaultAPY = (vaultDailyData) => {
  let beginPricePerShare = 1;
  let beginTime=0;
  for(let i=0;i<vaultDailyData.length;i++){
    if(vaultDailyData[i].pricePerShare){
      beginPricePerShare = Number(vaultDailyData[i].pricePerShare);
      beginTime=  Number(vaultDailyData[i].id);
      break;
    }
  }
  let endPricePerShare = 1;
  let endTime=0;
  for(let i=vaultDailyData.length-1;i>0;i--){
    if(vaultDailyData[i].pricePerShare){
      endPricePerShare = Number(vaultDailyData[i].pricePerShare);
      endTime=  Number(vaultDailyData[i].id);
      break;
    }
  }
  return Math.pow(1 + Number(endPricePerShare - beginPricePerShare) / Number(beginPricePerShare),365 * 24 * 60 * 60 / (endTime-beginTime)) - 1;
}

const IntroduceRow = ({ loading, visitData = {} }) => {
  const { vaultDailyData = [], vaultDetail = {} } = visitData;
  return (
    <Row gutter={24}>
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

    </Row>
  );
};
export default IntroduceRow;
