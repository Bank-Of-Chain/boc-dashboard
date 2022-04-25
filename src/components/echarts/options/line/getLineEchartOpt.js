import moment from 'moment'
import lineSimple from '@/components/echarts/options/line/lineSimple';

import _min from 'lodash/min';
import _max from 'lodash/max';
import forEach from 'lodash/forEach';
import isNaN from 'lodash/isNaN';
import isUndefined from 'lodash/isUndefined';

const getLineEchartOpt = (data, dataValueKey, seriesName, needMinMax = true, options = {}) => {
  const {
    format = 'MM-DD HH:mm',
    xAxis,
    yAxis,
    smooth = false,
    step,
    dataZoom,
    tootlTipSuffix = '(UTC)',
    tootlTipFormat = 'YYYY-MM-DD HH:mm'
  } = options
  const xAxisData = [];
  const seriesData = [];
  const xAxisLabels = {}
  data.forEach((o) => {
    // 当天为 23:59 时的数据, 展示到明天 00:00，故加 1
    let value = moment(o.date).add(1, 'days').format(tootlTipFormat);
    if (tootlTipSuffix) {
      value = `${value} ${tootlTipSuffix}`
    }
    xAxisLabels[value] = moment(o.date).add(1, 'days').format(format);
    xAxisData.push(value);
    seriesData.push(o[dataValueKey]);
  });
  const option = lineSimple({
    xAxisData,
    seriesName: seriesName,
    seriesData,
    smooth,
    dataZoom
  });
  option.yAxis = {
    ...option.yAxis,
    ...yAxis
  }
  option.xAxis = {
    axisLabel: {
      formatter: (value, index) => xAxisLabels[value]
    },
    ...option.xAxis,
    ...xAxis,
  }
  option.yAxis.splitLine = {
    lineStyle: {
      color: 'black'
    }
  };
  if (needMinMax) {
    option.yAxis.min = (value) => parseInt(value.min * 0.9999 * 10 ** 4) / 10 ** 4
    option.yAxis.max = (value) => parseInt(value.max * 1.0001 * 10 ** 4) / 10 ** 4
  }
  option.series[0].connectNulls = true;
  if (step) {
    const seriesData = option.series[0].data
    forEach(seriesData, (value, index) => {
      if ((isUndefined(value) || isNaN(value)) && index !== 0) {
        seriesData[index] = seriesData[index - 1]
      }
    })
  }
  return option;
}

export default getLineEchartOpt
