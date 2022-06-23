// === Component === //
import { InfoCircleOutlined } from '@ant-design/icons'
import { Col, Row, Tooltip } from 'antd'
import ChartCard from '@/components/ChartCard'

// === Utils === //
import { isEmpty, map } from 'lodash'

// === Styles === //
import styles from '../style.less'

const topColResponsiveProps = {
  xs: 24,
  sm: 8,
  md: 8,
  lg: 8,
  xl: 8,
}

const Field = ({ label, value, ...rest }) => (
  <div className={styles.field} {...rest}>
    <span className={styles.label}>{label}</span>
    <span className={styles.number}>{value}</span>
  </div>
)

const IntroduceRow = ({ data = [] }) => {
  return (
    <Row gutter={[24, 24]}>
      {map(data, ({ title, tip, loading, content, unit, subTitle }) => (
        <Col key={title} {...topColResponsiveProps}>
          <ChartCard
            bordered={false}
            title={title}
            action={
              <Tooltip title={tip}>
                <InfoCircleOutlined style={{ fontSize: 22 }} />
              </Tooltip>
            }
            loading={loading}
            total={content}
            unit={unit}
            footer={<Field style={{ height: '1rem' }} value={subTitle} />}
          />
        </Col>
      ))}
    </Row>
  )
}

export default IntroduceRow
