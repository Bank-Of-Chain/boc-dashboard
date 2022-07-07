export function getNoDataGraphic(hasdata = false) {
  if (hasdata) {
    return {};
  } else {
    return {
      graphic: {
        type: "text", // 类型：文本
        left: "center",
        top: "middle",
        silent: true, // 不响应事件
        invisible: false, // 有数据就隐藏
        style: {
          fill: "#9d9d9d",
          fontWeight: "bold",
          text: "No Data",
          fontSize: "25px",
        },
      },
    };
  }
}
