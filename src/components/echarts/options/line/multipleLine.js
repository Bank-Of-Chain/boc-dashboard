import { getNoDataGraphic } from '@/components/echarts/options/optionHelper'
import { isEmpty } from 'lodash'

/**
 * Multiple line chart
 */
const multipleLine = obj => {
  let data = []
  let dataCount = 0
  let dataArray = []
  const { color, yAxis, dataZoom, grid } = obj
  dataArray = obj.data
  if (dataArray.length > 0) {
    dataArray.forEach(element => {
      let dataFormat = {
        name: element.seriesName ? element.seriesName : '',
        data: element.seriesData,
        type: 'line',
        showSymbol: element.showSymbol,
        lineStyle: {
          width: 5,
          cap: 'round'
        },
        ...element
      }
      dataCount += element.seriesData.length
      data.push(dataFormat)
    })
  }

  let option = {
    animation: false,
    textStyle: {
      color: '#fff'
    },
    tooltip: {
      trigger: 'axis',
      borderWidth: 0,
      backgroundColor: '#292B2E',
      textStyle: {
        color: '#fff'
      },
      confine: true
    },
    legend: obj.legend,
    xAxis: {
      type: 'category',
      data: obj.xAxisData
    },
    yAxis: {
      type: 'value'
    },
    series: data
  }

  if (obj.tooltipFormatter) {
    option.tooltip.formatter = obj.tooltipFormatter
  }

  if (!isEmpty(color)) {
    option.color = color
  }

  if (!isEmpty(yAxis)) {
    option.yAxis = {
      ...option.yAxis,
      ...yAxis
    }
  }
  if (!isEmpty(dataZoom)) {
    option.dataZoom = dataZoom
  }

  if (!isEmpty(grid)) {
    option.grid = {
      ...option.grid,
      ...grid
    }
  }

  return {
    ...getNoDataGraphic(dataCount > 0),
    ...option
  }
}

export default multipleLine
