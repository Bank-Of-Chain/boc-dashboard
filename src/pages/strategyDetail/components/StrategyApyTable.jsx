import React from "react";
import { Card, Table } from "antd";
import { useModel, useRequest } from "umi";

import { useDeviceType, DEVICE_TYPE } from "@/components/Container/Container";
import { getStrategyApyDetails } from "@/services/api-service";

// === Utils === //
import moment from "moment";
import reduce from "lodash/reduce";
import map from "lodash/map";
import { toFixed } from "@/utils/number-format";
import { BigNumber } from "ethers";
import { keyBy, last } from "lodash";
import BN from "bignumber.js";

const decimals = 2;
const StrategyApyTable = ({ strategyName, dropdownGroup }) => {
  const deviceType = useDeviceType();
  const { initialState } = useModel("@@initialState");
  const { data: dataSource = [], loading } = useRequest(
    () =>
      getStrategyApyDetails(
        initialState.chain,
        initialState.vaultAddress,
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
            profit: toFixed(
              new BN(i.dailyRealizedProfit).plus(i.dailyUnrealizedProfit),
              BigNumber.from(10).pow(18),
              decimals
            ),
            official_apy: `${toFixed(i.dailyOfficialApy || "0", 100)}%`,
            verify_apy: `${toFixed(
              new BN(i.dailyRealizedApy).plus(i.dailyUnrealizedApy),
              100,
              decimals
            )}%`,
            weeklyRealizedProfit: i.weeklyRealizedProfit,
            weeklyRealizedApy: i.weeklyRealizedApy,
            weeklyWeightAsset: i.weeklyWeightAsset,
          };
        });
      },
    }
  );
  console.log("dataSource=", dataSource);
  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Weighted Assets(USD)",
      dataIndex: "assets",
      key: "assets",
    },
    {
      title: `Profits(USD)`,
      dataIndex: "profit",
      key: "profit",
    },
    {
      title: "Official APY",
      dataIndex: "official_apy",
      key: "official_apy",
    },
    {
      title: "BOC Verify APY",
      dataIndex: "verify_apy",
      key: "verify_apy",
    },
  ];

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
      if (i === array[0]) {
        value = j.assets;
      } else if (i === array[1]) {
        value = j.profit;
      } else if (i === array[2]) {
        value = j.official_apy;
      } else if (i === array[3]) {
        value = j.verify_apy;
      }
      return {
        [key]: value,
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
      weekly: last(dataSource),
    };
  });

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
        <Table
          rowKey={(record) => record.id}
          columns={columns}
          dataSource={dataSource}
          loading={loading}
          pagination={false}
          {...responsiveConfig.tableProps}
        />
        <br />
        <Table
          rowKey={(record) => record.id}
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
