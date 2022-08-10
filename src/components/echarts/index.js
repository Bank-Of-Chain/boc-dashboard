import React from "react";

import loadable from "@loadable/component";
import { Spin } from "antd";

const loaddingCom = (
  <Spin
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      minHeight: 20,
      fontSize: 14,
    }}
    tip="Loading...."
  />
);
const LineEchart = loadable(() => import("./line"), { fallback: loaddingCom });
const BarEchart = loadable(() => import("./bar"), { fallback: loaddingCom });
const PieEchart = loadable(() => import("./pie"), { fallback: loaddingCom });

export { LineEchart, BarEchart, PieEchart };
