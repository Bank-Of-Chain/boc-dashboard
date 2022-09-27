import React, { useEffect, useState } from 'react'

import { BarEchart } from '@/components/echarts'
import { useDeviceType, DEVICE_TYPE } from '@/components/Container/Container'

// === Components === //
import { Card, Radio, Select } from 'antd'

// === Services === //
import { getSegmentProfit } from '@/services/profits-service'

// === Utils === //
import { useModel } from 'umi'
import moment from 'moment'
import map from 'lodash/map'
import isEmpty from 'lodash/isEmpty'
import { reverse } from 'lodash'

// === Constants === //
import { SEGMENT_TYPES, DAY, WEEK, MONTH } from '@/constants/date'

// === Styles === //
import styles from './../style.less'

const { Option } = Select

const getMarker = color => {
  return `<span style="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:${color};"></span>`
}

export default function MonthProfit({ title }) {
  const deviceType = useDeviceType()

  const [loading, setLoading] = useState(false)
  const [data, setData] = useState([])
  const [segmentType, setSegmentType] = useState(DAY)
  const { initialState } = useModel('@@initialState')

  const titleRender = (title = '') => {
    const isWeek = segmentType === WEEK
    if (isWeek) {
      const [, index] = title.split('-')
      return `No.${index}`
    }
    const isMonth = segmentType === MONTH
    if (isMonth) {
      return `${moment(title).format('MMM')}.`
    }

    const isDay = segmentType === DAY
    if (isDay) {
      const [, m, d] = title.split('-')
      return `${m}-${d}`
    }
    return title
  }

  useEffect(() => {
    if (isEmpty(segmentType)) return
    setLoading(true)
    getSegmentProfit(initialState.address, initialState.chain, initialState.vault, segmentType)
      .then(resp => {
        setData(
          map(reverse(resp.profits), i => {
            return {
              ...i,
              segmentTime: titleRender(i.segmentTime),
              value: 1 * i.profit
            }
          })
        )
      })
      .finally(() => setLoading(false))
  }, [initialState, segmentType])

  const option = {
    title: {
      show: true,
      textStyle: {
        color: 'rgb(157 157 157)',
        fontSize: 25
      },
      text: isEmpty(data) ? 'No Data' : '',
      left: 'center',
      top: 'center'
    },
    textStyle: {
      color: '#fff'
    },
    color: ['#A68EFE', '#5470c6'],
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      formatter: function (params) {
        const param = params[0]
        console.log('params=', param)
        let message = ''
        message += `${param.name}`
        message += `<br/>${param.marker}${param.seriesName}: ${param.value}`
        if (segmentType === WEEK) {
          message += `<br/>${getMarker('#fff')}Begin: ${param.data.segmentBegin}`
          message += `<br/>${getMarker('#fff')}End: ${param.data.segmentEnd}`
        }
        return message
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      data: map(data, 'segmentTime'),
      axisLine: { onZero: true },
      splitLine: { show: false },
      splitArea: { show: false },
      axisTick: {
        alignWithLabel: true
      }
    },
    yAxis: {
      splitLine: {
        lineStyle: {
          color: '#454459'
        }
      }
    },
    series: [
      {
        name: 'Profits',
        type: 'bar',
        data: data
      }
    ]
  }
  const responsiveConfig = {
    [DEVICE_TYPE.Desktop]: {
      cardProps: {
        style: {
          height: '452px'
        }
      },
      extra: (
        <Radio.Group value={segmentType} onChange={event => setSegmentType(event.target.value)} buttonStyle="outline" className={styles.buttons}>
          {map(SEGMENT_TYPES, (value, key) => (
            <Radio.Button value={value} key={key}>
              {value}
            </Radio.Button>
          ))}
        </Radio.Group>
      )
    },
    [DEVICE_TYPE.Tablet]: {
      cardProps: {
        size: 'small',
        style: {
          height: '402px'
        }
      },
      extra: (
        <Radio.Group value={segmentType} onChange={event => setSegmentType(event.target.value)} buttonStyle="outline" className={styles.buttons}>
          {map(SEGMENT_TYPES, (value, key) => (
            <Radio.Button value={value} key={key}>
              {value}
            </Radio.Button>
          ))}
        </Radio.Group>
      )
    },
    [DEVICE_TYPE.Mobile]: {
      cardProps: {
        size: 'small',
        style: {
          height: '302px'
        }
      },
      extra: (
        <Select style={{ width: 120 }} value={segmentType} onChange={event => setSegmentType(event.target.value)}>
          {map(SEGMENT_TYPES, (value, key) => (
            <Option value={value} key={key}>
              {value}
            </Option>
          ))}
        </Select>
      )
    }
  }[deviceType]

  return (
    <Card
      loading={loading}
      bordered={false}
      size={responsiveConfig.cardProps.size}
      extra={responsiveConfig.extra}
      bodyStyle={{
        paddingLeft: 0,
        paddingRight: 0,
        ...responsiveConfig.cardProps.style
      }}
      style={{ marginTop: 24 }}
      title={title}
    >
      <BarEchart option={option} style={{ height: '100%', width: '100%' }} />
    </Card>
  )
}
