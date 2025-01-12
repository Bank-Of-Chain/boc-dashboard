import React from 'react'
import classNames from 'classnames'

// === Components === //
import { LineEchart } from '@/components/echarts'
import { Card, Tabs, Tooltip, Radio, Select } from 'antd'
import { useDeviceType, DEVICE_TYPE } from '@/components/Container/Container'

// === Styles === //
import styles from '../style.less'

const { TabPane } = Tabs
const { Option } = Select

export default function LineChartContent({
  isUsdi,
  loading = false,
  calDateRange = 7,
  onCalDateRangeClick = () => {},
  apyEchartOpt = {},
  tvlEchartOpt = {}
}) {
  const deviceType = useDeviceType()

  const chartResponsiveConfig = {
    [DEVICE_TYPE.Desktop]: {
      chartWrapperClassName: styles.chartDiv
    },
    [DEVICE_TYPE.Tablet]: {
      cardProps: {
        size: 'small'
      },
      buttonProps: {
        size: 'small',
        style: { fontSize: '0.5rem' }
      },
      chartWrapperClassName: styles.chartDivMobile
    },
    [DEVICE_TYPE.Mobile]: {
      cardProps: {
        size: 'small'
      },
      buttonProps: {
        size: 'small',
        style: { fontSize: '0.5rem' }
      },
      chartWrapperClassName: styles.chartDivMobile,
      tabClassName: styles.tabMobile
    }
  }[deviceType]

  const onDateChange = e => {
    if (typeof e === 'number') {
      onCalDateRangeClick(e)
    } else {
      onCalDateRangeClick(e.target.value)
    }
  }

  let extra = (
    <div className={styles.buttons}>
      <Radio.Group buttonStyle="solid" value={calDateRange} onChange={onDateChange}>
        <Tooltip title="last 7 days">
          <Radio.Button value={7}>WEEK</Radio.Button>
        </Tooltip>
        <Tooltip title="last 30 days">
          <Radio.Button value={31}>MONTH</Radio.Button>
        </Tooltip>
        <Tooltip title="last 365 days">
          <Radio.Button value={365}>YEAR</Radio.Button>
        </Tooltip>
      </Radio.Group>
    </div>
  )
  if (deviceType === DEVICE_TYPE.Mobile) {
    extra = (
      <Select style={{ width: 120 }} value={calDateRange} onChange={onDateChange}>
        <Option value={7}>WEEK</Option>
        <Option value={31}>MONTH</Option>
        <Option value={365}>YEAR</Option>
      </Select>
    )
  }

  return (
    <Card loading={loading} bordered={false} {...chartResponsiveConfig.cardProps}>
      <div className={styles.vaultKeyCard}>
        <Tabs className={classNames(chartResponsiveConfig.tabClassName)} tabBarExtraContent={extra}>
          <TabPane tab="APY (%)" key="apy">
            <LineEchart option={apyEchartOpt} className={chartResponsiveConfig.chartWrapperClassName} />
          </TabPane>
          <TabPane tab={isUsdi ? 'Total Supply' : 'Total Supply'} key="totalSupply">
            <LineEchart option={tvlEchartOpt} className={chartResponsiveConfig.chartWrapperClassName} />
          </TabPane>
        </Tabs>
      </div>
    </Card>
  )
}
