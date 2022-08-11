import React, { useState, useEffect } from "react";
import { Card, Table, Tooltip, Radio, Select } from "antd";
import { useModel } from "umi";

// === Utils === //
import moment from "moment";
import map from "lodash/map";
import BN from "bignumber.js";
import { toLeastOneFixed, toFixed } from "@/utils/number-format";

import { USDI_DECIMALS } from "@/constants/usdi";
import { TOKEN_DISPLAY_DECIMALS } from "@/constants/vault";
import { useDeviceType, DEVICE_TYPE } from "@/components/Container/Container";

import { RECENT_ACTIVITY_TYPE } from "@/constants/usdi";
import { getRecentActivity } from "@/services/dashboard-service";
import styles from "../style.less";

const { Option } = Select;

const TransationsTable = ({
  loading,
  dispalyDecimal = TOKEN_DISPLAY_DECIMALS,
  decimals = USDI_DECIMALS,
  token = "USDi",
  filterOptions = RECENT_ACTIVITY_TYPE,
}) => {
  const { initialState } = useModel("@@initialState");
  const [data, setData] = useState([]);
  const [tableLoading, setTableLoading] = useState(false);
  const deviceType = useDeviceType();

  const FILTER_OPTIONS = {
    All: "All",
    ...filterOptions,
  };
  const [filter, setFilter] = useState(FILTER_OPTIONS.All);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const types =
      filter === FILTER_OPTIONS.All ? Object.values(filterOptions) : [filter];
    setTableLoading(true);
    getRecentActivity(initialState.vault, initialState.chain, types)
      .then((data) => {
        setCurrentPage(1);
        setData(data);
      })
      .finally(() => {
        setTableLoading(false);
      });
  }, [filter]);

  const renderAddress = (address) => {
    return (
      <a
        target={"_blank"}
        href={`${CHAIN_BROWSER_URL[initialState.chain]}/address/${address}`}
        title={address}
        rel="noreferrer"
      >
        {address}
      </a>
    );
  };

  const tableColumnWidth = {
    [DEVICE_TYPE.Desktop]: ["10rem", "10rem", "25rem", "8rem"],
    [DEVICE_TYPE.Tablet]: ["8rem", "8rem", undefined, "8rem"],
    [DEVICE_TYPE.Mobile]: ["8rem", "8rem", undefined, "8rem"],
  }[deviceType];

  const columns = [
    {
      title: "Date",
      dataIndex: "timestamp",
      key: "timestamp",
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
      title: "Method",
      dataIndex: "type",
      key: "type",
      ellipsis: {
        showTitle: false,
      },
    },
    {
      title: "Detail",
      key: "detail",
      render: (text, item) => {
        const {
          type,
          transferredAmount,
          toAccountUpdate,
          fromAccountUpdate,
          totalSupplyChangeAmount,
        } = item;
        const changeValue = toLeastOneFixed(
          transferredAmount,
          decimals,
          dispalyDecimal
        );
        const rebaseValue = toLeastOneFixed(
          totalSupplyChangeAmount,
          decimals,
          dispalyDecimal
        );
        const absChangeValue = toLeastOneFixed(
          BN(transferredAmount).abs(),
          decimals,
          dispalyDecimal
        );
        const transferValue = toLeastOneFixed(
          transferredAmount,
          decimals,
          dispalyDecimal
        );
        const changeValueTitle = toFixed(transferredAmount, BN(10 ** decimals));
        const rebaseValueTitle = toFixed(
          totalSupplyChangeAmount,
          BN(10 ** decimals)
        );
        const absChangeValueTitle = toFixed(
          BN(transferredAmount).abs(),
          BN(10 ** decimals)
        );
        const transferValueTitle = toFixed(
          transferredAmount,
          BN(10 ** decimals)
        );
        const from = fromAccountUpdate?.account?.id;
        const to = toAccountUpdate?.account?.id;
        const fns = {
          Mint: () => (
            <>
              {type} <span title={changeValueTitle}>{changeValue}</span> {token}{" "}
              to {renderAddress(to)}
            </>
          ),
          Burn: () => (
            <>
              {type} <span title={absChangeValueTitle}>{absChangeValue}</span>{" "}
              {token} from {renderAddress(from)}
            </>
          ),
          Rebase: () => (
            <>
              {type} <span title={rebaseValueTitle}>{rebaseValue}</span> {token}
            </>
          ),
          Transfer: () => (
            <>
              {type} <span title={transferValueTitle}>{transferValue}</span>{" "}
              {token} from {renderAddress(from)} to {renderAddress(to)}
            </>
          ),
        };
        return <span style={{ whiteSpace: "normal" }}>{fns[item.type]()}</span>;
      },
    },
    {
      title: "Tx Address",
      key: "tx",
      ellipsis: {
        showTitle: false,
      },
      align: "center",
      render: (text, item) => (
        <a
          target="_blank"
          rel="noreferrer"
          href={`${CHAIN_BROWSER_URL[initialState.chain]}/tx/${
            item.transaction.id
          }`}
        >
          <img width={21} src="./images/link.png" alt="link" />
        </a>
      ),
    },
  ];

  columns.forEach((col, index) => {
    col.width = tableColumnWidth[index];
  });

  const handleChange = (e) => {
    if (typeof e === "string") {
      setFilter(e);
    } else {
      setFilter(e.target.value);
    }
  };

  const responsiveConfig = {
    [DEVICE_TYPE.Desktop]: {
      radioGroupProps: {
        size: "large",
      },
    },
    [DEVICE_TYPE.Tablet]: {
      cardProps: {
        size: "small",
      },
      radioGroupProps: {
        size: "small",
      },
      tableProps: {
        size: "small",
        scroll: { x: 800 },
      },
    },
    [DEVICE_TYPE.Mobile]: {
      cardProps: {
        size: "small",
      },
      radioGroupProps: {
        size: "small",
      },
      tableProps: {
        compact: true,
        size: "small",
        scroll: { x: 800 },
      },
    },
  }[deviceType];

  let extra = (
    <Radio.Group
      value={filter}
      onChange={handleChange}
      buttonStyle="outline"
      {...responsiveConfig.radioGroupProps}
      className={styles.buttons}
    >
      {map(FILTER_OPTIONS, (value, key) => (
        <Radio.Button value={value} key={key}>
          {value}
        </Radio.Button>
      ))}
    </Radio.Group>
  );
  if (deviceType === DEVICE_TYPE.Mobile) {
    extra = (
      <Select style={{ width: 120 }} value={filter} onChange={handleChange}>
        {map(FILTER_OPTIONS, (value, key) => (
          <Option value={value} key={key}>
            {value}
          </Option>
        ))}
      </Select>
    );
  }

  return (
    <div>
      <Card
        loading={loading}
        bordered={false}
        title="Recent Activity"
        extra={extra}
        style={{
          height: "100%",
          marginTop: 40,
        }}
        {...responsiveConfig.cardProps}
      >
        <Table
          rowKey={(record) => record.id}
          columns={columns}
          dataSource={data}
          loading={tableLoading}
          pagination={
            data?.length > 10 && {
              showSizeChanger: false,
              style: {
                marginBottom: 0,
              },
              current: currentPage,
              pageSize: 10,
              onChange: (page) => {
                setCurrentPage(page);
              },
            }
          }
          {...responsiveConfig.tableProps}
        />
      </Card>
    </div>
  );
};

export default TransationsTable;
