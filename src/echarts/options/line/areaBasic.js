/**
 * Created by linyu on 2018/5/3.
 */

export default function (obj) {
  let option = {
    grid: {left: '20', right: '20', top: '60', bottom: '10',containLabel:true},
    tooltip : {
      trigger: 'axis',
    },
    xAxis: {
      type: 'category',
      data: obj.xAxisData
    },
    yAxis: {
      type: 'value'
    },
    series: []
  };
  if (obj.legends) {
    option = {
      ...option, ...{
        legend: {
          data: obj.legends
        },
      }
    }
  }
  obj.seriesData.forEach(function (item, key) {
    option.series.push({
      name: obj.legends ? obj.legends[key] : '',
      data: item,
      type: 'line',
      smooth: true,
      areaStyle: {},
      markPoint: {
        data: [
          {type: 'max', name: '最大值'},
          {type: 'min', name: '最小值'}
        ]
      },
    });
  });
  return option;
}