import moment from 'moment'
import lineSimple from '@/components/echarts/options/line/lineSimple';

import _min from 'lodash/min';
import _max from 'lodash/max';
import forEach from 'lodash/forEach';
import isNaN from 'lodash/isNaN';
import isUndefined from 'lodash/isUndefined';

const getLineEchartOpt = (data, dataValueKey, seriesName, needMinMax = true, options = {}) => {
  const { format = 'MM-DD HH:mm', xAxis, yAxis, smooth = true, step, dataZoom, tootlTipSuffix = 'UTC' } = options
  const xAxisData = [];
  const seriesData = [];
  data.forEach((o) => {
    const value = moment(Number(o.date)).utcOffset(0).format(format);
    xAxisData.push(tootlTipSuffix ? `${value} ${tootlTipSuffix}` : value);
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
      formatter: (value) => {
        return tootlTipSuffix ? value.replace(` ${tootlTipSuffix}`, '') : value
      }
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
