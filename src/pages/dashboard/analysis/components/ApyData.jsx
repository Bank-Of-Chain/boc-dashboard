import { Card } from 'antd'
import { Line } from '@ant-design/charts'
import styles from '../style.less'

const ApyData = ({ loading, offlineChartData }) => (
  <Card
    loading={loading}
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
        height={400}
        data={offlineChartData}
        responsive
        xField='date'
        yField='value'
        seriesField='type'
        interactions={[
          {
            type: 'slider',
            cfg: {},
          },
        ]}
        legend={{
          position: 'top-center',
        }}
      />
    </div>
  </Card>
)

export default ApyData
