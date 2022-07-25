import { getNoDataGraphic } from "@/components/echarts/options/optionHelper";

/**
 * Created by linyu on 2018/5/3.
 */

export default function (obj) {
  let option = {
    animation: false,
    tooltip: {
      trigger: "axis",
      axisPointer: {
        // 坐标轴指示器，坐标轴触发有效
        type: "none", // 默认为直线，可选为：'line' | 'shadow'
      },
    },
    xAxis: {
      type: "category",
      data: obj.xAxisData,
      boundaryGap: false,
      axisTick: {
        alignWithLabel: true,
        show: false,
      },
      axisLine: {
        show: false,
      },
      axisLabel: {
        show: true,
        interval: 0,
        rotate: 0,
        color: "#000",
      },
      splitLine: {
        show: true,
        interval: 0,
        lineStyle: {
          color: "#ccc",
        },
      },
    },
    yAxis: {
      show: false,
      type: "value",
    },
    series: [
      {
        name: obj.seriesName ? obj.seriesName : "",
        data: obj.seriesData,
        type: "line",
        symbol: "circle",
        symbolSize: 15,
        showSymbol: false,
        lineStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 1,
            y2: 0,
            colorStops: [
              {
                offset: 0,
                color: "rgb(204, 186, 250)",
              },
              {
                offset: 0.5,
                color: "rgb(144, 123, 247)",
              },
              {
                offset: 0.6,
                color: "rgb(95, 128, 249)",
              },
              {
                offset: 0.95,
                color: "rgb(80, 132, 250)",
              },
              {
                offset: 1,
                color: "rgb(166, 192, 252)",
              },
            ],
          },
          opacity: 0.9,
          width: "3",
        },
        smooth: true,
        itemStyle: {
          normal: {
            color: {
              type: "radial",
              x: 0.5,
              y: 0.5,
              r: 0.5,
              colorStops: [
                {
                  offset: 0.3,
                  color: "rgb(86, 122, 246)",
                },
                {
                  offset: 0.4,
                  color: "rgb(140, 165, 250)",
                },
                {
                  offset: 0.8,
                  color: "rgb(140, 165, 250)",
                },
                {
                  offset: 0.85,
                  color: "rgb(221, 228, 253)",
                },
                {
                  offset: 1,
                  color: "rgb(221, 228, 253)", // 100% 处的颜色
                },
              ],
            },
            borderColor: "rgb(221, 228, 253, 0.3)",
            borderWidth: 15,
          },
        },
      },
    ],
  };
  if (obj.tooltipFormatter) {
    option.tooltip.formatter = obj.tooltipFormatter;
  }

  return {
    ...getNoDataGraphic(obj.seriesData.length > 0),
    ...option,
  };
}
