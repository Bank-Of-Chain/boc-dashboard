import {getNoDataGraphic} from "@/components/echarts/options/optionHelper";

/**
 * Created by linyu on 2018/6/22.
 */

export default function (obj) {
  let option = {
    grid: {left: '20', right: '20', top: '60', bottom: '10',containLabel:true},
    tooltip : {
      trigger: 'axis',
      axisPointer : {            // 坐标轴指示器，坐标轴触发有效
        type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
      }
    },
    legend: {
      data: obj.legends
    },
    xAxis:  {
      type: 'category',
      data: obj.categories
    },
    yAxis: {
      type: 'value'
    },
    series: [
    ]
  };
  obj.seriesData.forEach(function (item, key) {
    option.series.push({
      name: obj.legends[key],
      type: 'bar',
      stack: obj.stack,
      data: item,
      markPoint: {
        data: [
          {type: 'max', name: '最大值'},
          {type: 'min', name: '最小值'}
        ]
      },
    });
  });
  return {
    ...getNoDataGraphic(obj.seriesData.length > 0),
    ...option
  };
}
