import React from 'react'
import { Card } from 'antd'
import { findIndex, reverse } from 'lodash'
import { LineEchart } from '@/components/echarts'
import { useDeviceType, DEVICE_TYPE } from '@/components/Container/Container'
import getLineEchartOpt from '@/components/echarts/options/line/getLineEchartOpt'

export default function DailyChart({ title, data, loading, token = 'USDi' }) {
  const deviceType = useDeviceType()
  const { tvls = [] } = data

  // 参考 https://github.com/PiggyFinance/dashboard/issues/166
  const reverseArray = reverse([...tvls])
  const continuousIndex = findIndex(reverseArray, (item, index) => {
    if (index <= 2) return false
    if (index === reverseArray.length) return true
    return Math.abs(item.balance - reverseArray[index - 1].balance) > item.balance * 0.005
  })
  const startPercent = continuousIndex === -1 ? 0 : 100.5 - (100 * continuousIndex) / tvls.length
  const option1 = getLineEchartOpt(tvls, 'balance', token, {
    format: 'MM-DD',
    dataZoom: [
      {
        start: startPercent,
        end: 100
      }
    ],
    xAxis: {
      axisTick: {
        alignWithLabel: true
      }
    }
  })

  const responsiveConfig = {
    [DEVICE_TYPE.Desktop]: {
      cardProps: {
        style: {
          height: '452px'
        }
      }
    },
    [DEVICE_TYPE.Tablet]: {
      cardProps: {
        size: 'small',
        style: {
          height: '402px'
        }
      }
    },
    [DEVICE_TYPE.Mobile]: {
      cardProps: {
        size: 'small',
        style: {
          height: '302px'
        }
      }
    }
  }[deviceType]

  return (
    <Card
      loading={loading}
      bordered={false}
      size={responsiveConfig.cardProps.size}
      bodyStyle={responsiveConfig.cardProps.style}
      style={{ marginTop: 24 }}
      title={title}
    >
      <LineEchart option={option1} style={{ height: '100%' }} />
    </Card>
  )
}
