/**
 * 地址展示组件
 */
import React from "react";

export default function Address(props) {
  const ens = props.address;
  let displayAddress = props.address.substr(0, 6);
  if (ens && ens.indexOf("0x") < 0) {
    displayAddress = ens;
  } else if (props.size === "short") {
    displayAddress += "..." + props.address.substr(-4);
  } else if (props.size === "long") {
    displayAddress = props.address;
  }
  return <span className={props.wrapClassName}>{displayAddress}</span>;
}
