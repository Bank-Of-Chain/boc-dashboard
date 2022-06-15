import React from 'react'
import classNames from 'classnames'
import { Card, Button, Tabs, Tooltip } from 'antd'
import { LineEchart } from '@/components/echarts'
import { useDeviceType, DEVICE_TYPE } from '@/components/Container/Container'
import styles from '../style.less'

const { TabPane } = Tabs

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
      buttonProps: {
        size: 'small',
        style: { fontSize: '0.5rem' }
      },
      chartWrapperClassName: styles.chartDivMobile
    },
    [DEVICE_TYPE.Mobile]: {
      buttonProps: {
        size: 'small',
        style: { fontSize: '0.5rem' }
      },
      chartWrapperClassName: styles.chartDivMobile,
      tabClassName: styles.tabMobile
    }
  }[deviceType]

  return (
    <Card
      loading={loading}
      bordered={false}
      style={{ marginTop: 40 }}
    >
      <div className={styles.vaultKeyCard}>
        <Tabs
          animated
          className={classNames(chartResponsiveConfig.tabClassName)}
          tabBarExtraContent={
            <div className={styles.buttons}>
              <Tooltip title='last 7 days'>
                <Button
                  ghost
                  type={calDateRange === 7 ? 'primary' : ''}
                  onClick={() => onCalDateRangeClick(7)}
                  {...chartResponsiveConfig.buttonProps}
                >
                  WEEK
                </Button>
              </Tooltip>
              <Tooltip title='last 30 days'>
                <Button
                  ghost
                  type={calDateRange === 31 ? 'primary' : ''}
                  onClick={() => onCalDateRangeClick(31)}
                  {...chartResponsiveConfig.buttonProps}
                >
                  MONTH
                </Button>
              </Tooltip>
              <Tooltip title='last 365 days'>
                <Button
                  ghost
                  type={calDateRange === 365 ? 'primary' : ''}
                  onClick={() => onCalDateRangeClick(365)}
                  {...chartResponsiveConfig.buttonProps}
                >
                  YEAR
                </Button>
              </Tooltip>
            </div>
          }
        >
          <TabPane tab="APY (%)" key="apy">
            <div className={chartResponsiveConfig.chartWrapperClassName}>
              <LineEchart option={apyEchartOpt} style={{height: '100%', width: '100%'}}/>
            </div>
          </TabPane>
          <TabPane tab={isUsdi ? 'Total USDi Supply' : 'Total ETHi Supply'} key='totalSupply'>
            <div className={chartResponsiveConfig.chartWrapperClassName}>
              <LineEchart option={tvlEchartOpt} style={{ height: '100%', width: '100%' }} />
            </div>
          </TabPane>
        </Tabs>
      </div>
    </Card>
  )
}
