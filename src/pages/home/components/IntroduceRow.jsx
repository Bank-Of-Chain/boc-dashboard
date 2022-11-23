import React from 'react'

// === Component === //
import { Col, Row, Tooltip } from 'antd'
import ChartCard from '@/components/ChartCard'
import { InfoCircleOutlined } from '@ant-design/icons'

// === Utils === //
import { map } from 'lodash'

const topColResponsiveProps = {
  xs: 24,
  sm: 24,
  md: 24,
  lg: 8,
  xl: 8
}

const IntroduceRow = ({ data = [] }) => {
  return (
    <Row gutter={[30, 30]}>
      {map(data, ({ title, tip, loading, content, unit, footer }) => {
        return (
          <Col key={title} {...topColResponsiveProps}>
            <ChartCard
              bordered={false}
              title={title}
              action={
                <Tooltip title={tip}>
                  <InfoCircleOutlined style={{ fontSize: 16 }} />
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
