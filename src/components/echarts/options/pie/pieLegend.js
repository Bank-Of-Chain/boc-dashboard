/**
 * Created by linyu on 2018/5/3.
 */

export default function (obj) {
  let option = {
    tooltip: {
      trigger: 'item',
      formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
    series: [
      {
        name: obj.seriesName,
        type: 'pie',
        radius: '60%',
        center: ['50%', '50%'],
        data: obj.seriesData.sort(function (a, b) { return a.value - b.value; }),
        // roseType: 'radius',
        itemStyle: {
          emphasis: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        },
        animationType: 'scale',
        animationEasing: 'elasticOut',
        animationDelay: function (idx) {
          return Math.random() * 200;
        }
      }
    ]
  };
  if (obj.legends) {
    option = {
      ...option, ...{
        legend: {
          type: 'scroll',
          orient: 'vertical',
          right: 10,
          top: 20,
          bottom: 20,
          data: obj.legends
        },
      }
    }
  }
  return option;
}