import {getNoDataGraphic} from "@/components/echarts/options/optionHelper";

/**
 * 多条平滑曲线图
 */
export default function (obj) {

  let data = [];
  let dataCount =0;
  let dataArray = [];
  dataArray = obj.data;
  if (dataArray.length > 0) {
    dataArray.forEach((element) => {
      let dataFormat = {
        name: element.seriesName ? element.seriesName : "",
        data: element.seriesData,
        type: 'line'
      };
      dataCount += element.seriesData.length;
      data.push(dataFormat);
    })
  }

  let option = {
    tooltip: {
      trigger: 'axis'
    },
    legend: obj.legend,
    xAxis: {
      type: 'category',
      data: obj.xAxisData,
    },
    yAxis: {
      type: 'value'
    },
    series: data
  };

  if(obj.tooltipFormatter){
    option.tooltip.formatter= obj.tooltipFormatter;
  }

  return {
    ...getNoDataGraphic(dataCount > 0),
    ...option
  };
}
