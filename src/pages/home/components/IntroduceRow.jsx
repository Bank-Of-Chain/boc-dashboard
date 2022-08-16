import React from 'react'

// === Component === //
import { Col, Row, Tooltip } from 'antd'
import ChartCard from '@/components/ChartCard'
import { InfoCircleOutlined } from '@ant-design/icons'

// === Utils === //
import { map } from 'lodash'
import { isMobile } from '@/utils/device'

// === Styles === //
import styles from '../style.less'

const topColResponsiveProps = {
  xs: 24,
  sm: 24,
  md: 24,
  lg: 8,
  xl: 8
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
      {map(data, ({ title, tip, loading, content, unit, subTitle }) => {
        let footer = <Field style={{ height: '1rem' }} value={subTitle} />
        if (!subTitle && isMobile()) {
          footer = null
        }

        return (
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
              footer={footer}
            />
          </Col>
        )
      })}
    </Row>
  )
}

export default IntroduceRow
