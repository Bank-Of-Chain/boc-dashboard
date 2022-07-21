import React from "react";
import { Card, Table } from "antd";
import { HourglassOutlined } from "@ant-design/icons";
import { useModel, useRequest } from "umi";

import { useDeviceType, DEVICE_TYPE } from "@/components/Container/Container";
import { getStrategyApyDetails } from "@/services/api-service";

// === Utils === //
import moment from "moment";
import reduce from "lodash/reduce";
import map from "lodash/map";
import { toFixed } from "@/utils/number-format";
import { BigNumber } from "ethers";
import { keyBy } from "lodash";
import BN from "bignumber.js";

const decimals = 6;
const StrategyApyTable = ({ strategyName, strategyAddress, dropdownGroup }) => {
  const deviceType = useDeviceType();
  const { initialState } = useModel("@@initialState");
  const { data: dataSource = [], loading } = useRequest(
    () =>
      getStrategyApyDetails(
        initialState.chain,
        initialState.vaultAddress,
        strategyAddress,
        0,
        100
      ),
    {
      formatResult: (resp) => {
        return map(resp, (i) => {
          return {
            id: i.id,
            date: moment(i.scheduleTimestamp * 1000).format("MM-DD"),
            assets: toFixed(
              i.dailyWeightAsset,
              BigNumber.from(10).pow(18),
              decimals
            ),
            profit: (
              <div>
                {toFixed(
                  new BN(i.dailyRealizedProfit).plus(i.dailyUnrealizedProfit),
                  BigNumber.from(10).pow(18),
                  decimals
                )}
                {i.dailyUnrealizedProfit !== "0" && (
                  <HourglassOutlined style={{ color: "#a68efe" }} />
                )}
              </div>
            ),
            officialApy:
              i.dailyWeightAsset === "0"
                ? "N/A"
                : `${toFixed(
                    new BN(i.dailyOfficialApy).multipliedBy(100),
                    1,
                    decimals
                  )}%`,
            verifyApy:
              i.dailyWeightAsset === "0"
                ? "N/A"
                : `${toFixed(
                    new BN(i.dailyRealizedApy)
                      .plus(i.dailyUnrealizedApy)
                      .multipliedBy(100),
                    1,
                    decimals
                  )}%`,
            weeklyAssets: toFixed(
              i.weeklyWeightAsset,
              BigNumber.from(10).pow(18),
              decimals
            ),
            weeklyProfit: (
              <div>
                {toFixed(
                  new BN(i.weeklyRealizedProfit).plus(i.weeklyUnrealizedProfit),
                  BigNumber.from(10).pow(18),
                  decimals
                )}
                {i.weeklyUnrealizedProfit !== "0" && (
                  <HourglassOutlined style={{ color: "#a68efe" }} />
                )}
              </div>
            ),
            weeklyApy: `${toFixed(
              new BN(i.weeklyOfficialApy).multipliedBy(100),
              1,
              decimals
            )}%`,
            weeklyVerifyApy: `${toFixed(
              new BN(i.weeklyRealizedApy)
                .plus(i.weeklyUnrealizedApy)
                .multipliedBy(100),
              1,
              decimals
            )}%`,
          };
        });
      },
    }
  );

  // const columns = [
  //   {
  //     title: "Date",
  //     dataIndex: "date",
  //     key: "date",
  //   },
  //   {
  //     title: "Weighted Assets(USD)",
  //     dataIndex: "assets",
  //     key: "assets",
  //   },
  //   {
  //     title: `Profits(USD)`,
  //     dataIndex: "profit",
  //     key: "profit",
  //   },
  //   {
  //     title: "Official APY",
  //     dataIndex: "officialApy",
  //     key: "officialApy",
  //   },
  //   {
  //     title: "BOC Verify APY",
  //     dataIndex: "verifyApy",
  //     key: "verifyApy",
  //   },
  // ];

  const columns1 = [
    {
      title: "",
      dataIndex: "name",
      key: "name",
    },
    ...map(dataSource, (item) => {
      const title = moment(item.date).format("MM-DD");
      return {
        title: title,
        dataIndex: title,
        key: title,
      };
    }),
    {
      title: "Weekly",
      dataIndex: "weekly",
      key: "weekly",
    },
  ];

  const array = [
    "Weighted Assets(USD)",
    "Profits(USD)",
    "Official APY",
    "BOC Verify APY",
  ];
  const dataSource1 = map(array, (i) => {
    const obj = map(keyBy(dataSource, "date"), (j, key) => {
      let value = "";
      let weekly = "";
      if (i === array[0]) {
        value = j.assets;
        weekly = j.weeklyAssets;
      } else if (i === array[1]) {
        value = j.profit;
        weekly = j.weeklyProfit;
      } else if (i === array[2]) {
        value = j.officialApy;
        weekly = j.weeklyApy;
      } else if (i === array[3]) {
        value = j.verifyApy;
        weekly = j.weeklyVerifyApy;
      }
      return {
        [key]: value,
        weekly,
      };
    });
    return {
      name: i,
      ...reduce(
        obj,
        (rs, i) => {
          rs = {
            ...rs,
            ...i,
          };
          return rs;
        },
        {}
      ),
    };
  });

  console.log("dataSource=", dataSource, dataSource1);
  const smallCardConfig = {
    cardProps: {
      size: "small",
    },
    tableProps: {
      size: "small",
      rowClassName: "tablet-font-size",
      scroll: { x: 900 },
    },
  };
  const responsiveConfig = {
    [DEVICE_TYPE.Desktop]: {},
    [DEVICE_TYPE.Tablet]: {
      ...smallCardConfig,
      tableProps: {
        size: "small",
        rowClassName: "tablet-font-size",
        scroll: { x: 900 },
      },
    },
    [DEVICE_TYPE.Mobile]: {
      ...smallCardConfig,
      tableProps: {
        size: "small",
        rowClassName: "mobile-font-size",
        scroll: { x: 900 },
      },
    },
  }[deviceType];

  return (
    <div>
      <Card
        loading={loading}
        bordered={false}
        title={`${strategyName} APY Details`}
        extra={dropdownGroup}
        style={{
          height: "100%",
          marginTop: 32,
        }}
        {...responsiveConfig.cardProps}
      >
        {/* <Table
          rowKey={(record) => record.id}
          columns={columns}
          dataSource={dataSource}
          loading={loading}
          pagination={false}
          {...responsiveConfig.tableProps}
        />
        <br /> */}
        <Table
          rowKey={(record) => record.name}
          columns={columns1}
          dataSource={dataSource1}
          loading={loading}
          pagination={false}
          {...responsiveConfig.tableProps}
        />
        <br />
        <p>Official APY=</p>
        <p>BOC Verify APY=</p>
      </Card>
    </div>
  );
};

export default StrategyApyTable;
