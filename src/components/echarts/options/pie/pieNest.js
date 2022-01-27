import {getNoDataGraphic} from "@/components/echarts/options/optionHelper";

/**
 * Created by linyu on 2018/6/22.
 */
export default function (obj) {
  let option = {
    grid: {left: '10', right: '10', top: '10', bottom: '10',containLabel:true},
    tooltip: {
      trigger: 'item',
      formatter: "{a} <br/>{b}: {c} ({d}%)"
    },
    legend: {
      orient: 'vertical',
      x: 'right',
      data: obj.legends
    },
    series: [
      {
        name: obj.stack,
        type: 'pie',
        selectedMode: 'single',
        radius: [0, '30%'],
        label: {
          normal: {
            position: 'inner'
          }
        },
        labelLine: {
          normal: {
            show: false
          }
        },
        data: []
      },
      {
        name: obj.stack,
        type: 'pie',
        radius: ['40%', '55%'],
        data: []
      }
    ]
  };
  obj.legends.forEach(function (legend, legendIndex) {
    let count = 0;
    obj.seriesData[legendIndex].forEach(function (e) {
      count = count + e;
    });
    option.series[0].data.push({value: count, name: legend});
    obj.categories.forEach(function (category, categoryIndex) {
      let childLegend = obj.categories[categoryIndex];
      option.legend.data.push(childLegend);
      option.series[1].data.push({value: obj.seriesData[legendIndex][categoryIndex], name: childLegend});
    });
  });
  return {
    ...getNoDataGraphic(obj.seriesData.length > 0),
    ...option
  };
}
