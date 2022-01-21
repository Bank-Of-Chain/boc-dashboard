/**
 * Created by daunwenlong on 2018/12/29.
 * 多条平滑曲线图
 */


export default function (obj) {

  let data = [];

  let dataArray = [];
  dataArray = obj.data;
  if (dataArray.length > 0) {
    dataArray.forEach((element) => {
      let dataFormat = {
        name: element.seriesMame ? element.seriesMame : "",
        data: element.seriesData,
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 10,
        showSymbol: false,
        color: element.color ? element.color : 'rgb(166, 192, 252)',
        lineStyle: {
          width: element.width ? element.width :'2',
        }
      };
      data.push(dataFormat);
    })
  }


  let option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'none'
      }
    },
    legend: {
      data:obj.legend
    },
    xAxis: {
      type: 'category',
      data: obj.xAxisData,
      boundaryGap: false,
      axisTick: {
        alignWithLabel: true,
        show: false,
      },
      axisLine: {
        show: false
      },
    },
    yAxis: {
      show: false,
      type: 'value'
    },
    series: data
  };

  if(obj.tooltipFormatter){
    option.tooltip.formatter= obj.tooltipFormatter;
  }

  return option;
}
