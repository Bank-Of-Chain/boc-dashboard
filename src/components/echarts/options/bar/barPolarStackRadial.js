import {getNoDataGraphic} from "@/components/echarts/options/optionHelper";

/**
 * Created by linyu on 2018/6/22.
 */
export default function (obj) {
  let option = {
    grid: {left: '10', right: '10', top: '10', bottom: '10', containLabel: true},
    tooltip: {
      trigger: 'axis',
      axisPointer: {            // 坐标轴指示器，坐标轴触发有效
        type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
      }
    },
    legend: {
      orient: 'vertical',
      x: 'right',
      data: obj.legends
    },
    angleAxis: {
      type: 'category',
      axisLabel: {show: false},
      data: obj.categories,
      z: 10
    },
    radiusAxis: {
      axisLabel: {show: false},
      axisLine: {show: false},
      axisTick: {show: false},
    },
    polar: {},
    series: [],
  };
  obj.legends.forEach(function (legend, legendIndex) {
    option.series.push(
      {
        type: 'bar',
        data: obj.seriesData[legendIndex],
        coordinateSystem: 'polar',
        name: legend,
        stack: obj.stack
      }
    );
  });
  return {
    ...getNoDataGraphic(obj.seriesData.length > 0),
    ...option
  };
}
