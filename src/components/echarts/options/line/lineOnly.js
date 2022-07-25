import { getNoDataGraphic } from "@/components/echarts/options/optionHelper";

/**
 * Created by linyu on 2018/5/3.
 */

export default function (obj) {
  const option = {
    animation: false,
    grid: {
      left: "0%",
      right: "0%",
      bottom: "0%",
      containLabel: true,
    },
    tooltip: {
      trigger: "axis",
    },
    xAxis: {
      type: "category",
      data: obj.xAxisData,
      show: false,
    },
    yAxis: {
      type: "value",
      show: false,
    },
    series: [
      {
        name: obj.seriesName ? obj.seriesName : "",
        data: obj.seriesData,
        type: "line",
        showSymbol: false,
        lineStyle: {
          color: obj.color
            ? obj.color
            : {
                type: "linear",
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
          width: "3",
        },
        smooth: true,
      },
    ],
  };

  return {
    ...getNoDataGraphic(obj.seriesData.length > 0),
    ...option,
  };
}
