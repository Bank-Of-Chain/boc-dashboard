/**
 * Created by linyu on 2018/5/3.
 */

export default function (obj) {
  let option = {
    amap: {
      center: obj.mapCenter,
      zoom: 17,
      viewMode: '3D',
      mapStyle: obj.mapStyle ? obj.mapStyle : 'amap://styles/normal',
      echartsLayerZIndex: 2019
    },
    color: ['gold', 'aqua', 'lime'],
    tooltip: {
      show: true,
      trigger: 'item',
      hideDelay: 4000,
      formatter: function (d) {
        let jw = '经度：' + d.value[0] + '<br/>';
        jw += '纬度：' + d.value[1];
        return jw;
      }
    },
    legend: {
      data: obj.legends,
      x: 'left',
      orient: 'vertical',
      padding: [30, 15, 15, 30],
      textStyle: {
        fontSize: 17,
      },
    },
    series: []
  };
  obj.legends.forEach(function (legend, legendIndex) {
    option.series.push(
      {
        name: legend,
        type: 'map',
        mapType: 'none',
        data: [],
        markLine: {
          Symbol: ['none', 'arrow'],
          symbolSize: ['0', '0.1'],
          smooth: true,
          effect: {
            show: true,
            scaleSize: 1,
            period: 30,
            shadowBlur: 10
          },
          itemStyle: {
            color: 'red',
            normal: {
              color: function (param) {
                return (param.data[0].value.colorValue);
              },
              borderWidth: 3,
              lineStyle: {
                type: 'solid',
                width: 3,
                shadowBlur: 10
              },
              label: {show: false, value: '天河城'}
            }
          },
          data: obj.markLineDatas[legendIndex]
        },
        markPoint: {
          symbol: 'pin',
          symbolSize: function (v) {
            return v / 5
          },
          effect: {
            show: true,
            type: 'bounce',
            period: 3,
          },
          itemStyle: {
            normal: {
              label: {
                show: false,
              },
            },
            emphasis: {
              label: {
                show: false,
              },
            },
          },
          data: obj.markPointDatas[legendIndex],
        },
        geoCoord: obj.geoCoords[legendIndex]
      },
    );
  });
  return option;
}
