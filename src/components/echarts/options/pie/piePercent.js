import { getNoDataGraphic } from "@/components/echarts/options/optionHelper";

/**
 * Created by linyu on 2018/5/3.
 */
export default function (obj) {
  const option = {
    title: {
      text: obj.text ? obj.text : "",
      x: "center",
      y: "center",
      textStyle: {
        fontWeight: "normal",
        color: obj.textColor ? obj.textColor : "#0580f2",
        fontSize: obj.textSize ? obj.textSize : "15",
      },
    },
    color: [obj.restColor ? obj.restColor : "rgb(240, 242, 245)"],

    series: [
      {
        type: "pie",
        clockWise: true,
        radius: obj.radius ? obj.radius : ["50%", "66%"],
        itemStyle: {
          normal: {
            label: {
              show: false,
            },
            labelLine: {
              show: false,
            },
          },
        },
        data: [
          {
            value: obj.percent ? obj.percent : 0,
            itemStyle: {
              normal: {
                color: {
                  // 完成的圆环的颜色
                  type: "linear",
                  colorStops: [
                    {
                      offset: obj.startOffet ? obj.startOffet : 0,
                      color: obj.startColor
                        ? obj.startColor
                        : "rgb(102, 174, 255)", // 0% 处的颜色
                    },
                    {
                      offset: obj.endOffet ? obj.endOffet : 1,
                      color: obj.endColor ? obj.endColor : "rgb(102, 174, 255)", // 100% 处的颜色
                    },
                  ],
                },
                label: {
                  show: false,
                },
                labelLine: {
                  show: false,
                },
              },
            },
          },
          {
            value: 100 - obj.percent,
          },
        ],
      },
    ],
  };
  if (obj.shadowBlur) {
    option.series[0].data[0].itemStyle.normal.shadowBlur = obj.shadowBlur;
    if (obj.shadowColor) {
      option.series[0].data[0].itemStyle.normal.shadowColor = obj.shadowColor;
    }
  }
  if (obj.borderPieRadius) {
    option.series.push({
      type: "pie",
      radius: obj.borderPieRadius ? obj.borderPieRadius : ["50%", "51%"],
      silent: true,
      label: {
        normal: {
          show: false,
        },
      },
      data: [
        {
          value: 1,
          itemStyle: {
            normal: {
              color: obj.borderColor ? obj.borderColor : "white",
            },
          },
        },
      ],
      animation: false,
    });
  }
  if (obj.innerColor) {
    option.series.push({
      name: "内圈",
      type: "pie",
      hoverAnimation: false,
      tooltip: {},
      radius: [0, obj.radius[0]],
      label: {
        normal: {
          show: false,
        },
      },
      data: [
        {
          value: 0,
          itemStyle: {
            normal: {
              color: obj.innerColor,
            },
          },
        },
      ],
    });
  }
  return {
    ...getNoDataGraphic(obj.radius.length > 0),
    ...option,
  };
}
