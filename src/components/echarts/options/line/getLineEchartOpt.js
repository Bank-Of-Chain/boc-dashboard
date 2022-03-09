import moment from 'moment'
import lineSimple from '@/components/echarts/options/line/lineSimple';

import map from 'lodash/map';
import _min from 'lodash/min';
import _max from 'lodash/max';
import forEach from 'lodash/forEach';
import isNaN from 'lodash/isNaN';
import isUndefined from 'lodash/isUndefined';

const getLineEchartOpt = (data, dataValueKey, seriesName, needMinMax = true, options = {}) => {
  const { format = 'MM-DD HH:mm', xAxis, yAxis, smooth = true, step } = options
  const xAxisData = [];
  const seriesData = [];
  data.forEach((o) => {
    xAxisData.push(moment(Number(o.date)).format(format));
    seriesData.push(o[dataValueKey]);
  });
  const option = lineSimple({
    xAxisData,
    seriesName: seriesName,
    seriesData,
    smooth,
    step
  });
  option.yAxis = {
    ...option.yAxis,
    ...yAxis
  }
  option.xAxis = {
    ...option.xAxis,
    ...xAxis
  }
  option.yAxis.splitLine = {
    lineStyle: {
      color: 'black'
    }
  };
  const filterValueArray = map(data, dataValueKey).filter(i => !isUndefined(i));
  if (needMinMax) {
    option.yAxis.min = parseInt(_min(filterValueArray) * 0.9999 * 10 ** 4) / 10 ** 4;
    option.yAxis.max = parseInt(_max(filterValueArray) * 1.0001 * 10 ** 4) / 10 ** 4;
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
