import React from "react";
import PropTypes from "prop-types";
import { Card, Table, Space, Tooltip } from "antd";
import { HourglassOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { useModel, useRequest } from "umi";

import { useDeviceType, DEVICE_TYPE } from "@/components/Container/Container";
import { getStrategyApyDetails } from "@/services/api-service";

// === Utils === //
import reduce from "lodash/reduce";
import map from "lodash/map";
import { toFixed } from "@/utils/number-format";
import { BigNumber } from "ethers";
import { isEmpty, isNil, keyBy } from "lodash";
import BN from "bignumber.js";
import { formatToUTC0 } from "@/utils/date";

// === Constants === //
import { TOKEN_DISPLAY_DECIMALS } from "@/constants/vault";

const dateFormat = "MMMM DD";

const comp = <HourglassOutlined style={{ color: "#a68efe" }} />;
const StrategyApyTable = ({
  strategyName,
  strategyAddress,
  unit,
  displayDecimals = TOKEN_DISPLAY_DECIMALS,
  dropdownGroup,
}) => {
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
            date: formatToUTC0(i.scheduleTimestamp * 1000, dateFormat),
            assets: toFixed(
              i.dailyWeightAsset,
              BigNumber.from(10).pow(18),
              displayDecimals
            ),
            profit: (
              <div>
                {toFixed(
                  new BN(i.dailyRealizedProfit).plus(i.dailyUnrealizedProfit),
                  BigNumber.from(10).pow(18),
                  displayDecimals
                )}
                {i.dailyUnrealizedProfit !== "0" && comp}
              </div>
            ),
            officialApy: isNil(i.dailyOfficialApy)
              ? "N/A"
              : `${toFixed(
                  new BN(i.dailyOfficialApy).multipliedBy(100),
                  1,
                  2
                )}%`,
            verifyApy:
              i.dailyWeightAsset === "0" ? (
                "N/A"
              ) : (
                <div>
                  {`${toFixed(
                    new BN(i.dailyRealizedApy)
                      .plus(i.dailyUnrealizedApy)
                      .multipliedBy(100),
                    1,
                    2
                  )}%`}
                  {i.dailyUnrealizedApy > 0 && comp}
                </div>
              ),
            weeklyAssets: toFixed(
              i.weeklyWeightAsset,
              BigNumber.from(10).pow(18),
              displayDecimals
            ),
            weeklyProfit: (
              <div>
                {toFixed(
                  new BN(i.weeklyRealizedProfit).plus(i.weeklyUnrealizedProfit),
                  BigNumber.from(10).pow(18),
                  displayDecimals
                )}
                {i.weeklyUnrealizedProfit !== "0" && comp}
              </div>
            ),
            weeklyApy:
              isNil(i.weeklyOfficialApy) || i.weeklyWeightAsset === "0"
                ? "N/A"
                : `${toFixed(
                    new BN(i.weeklyOfficialApy).multipliedBy(100),
                    1,
                    2
                  )}%`,
            weeklyVerifyApy:
              i.weeklyWeightAsset === "0" ? (
                "N/A"
              ) : (
                <div>
                  {`${toFixed(
                    new BN(i.weeklyRealizedApy)
                      .plus(i.weeklyUnrealizedApy)
                      .multipliedBy(100),
                    1,
                    2
                  )}%`}
                  {i.weeklyUnrealizedApy > 0 && comp}
                </div>
              ),
          };
        });
      },
    }
  );
  if (isEmpty(dataSource)) return <span />;

  const columns1 = [
    {
      title: "",
      dataIndex: "name",
      key: "name",
    },
    ...map(dataSource, (item) => {
      const title = item.date;
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
    `Weighted Assets(${unit})`,
    `Profits(${unit})`,
    "Official APY",
    "BOC Verify APY",
  ];
  const dataSource1 = map(array, (i, index) => {
    const obj = map(keyBy(dataSource, "date"), (j, key) => {
      let value = "";
      let weekly = "";
      let nextName = "";
      if (i === array[0]) {
        value = j.assets;
        weekly = j.weeklyAssets;
        nextName = (
          <Space>
            {i}
            <Tooltip title="Time weighted assets daily/weekly.">
              <InfoCircleOutlined />
            </Tooltip>
          </Space>
        );
      } else if (i === array[1]) {
        value = j.profit;
        weekly = j.weeklyProfit;
        nextName = (
          <Space>
            {i}
            <Tooltip title="Strategy profit daily/weekly.">
              <InfoCircleOutlined />
            </Tooltip>
          </Space>
        );
      } else if (i === array[2]) {
        value = j.officialApy;
        weekly = j.weeklyApy;
        nextName = (
          <Space>
            {i}
            <Tooltip title="The official apy of the 3rd pool, through the raw data statistics on the chain.">
              <InfoCircleOutlined />
            </Tooltip>
          </Space>
        );
      } else if (i === array[3]) {
        value = j.verifyApy;
        weekly = j.weeklyVerifyApy;
        nextName = (
          <Space>
            {i}
            <Tooltip title="The apy verified by the BOC strategy is calculated by profit and weighted assets.">
              <InfoCircleOutlined />
            </Tooltip>
          </Space>
        );
      }
      return {
        [key]: value,
        weekly,
        name: nextName,
      };
    });
    return {
      ...reduce(
        obj,
        (rs, i) => {
          rs = {
            ...rs,
            ...i,
          };
          return rs;
        },
        {
          id: index,
        }
      ),
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
          columns={columns1}
          dataSource={dataSource1}
          loading={loading}
          pagination={false}
          {...responsiveConfig.tableProps}
        />
        <br />
        <p>
          Warning: Official APY calculation is affected by the price of reward
          token, reward rate, and changes in principal within{" "}
          <span style={{ color: "#a68efe", fontWeight: "bold" }}>24</span> hour,
          and the statistical data is not absolutely accurate.
        </p>
      </Card>
    </div>
  );
};

StrategyApyTable.propTypes = {
  strategyName: PropTypes.string.isRequired,
  strategyAddress: PropTypes.string.isRequired,
  unit: PropTypes.string,
  displayDecimals: PropTypes.number,
  dropdownGroup: PropTypes.array,
};

export default StrategyApyTable;
