export default function (obj) {
  const color = ['#a6c84c', '#ffa022', '#46bee9'];
  let option = {
    amap: {
      center: obj.mapCenter,
      zoom: 17,
      viewMode: '3D',
      mapStyle: obj.mapStyle ? obj.mapStyle : 'amap://styles/normal',
      echartsLayerZIndex: 2019
    },
    tooltip: {
      trigger: "item"
    },
    legend: {
      data: obj.legends,
      x: 'left',
      orient: 'vertical',
    },
    series: []
  };
  obj.legends.forEach(function (legend, i) {
    option.series.push({
        name: legend,
        type: 'lines',
        coordinateSystem: 'amap',
        zlevel: 1,
        effect: {
          show: true,
          period: 6,
          trailLength: 0.7,
          symbolSize: 3
        },
        silent: true,
        lineStyle: {
          normal: {
            color: color[i],
            width: 0,
            curveness: 0.2
          }
        },
        data: obj.lines[i]
      },
      {
        name: legend,
        type: 'lines',
        coordinateSystem: 'amap',
        zlevel: 2,
        symbol: ['none', 'none'],
        symbolSize: 10,
        effect: {
          show: true,
          period: 6,
          trailLength: 0,
          symbol: 'pin',
          symbolSize: 3
        },
        silent: true,
        lineStyle: {
          normal: {
            color: color[i],
            width: 1,
            opacity: 0.6,
            curveness: 0.2
          }
        },
        data: obj.lines[i]
      },
      {
        name: legend,
        type: 'effectScatter',
        coordinateSystem: 'amap',
        zlevel: 2,
        rippleEffect: {
          brushType: 'stroke'
        },
        label: {
          normal: {
            show: false,
            position: 'right',
            formatter: '{b}'
          }
        },
        symbolSize: function (val) {
          return val[2] / 8;
        },
        itemStyle: {
          normal: {
            color: color[i]
          }
        },
        data: obj.points[i]
      })
  });
  return option;
}
