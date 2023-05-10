import React, { useMemo } from 'react'
import classNames from 'classnames'

// === Components === //
import { LineEchart } from '@/components/echarts'
import { Card, Tabs, Tooltip, Radio, Select } from 'antd'
import { useDeviceType, DEVICE_TYPE } from '@/components/Container/Container'

const { Option } = Select

const LineChartContent = props => {
  const { loading = false, calDateRange = 7, onCalDateRangeClick = () => {}, apyEchartOpt = {}, tvlEchartOpt = {} } = props
  const deviceType = useDeviceType()

  const chartResponsiveConfig = {
    [DEVICE_TYPE.Desktop]: {},
    [DEVICE_TYPE.Tablet]: {
      cardProps: {
        size: 'small'
      },
      buttonProps: {
        size: 'small',
        style: { fontSize: '0.5rem' }
      }
    },
    [DEVICE_TYPE.Mobile]: {
      cardProps: {
        size: 'small'
      },
      buttonProps: {
        size: 'small',
        style: { fontSize: '0.5rem' }
      }
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
    <div>
      <Radio.Group className="b-1 b-solid b-color-violet-400 border-rd" buttonStyle="solid" value={calDateRange} onChange={onDateChange}>
        <Tooltip title="last 7 days">
          <Radio.Button className="b-l-1 b-solid b-color-violet-400 text-violet-400 bg-transparent !b-rd-0" value={7}>
            WEEK
          </Radio.Button>
        </Tooltip>
        <Tooltip title="last 30 days">
          <Radio.Button className="b-l-1 b-solid b-color-violet-400 text-violet-400 bg-transparent !b-rd-0" value={31}>
            MONTH
          </Radio.Button>
        </Tooltip>
        <Tooltip title="last 365 days">
          <Radio.Button className="b-l-1 b-solid b-color-violet-400 text-violet-400 bg-transparent !b-rd-0" value={365}>
            YEAR
          </Radio.Button>
        </Tooltip>
      </Radio.Group>
    </div>
  )
  if (deviceType === DEVICE_TYPE.Mobile) {
    extra = (
      <Select className="!b-rd-0 text-violet-400" style={{ width: 120 }} value={calDateRange} onChange={onDateChange}>
        <Option value={7}>WEEK</Option>
        <Option value={31}>MONTH</Option>
        <Option value={365}>YEAR</Option>
      </Select>
    )
  }

  const tabItems = useMemo(() => {
    return [
      {
        key: 'apy',
        label: 'APY (%)',
        children: <LineEchart option={apyEchartOpt} className={chartResponsiveConfig.chartWrapperClassName} />
      },
      {
        key: 'totalSupply',
        label: 'Total Supply',
        children: <LineEchart option={tvlEchartOpt} className={chartResponsiveConfig.chartWrapperClassName} />
      }
    ]
  }, [apyEchartOpt, tvlEchartOpt, chartResponsiveConfig])

  return (
    <Card
      className="b-rd-5"
      style={{ background: 'linear-gradient(111.68deg,rgba(87,97,125,0.2) 7.59%,hsla(0,0%,100%,0.078) 102.04%)' }}
      loading={loading}
      bordered={false}
      {...chartResponsiveConfig.cardProps}
    >
      <div>
        <Tabs className={classNames(chartResponsiveConfig.tabClassName)} items={tabItems} tabBarExtraContent={extra}></Tabs>
      </div>
    </Card>
  )
}

export default LineChartContent
