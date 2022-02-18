import moment from 'moment'
import lineSimple from '@/components/echarts/options/line/lineSimple';

import _min from 'lodash/min';
import _max from 'lodash/max';

const getLineEchartOpt = (data, dataValueKey, seriesName, needMinMax = true, options = { format: 'MM-DD HH:mm' }) => {
  const { format } = options
  const xAxisData = [];
  const seriesData = [];
  data.forEach((o) => {
    xAxisData.push(moment(Number(o.date)).format(format));
    seriesData.push(o[dataValueKey]);
  });
  const option = lineSimple({
    xAxisData,
    seriesName: seriesName,
    seriesData
  });
  option.yAxis.splitLine = {
    lineStyle: {
      color: 'black'
    }
  };
  const filterValueArray = data.filter(o => {
    return o[dataValueKey]
  }).map(o => {
    return o[dataValueKey]
  });
  if (needMinMax) {
    option.yAxis.min = parseInt(_min(filterValueArray) * 0.9999 * 10 ** 4) / 10 ** 4;
    option.yAxis.max = parseInt(_max(filterValueArray) * 1.0001 * 10 ** 4) / 10 ** 4;;
  }
  option.series[0].connectNulls = true;
  return option;
}

export default getLineEchartOpt
