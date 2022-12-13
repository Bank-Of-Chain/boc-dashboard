import React, { Suspense } from 'react'

// === Components === //
import { Col, Row, Card } from 'antd'
import TopSearch from './TopSearch'
import ProportionSales from './ProportionSales'
import { useDeviceType, DEVICE_TYPE } from '@/components/Container/Container'

// === Constants === //
import { TOKEN_DISPLAY_DECIMALS } from '@/constants/vault'

// === Styles === //
import styles from '../style.less'

export default function ProtocolAllocation({
  loading = false,
  tokenDecimals,
  strategyMap = {},
  vaultData = {},
  unit = 'USD',
  displayDecimals = TOKEN_DISPLAY_DECIMALS
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
    <Card loading={loading} className={styles.salesCard} bordered={false} {...protocolResponsiveConfig.cardProps}>
      <div className={styles.title}>Vault Protocol Allocations</div>
      <Row gutter={[12, 12]}>
        <Col xl={12} lg={24} md={24} sm={24} xs={24}>
          <Suspense fallback={null}>
            <ProportionSales
              loading={loading}
              strategyMap={strategyMap}
              tokenDecimals={tokenDecimals}
              displayDecimals={displayDecimals}
              visitData={vaultData || {}}
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
              displayDecimals={displayDecimals}
              visitData={vaultData || {}}
              unit={unit}
            />
          </Suspense>
        </Col>
      </Row>
    </Card>
  )
}
