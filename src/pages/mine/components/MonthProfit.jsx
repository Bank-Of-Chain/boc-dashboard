import React from "react";
import { Card } from "antd";
import moment from "moment";
import { BarEchart } from "@/components/echarts";
import { useDeviceType, DEVICE_TYPE } from "@/components/Container/Container";

export default function MonthProfit({ title, data, loading }) {
  const deviceType = useDeviceType();
  const { monthProfits = [] } = data;

  const monthOffset = moment().utcOffset(0).month() + 1;
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const array = months.slice(monthOffset);
  const array1 = months.splice(0, monthOffset);
  const nextMonths = [...array, ...array1];

  const option = {
    textStyle: {
      color: "#fff",
    },
    color: ["#A68EFE", "#5470c6"],
    tooltip: {},
    xAxis: {
      data: nextMonths,
      axisLine: { onZero: true },
      splitLine: { show: false },
      splitArea: { show: false },
      axisTick: {
        alignWithLabel: true,
      },
    },
    yAxis: {
      splitLine: {
        lineStyle: {
          color: "#454459",
        },
      },
    },
    grid: {},
    series: [
      {
        name: "Total",
        type: "bar",
        stack: "one",
        data: monthProfits,
      },
    ],
  };

  const responsiveConfig = {
    [DEVICE_TYPE.Desktop]: {
      cardProps: {
        style: {
          height: "452px",
        },
      },
    },
    [DEVICE_TYPE.Tablet]: {
      cardProps: {
        size: "small",
        style: {
          height: "402px",
        },
      },
    },
    [DEVICE_TYPE.Mobile]: {
      cardProps: {
        size: "small",
        style: {
          height: "302px",
        },
      },
    },
  }[deviceType];

  return (
    <Card
      loading={loading}
      bordered={false}
      size={responsiveConfig.cardProps.size}
      bodyStyle={{
        paddingLeft: 0,
        paddingRight: 0,
        ...responsiveConfig.cardProps.style,
      }}
      style={{ marginTop: 24 }}
      title={title}
    >
      <BarEchart option={option} style={{ height: "100%", width: "100%" }} />
    </Card>
  );
}
