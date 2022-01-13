import { InfoCircleOutlined } from '@ant-design/icons'
import { TinyArea, TinyColumn, Progress } from '@ant-design/charts'
import { Col, Row, Tooltip } from 'antd'
import numeral from 'numeral'
import { ChartCard, Field } from './Charts'
import Trend from './Trend'
import Dollar from '../utils/Dollar'
import styles from '../style.less'
const topColResponsiveProps = {
  xs: 24,
  sm: 8,
  md: 8,
  lg: 8,
  xl: 8,
}

const IntroduceRow = ({ loading, visitData }) => (
  <Row gutter={24}>
    <Col {...topColResponsiveProps}>
      <ChartCard
        bordered={false}
        title='TVL'
        action={
          <Tooltip title='总锁仓量'>
            <InfoCircleOutlined />
          </Tooltip>
        }
        loading={loading}
        total={() => <Dollar>{visitData?.tvl?.amount}</Dollar>}
        footer={<Field label='日销售额' value={`￥${numeral(123123123).format('0,0')}`} />}
        contentHeight={46}
      >
        <Trend
          flag='up'
          style={{
            marginRight: 16,
          }}
        >
          周同比
          <span className={styles.trendText}>12%</span>
        </Trend>
        <Trend flag='down'>
          日同比
          <span className={styles.trendText}>11%</span>
        </Trend>
      </ChartCard>
    </Col>

    <Col {...topColResponsiveProps}>
      <ChartCard
        bordered={false}
        loading={loading}
        title='Holders'
        action={
          <Tooltip title='指标说明'>
            <InfoCircleOutlined />
          </Tooltip>
        }
        total={numeral(visitData?.holders?.length).format('0,0')}
        footer={<Field label='当日新增' value={numeral(1234).format('0,0')} />}
        contentHeight={46}
      >
        <TinyArea
          color='#975FE4'
          xField='x'
          height={46}
          forceFit
          yField='y'
          smooth
          data={visitData}
        />
      </ChartCard>
    </Col>
    <Col {...topColResponsiveProps}>
      <ChartCard
        bordered={false}
        loading={loading}
        title='Share Price'
        action={
          <Tooltip title='指标说明'>
            <InfoCircleOutlined />
          </Tooltip>
        }
        total={numeral(visitData?.pricePerShare?.amount).format('0,0')}
        footer={<Field label='转化率' value='60%' />}
        contentHeight={46}
      >
        <TinyColumn xField='x' height={46} forceFit yField='y' data={visitData} />
      </ChartCard>
    </Col>
  </Row>
)
export default IntroduceRow
