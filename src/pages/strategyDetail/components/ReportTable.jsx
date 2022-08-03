import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Card, Table, Tooltip } from "antd";
import { useModel } from "umi";
import BN from "bignumber.js";

// === Components === //
import { SlidersOutlined } from "@ant-design/icons";

import { useDeviceType, DEVICE_TYPE } from "@/components/Container/Container";
import { getStrategyDetailsReports } from "@/services/api-service";
import { VAULT_TYPE, TOKEN_DISPLAY_DECIMALS } from "@/constants/vault";
import { ETHI_DISPLAY_DECIMALS } from "@/constants/ethi";
import CoinSuperPosition from "@/components/CoinSuperPosition";

// === Utils === //
import moment from "moment";
import map from "lodash/map";
import isUndefined from "lodash/isUndefined";
import { toFixed } from "@/utils/number-format";
import { isEmpty } from "lodash";

const OPERATION = {
  0: "harvest",
  1: "lend",
  2: "withdraw",
  3: "redeem",
};

const ReportTable = ({ loading, strategyName, dropdownGroup }) => {
  const { initialState } = useModel("@@initialState");
  const [dataSource, setDataSource] = useState([]);
  const [tableLoading, setTableLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });
  const deviceType = useDeviceType();
  const isETHi = VAULT_TYPE.ETHi === initialState.vault;
  const displayDecimals = {
    [VAULT_TYPE.USDi]: TOKEN_DISPLAY_DECIMALS,
    [VAULT_TYPE.ETHi]: ETHI_DISPLAY_DECIMALS,
  }[initialState.vault];

  const unit = dataSource[0]?.lpTokenUnit
    ? `(${dataSource[0]?.lpTokenUnit})`
    : "";

  const fetch = async () => {
    setTableLoading(true);
    getStrategyDetailsReports({
      strategyName,
      chainId: initialState.chain,
      vaultAddress: initialState.vaultAddress,
      limit: pagination.pageSize,
      offset: (pagination.current - 1) * pagination.pageSize,
    })
      .then((data) => {
        setDataSource(data.content);
        if (isUndefined(pagination.total)) {
          setPagination({
            ...pagination,
            total: data.totalElements,
          });
        }
      })
      .catch(() => {
        setDataSource([]);
      })
      .finally(() => {
        setTableLoading(false);
      });
  };

  useEffect(() => {
    if (!strategyName) {
      return;
    }
    fetch();
    // eslint-disable-next-line
  }, [pagination.current, strategyName]);

  useEffect(() => {
    setPagination({
      ...pagination,
      current: 1,
    });
    // eslint-disable-next-line
  }, [initialState.chain, strategyName]);

  const handleTableChange = (pagination) => {
    setPagination(pagination);
  };

  // 固定6位
  const decimal = BN(1e18);

  const columns = [
    {
      title: "Txn Hash",
      dataIndex: "txnHash",
      key: "txnHash",
      ellipsis: {
        showTitle: false,
      },
      render: (text) => (
        <a
          target={"_blank"}
          rel="noreferrer"
          href={`${CHAIN_BROWSER_URL[initialState.chain]}/tx/${text}`}
          title={text}
        >
          {text}
        </a>
      ),
    },
    {
      title: `Total Asset${unit}`,
      dataIndex: "totalAsset",
      key: "totalAsset",
      render: (text) => (
        <span title={toFixed(text, decimal)}>
          {toFixed(text, decimal, displayDecimals)}
        </span>
      ),
    },
    {
      title: `Asset Changed${unit}`,
      dataIndex: "assetChange",
      key: "assetChange",
      render: (text, item) => {
        const { fetchType } = item;
        return (
          <span title={toFixed(text, decimal)}>
            {OPERATION[fetchType]}
            {text !== "0" && ` (${toFixed(text, decimal, displayDecimals)})`}
          </span>
        );
      },
    },
    {
      title: "Date",
      dataIndex: "fetchTimestamp",
      key: "fetchTimestamp",
      render: (text) => (
        <Tooltip
          title={`${moment(1000 * text)
            .utcOffset(0)
            .format("yyyy-MM-DD HH:mm:ss")} (UTC)`}
        >
          {moment(1000 * text)
            .utcOffset(0)
            .locale("en")
            .fromNow()}
        </Tooltip>
      ),
    },
    {
      title: "Position Details",
      align: "center",
      render: (text, item) => {
        const { tokens } = item;
        if (isEmpty(tokens))
          return <SlidersOutlined style={{ color: "gray" }} />;
        const nextTitle = map(tokens, ({ address, amount, asset }) => {
          return (
            <span key={address} style={{ display: "flex" }}>
              <CoinSuperPosition size={19} array={[address]} />
              &nbsp;&nbsp;
              {toFixed(amount, decimal, displayDecimals)}
              {isETHi && `(${toFixed(asset, decimal, displayDecimals)}ETH)`}
              {!isETHi && `($${toFixed(asset, decimal, displayDecimals)})`}
            </span>
          );
        });
        return (
          <Tooltip placement="top" title={nextTitle}>
            <SlidersOutlined />
          </Tooltip>
        );
      },
    },
  ];

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
        title="Reports"
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
          loading={tableLoading}
          onChange={handleTableChange}
          pagination={
            dataSource?.length > 10 && {
              showSizeChanger: false,
              style: {
                marginBottom: 0,
              },
              ...pagination,
            }
          }
          {...responsiveConfig.tableProps}
        />
      </Card>
    </div>
  );
};

ReportTable.propTypes = {
  loading: PropTypes.bool.isRequired,
  strategyName: PropTypes.string.isRequired,
  dropdownGroup: PropTypes.array,
};

export default ReportTable;
