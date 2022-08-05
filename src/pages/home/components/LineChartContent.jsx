import React from "react";
import classNames from "classnames";
import { Card, Tabs, Tooltip, Radio, Select } from "antd";
import { LineEchart } from "@/components/echarts";
import { useDeviceType, DEVICE_TYPE } from "@/components/Container/Container";
import styles from "../style.less";

const { TabPane } = Tabs;
const { Option } = Select;

export default function LineChartContent({
  isUsdi,
  loading = false,
  calDateRange = 7,
  onCalDateRangeClick = () => {},
  apyEchartOpt = {},
  tvlEchartOpt = {},
}) {
  const deviceType = useDeviceType();

  const chartResponsiveConfig = {
    [DEVICE_TYPE.Desktop]: {
      chartWrapperClassName: styles.chartDiv,
    },
    [DEVICE_TYPE.Tablet]: {
      cardProps: {
        size: "small",
      },
      buttonProps: {
        size: "small",
        style: { fontSize: "0.5rem" },
      },
      chartWrapperClassName: styles.chartDivMobile,
    },
    [DEVICE_TYPE.Mobile]: {
      cardProps: {
        size: "small",
      },
      buttonProps: {
        size: "small",
        style: { fontSize: "0.5rem" },
      },
      chartWrapperClassName: styles.chartDivMobile,
      tabClassName: styles.tabMobile,
    },
  }[deviceType];

  const onDateChange = (e) => {
    if (typeof e === 'number') {
      onCalDateRangeClick(e);
    } else {
      onCalDateRangeClick(e.target.value);
    }
  };

  let extra = (
    <div className={styles.buttons}>
      <Radio.Group value={calDateRange} onChange={onDateChange}>
        <Tooltip title="last 7 days">
          <Radio.Button value={7}>WEEK</Radio.Button>
        </Tooltip>
        <Tooltip title="last 30 days">
          <Radio.Button value={31}>MONTH</Radio.Button>
        </Tooltip>
        <Tooltip title="last 365 days">
          <Radio.Button value={365}>YEAR</Radio.Button>
        </Tooltip>
      </Radio.Group>
    </div>
  )
  if (deviceType === DEVICE_TYPE.Mobile) {
    extra = (
      <Select
        style={{ width: 120 }}
        value={calDateRange}
        onChange={onDateChange}
      >
        <Option value={7}>WEEK</Option>
        <Option value={31}>MONTH</Option>
        <Option value={365}>YEAR</Option>
      </Select>
    )
  }

  return (
    <Card
      loading={loading}
      bordered={false}
      style={{ marginTop: 40 }}
      {...chartResponsiveConfig.cardProps}
    >
      <div className={styles.vaultKeyCard}>
        <Tabs
          animated
          className={classNames(chartResponsiveConfig.tabClassName)}
          tabBarExtraContent={extra}
        >
          <TabPane tab="APY (%)" key="apy">
            <div className={chartResponsiveConfig.chartWrapperClassName}>
              <LineEchart
                option={apyEchartOpt}
                style={{ height: "100%", width: "100%" }}
              />
            </div>
          </TabPane>
          <TabPane
            tab={isUsdi ? "Total Supply" : "Total Supply"}
            key="totalSupply"
          >
            <div className={chartResponsiveConfig.chartWrapperClassName}>
              <LineEchart
                option={tvlEchartOpt}
                style={{ height: "100%", width: "100%" }}
              />
            </div>
          </TabPane>
        </Tabs>
      </div>
    </Card>
  );
}
