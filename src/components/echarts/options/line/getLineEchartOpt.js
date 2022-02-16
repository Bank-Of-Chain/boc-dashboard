import moment from 'moment'
import lineSimple from '@/components/echarts/options/line/lineSimple';

import _min from 'lodash/min';
import _max from 'lodash/max';

const getLineEchartOpt = (data, dataValueKey, seriesName, needMinMax = true) => {
  const xAxisData = [];
  const seriesData = [];
  data.forEach((o) => {
    xAxisData.push(moment(Number(o.date)).format('MM-DD HH:mm'));
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
    option.yAxis.min = _min(filterValueArray);
    option.yAxis.max = _max(filterValueArray);
  }
  option.series[0].connectNulls = true;
  return option;
}

export default getLineEchartOpt
