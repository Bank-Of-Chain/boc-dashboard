import React, { Suspense } from 'react'
import { Col, Row, Card } from 'antd'
import { useDeviceType, DEVICE_TYPE } from '@/components/Container/Container'
import TopSearch from './TopSearch'
import ProportionSales from './ProportionSales'

import styles from '../style.less'

export default function ProtocolAllocation({
  loading = false,
  tokenDecimals,
  strategyMap = {},
  vault = {},
  unit = 'USD'
}) {
  const deviceType = useDeviceType()

  const protocolResponsiveConfig = {
    [DEVICE_TYPE.Desktop]: {},
    [DEVICE_TYPE.Tablet]: {
      cardProps: {
        size: 'small'
      }
    },
    [DEVICE_TYPE.Mobile]: {
      cardProps: {
        size: 'small'
      }
    }
  }[deviceType]

  return (
    <Card
      loading={loading}
      className={styles.salesCard}
      bordered={false}
      title='Vault Protocol Allocations'
      style={{
        height: '100%',
        marginTop: 24,
      }}
      {...protocolResponsiveConfig.cardProps}
    >
      <Row
        gutter={24}
        style={{
          marginTop: 24,
        }}
      >
        <Col xl={12} lg={24} md={24} sm={24} xs={24}>
          <Suspense fallback={null}>
            <ProportionSales
              loading={loading}
              strategyMap={strategyMap}
              tokenDecimals={tokenDecimals}
              visitData={vault || {}}
              unit={unit}
            />
          </Suspense>
        </Col>
        <Col xl={12} lg={24} md={24} sm={24} xs={24}>
          <Suspense fallback={null}>
            <TopSearch
              loading={loading}
              strategyMap={strategyMap}
              tokenDecimals={tokenDecimals}
              visitData={vault || {}}
              unit={unit}
            />
          </Suspense>
        </Col>
      </Row>
    </Card>
  )
}
