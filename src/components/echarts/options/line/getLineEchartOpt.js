import moment from 'moment'
import lineSimple from '@/components/echarts/options/line/lineSimple';

import _min from 'lodash/min';
import _max from 'lodash/max';

const getLineEchartOpt = (data, dataValueKey, seriesName, needMinMax = true, options = {}) => {
  const { format = 'MM-DD HH:mm', xAxis, yAxis, smooth = true, dataZoom } = options
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
    dataZoom
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
  if (needMinMax) {
    option.yAxis.min = (value) => parseInt(value.min * 0.9999 * 10 ** 4) / 10 ** 4
    option.yAxis.max = (value) => parseInt(value.max * 1.0001 * 10 ** 4) / 10 ** 4
  }
  option.series[0].connectNulls = true;
  return option;
}

export default getLineEchartOpt
