import React, { Suspense, useState, useEffect } from "react";
import { Col, Row, Card, Image, Descriptions, Spin } from "antd";
import { GridContent } from "@ant-design/pro-layout";
import ReportTable from "./components/ReportTable";
import { history, useModel } from "umi";
import { LeftOutlined } from "@ant-design/icons";
import { LineEchart } from "@/components/echarts";
import multipleLine from "@/components/echarts/options/line/multipleLine";

// === Constants === //
import {
  USDI_STRATEGIES_MAP,
  ETHI_STRATEGIES_MAP,
} from "@/constants/strategies";
import { VAULT_TYPE, TOKEN_DISPLAY_DECIMALS } from "@/constants/vault";
import { ETHI_DISPLAY_DECIMALS } from "@/constants/ethi";

// === Components === //
import CoinSuperPosition from "@/components/CoinSuperPosition";
import StrategyApyTable from "./components/StrategyApyTable";
import { useDeviceType, DEVICE_TYPE } from "@/components/Container/Container";

// === Utils === //
import { isEmpty, map, noop, reduce, compact } from "lodash";
import { toFixed } from "@/utils/number-format";

import moment from "moment";
import _find from "lodash/find";
import BN from "bignumber.js";
import { get, isNil, keyBy, size, filter } from "lodash";
import { formatToUTC0 } from "@/utils/date";

// === Services === //
import {
  getStrategyApysOffChain,
  getBaseApyByPage,
  getStrategyDetails,
  getStrategyEstimateApys,
} from "@/services/api-service";

// === Styles === //
import styles from "./style.less";

const Strategy = (props) => {
  const { id, ori = false, vault } = props?.location?.query;
  const [loading, setLoading] = useState(false);
  const [strategy, setStrategy] = useState({});
  // 用于存放所有的apy数据，取代上面的apys和offchainApys
  const [apyArray, setApyArray] = useState([]);
  const { initialState } = useModel("@@initialState");
  const deviceType = useDeviceType();
  const unit = {
    [VAULT_TYPE.USDi]: "USD",
    [VAULT_TYPE.ETHi]: "ETH",
  }[initialState.vault];

  // boc-service fixed the number to 6
  const decimals = BN(1e18);

  const strategiesMap = {
    [VAULT_TYPE.USDi]: USDI_STRATEGIES_MAP,
    [VAULT_TYPE.ETHi]: ETHI_STRATEGIES_MAP,
  }[initialState.vault];

  const displayDecimals = {
    [VAULT_TYPE.USDi]: TOKEN_DISPLAY_DECIMALS,
    [VAULT_TYPE.ETHi]: ETHI_DISPLAY_DECIMALS,
  }[initialState.vault];

  useEffect(() => {
    setLoading(true);
    getStrategyDetails(initialState.chain, initialState.vaultAddress, 0, 100)
      .then((resp) => {
        const strategy = _find(
          resp.content,
          (item) => item.strategyAddress === id
        );
        setStrategy(strategy);
      })
      .catch(noop)
      .finally(() => {
        setLoading(false);
      });
    // eslint-disable-next-line
  }, [id]);

  useEffect(() => {
    if (isEmpty(strategy?.strategyName)) return;
    Promise.all([
      getBaseApyByPage(
        {
          chainId: initialState.chain,
          vaultAddress: initialState.vaultAddress,
          strategyAddress: strategy?.strategyAddress,
          sort: "schedule_timestamp desc",
        },
        0,
        200
      ).catch(() => {}),
      getStrategyApysOffChain(
        {
          chainId: initialState.chain,
          strategyName: strategy?.strategyName,
          sort: "fetch_time desc",
        },
        0,
        200
      ).catch(() => {}),
      getStrategyEstimateApys(
        initialState.chain,
        initialState.vaultAddress,
        strategy?.strategyName
      ).catch(() => {}),
    ]).then(([apys = { content: [] }, offChainApys, unRealizeApys]) => {
      const startMoment = moment()
        .utcOffset(0)
        .subtract(186, "day")
        .startOf("day");
      const calcArray = reduce(
        // 往前推66天，往后预估7天
        new Array(186 + 7),
        (rs) => {
          const currentMoment = startMoment.subtract(-1, "day");
          rs.push(currentMoment.format("yyyy-MM-DD"));
          return rs;
        },
        []
      );

      // 因为weeklyApy只展示到昨天的，所以需要将昨天的点，作为unrealize线的第一个点，这样weeklyapy和unrealize的线才是连贯的
      let unRealizeApyItems = unRealizeApys?.content;
      if (
        apys.content.length > 0 &&
        unRealizeApyItems.length > 0 &&
        moment(apys.content[0].fetchTimestamp * 1000).isBefore(
          unRealizeApyItems[unRealizeApyItems.length - 1].timestamp * 1000
        )
      ) {
        const firstItem = {
          apy: apys.content[0].lpApy,
          timestamp: apys.content[0].fetchTimestamp,
        };
        unRealizeApyItems = [firstItem, ...unRealizeApyItems];
      }
      const offChainApyMap = keyBy(
        map(offChainApys.content, (i) => {
          return {
            value: 100 * i.apy,
            officialApy: (i.apy * 100).toFixed(2),
            originApy: (i.originApy * 100).toFixed(2),
            date: formatToUTC0(i.fetchTime * 1000, "yyyy-MM-DD"),
          };
        }),
        "date"
      );
      const extentApyMap = keyBy(
        map(apys.content, (i) => {
          return {
            realizedApy: (i.realizedApy?.value * 100).toFixed(2),
            unrealizedApy: (i.unrealizedApy?.value * 100).toFixed(2),
            expectedApy: (i.verifiedApy * 100).toFixed(2),
            dailyVerifiedApy: (i.dailyVerifiedApy * 100).toFixed(2),
            date: formatToUTC0(i.scheduleTimestamp * 1000, "yyyy-MM-DD"),
          };
        }),
        "date"
      );

      const nextApyArray = map(calcArray, (i) => {
        const { officialApy, originApy } = get(offChainApyMap, i, {
          officialApy: null,
          originApy: null,
        });
        const { expectedApy, realizedApy, unrealizedApy, dailyVerifiedApy } =
          get(extentApyMap, i, {
            expectedApy: null,
            unrealizedApy: null,
            realizedApy: null,
            dailyVerifiedApy: null,
          });
        return {
          date: i,
          originApy,
          value: expectedApy,
          officialApy,
          realizedApy,
          unrealizedApy,
          dailyVerifiedApy,
        };
      });
      setApyArray(nextApyArray.slice(-67));
    });
  }, [strategy, strategy?.strategyName]);

  const estimateArray = map(apyArray, "un_realize_apy");
  const lengndData = ["Official APY", "Verified APY"];
  const data1 = map(apyArray, (i) => {
    return {
      value: i.officialApy,
      unit: "%",
    };
  });
  const data2 = map(apyArray, "value");
  const data = [
    {
      seriesName: "Official APY",
      seriesData: data1,
      showSymbol: size(filter(data1, (i) => !isNil(i))) === 1,
    },
    {
      seriesName: "Verified APY",
      seriesData: apyArray,
      showSymbol: size(filter(data2, (i) => !isNil(i))) === 1,
    },
  ];
  if (ori) {
    const data3 = map(apyArray, "originApy");
    lengndData.push("Official Daily APY");
    data.push({
      seriesName: "Official Daily APY",
      seriesData: map(data3, (i) => {
        return { value: i };
      }),
      showSymbol: size(filter(data3, (i) => !isNil(i))) === 1,
    });

    const data4 = map(apyArray, "dailyVerifiedApy");
    lengndData.push("Verified Daily APY");
    data.push({
      seriesName: "Verified Daily APY",
      seriesData: map(data4, (i) => {
        return { value: i };
      }),
      showSymbol: size(filter(data4, (i) => !isNil(i))) === 1,
    });
  }
  // TODO: 由于后端接口暂时未上，所以前端选择性的展示unrealize apy
  if (!isEmpty(compact(estimateArray))) {
    lengndData.push("Estimated Weekly APY");
    data.push({
      seriesName: "Estimated Weekly APY",
      seriesData: estimateArray,
    });
  }
  let obj = {
    legend: {
      data: lengndData,
      textStyle: { color: "#fff" },
    },
    xAxisData: map(apyArray, "date"),
    data,
  };
  const option = multipleLine(obj);
  option.color = [
    "#A68EFE",
    "#2ec7c9",
    "#ffb980",
    "#d87a80",
    "#e5cf0d",
    "#97b552",
    "#8d98b3",
    "#07a2a4",
    "#95706d",
    "#dc69aa",
  ];
  option.series.forEach((serie, index) => {
    serie.connectNulls = true;
    serie.z = option.series.length - index;
    if (serie.name === "Expected APY") {
      serie.lineStyle = {
        width: 5,
        type: "dotted",
      };
    }
  });
  option.xAxis.data = option.xAxis.data.map((item) => `${item} (UTC)`);
  option.xAxis.axisLabel = {
    formatter: (value) => value.replace(" (UTC)", ""),
  };
  option.xAxis.axisTick = {
    alignWithLabel: true,
  };
  option.yAxis.splitLine = {
    lineStyle: {
      color: "black",
    },
  };
  option.tooltip = {
    ...option.tooltip,
    formatter: function (params, _ticket, _callback) {
      if (params instanceof Array) {
        if (params.length) {
          const unit = params[0]?.data?.unit || "";
          let message = "";
          message += `${params[0].axisValueLabel}`;
          params.forEach((param) => {
            message += `<br/>${param.marker}${param.seriesName}: ${
              isNil(param.value) ? "-" : param.value + unit
            }`;
            if (param?.seriesName === "Verified APY") {
              const realizedApy = param?.data?.realizedApy;
              const unrealizedApy = param?.data?.unrealizedApy;
              const realizedApyText = `${
                isNil(realizedApy) ? "-" : realizedApy + unit
              }`;
              const unrealizedApyText = `${
                isNil(unrealizedApy) ? "-" : unrealizedApy + unit
              }`;
              message += `<br/><span style=\"display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:#dc69aa;\"></span>Realized APY: ${realizedApyText}`;
              message += `<br/><span style=\"display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:#95706d;\"></span>UnRealized APY: ${unrealizedApyText}`;
            }
          });

          return message;
        } else {
          return null;
        }
      } else {
        let message = "";
        message += `${params[0].axisValueLabel}`;
        message += `<br/>${params.marker}${params.seriesName}: ${params.value}${
          params.data.unit || ""
        }`;
        return message;
      }
    },
  };
  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Spin size="large" />
      </div>
    );
  }
  if (!initialState.chain || isEmpty(strategy)) return null;

  const { underlyingTokens, totalAssetBaseCurrent } = strategy;

  const smallSizeProps = {
    cardProps: {
      size: "small",
    },
    descriptionProps: {
      size: "small",
    },
  };
  const infoResponsiveConfig = {
    [DEVICE_TYPE.Desktop]: {},
    [DEVICE_TYPE.Tablet]: smallSizeProps,
    [DEVICE_TYPE.Mobile]: smallSizeProps,
  }[deviceType];

  const chartStyle = {
    padding: "0 24px",
    height: 400,
  };
  const chartResponsiveConfig = {
    [DEVICE_TYPE.Desktop]: {
      chartStyle,
    },
    [DEVICE_TYPE.Tablet]: {
      cardProps: {
        size: "small",
      },
      chartStyle,
    },
    [DEVICE_TYPE.Mobile]: {
      cardProps: {
        size: "small",
      },
      chartStyle: {
        ...chartStyle,
        height: 280,
      },
    },
  }[deviceType];

  return (
    <GridContent>
      <Suspense fallback={null}>
        <Card
          title={<LeftOutlined onClick={() => history.push("/")} />}
          bordered={false}
          {...infoResponsiveConfig.cardProps}
        >
          <Row justify="space-around">
            <Col
              xl={8}
              lg={8}
              md={8}
              sm={22}
              xs={22}
              style={{ margin: "0 auto 16px" }}
            >
              <Image
                preview={false}
                width={200}
                style={{ backgroundColor: "#fff", borderRadius: "50%" }}
                src={`${IMAGE_ROOT}/images/amms/${
                  strategiesMap[initialState.chain][strategy?.protocol]
                }.png`}
                fallback={`${IMAGE_ROOT}/default.png`}
              />
            </Col>
            <Col xl={10} lg={10} md={10} sm={22} xs={22}>
              <Descriptions
                column={1}
                title={<span style={{ color: "#fff" }}>Base Info</span>}
                style={{
                  marginBottom: 32,
                }}
                labelStyle={{ color: "#fff" }}
                contentStyle={{ color: "#fff" }}
                {...infoResponsiveConfig.descriptionProps}
              >
                <Descriptions.Item label="Name">
                  <a
                    target={"_blank"}
                    rel="noreferrer"
                    href={`${CHAIN_BROWSER_URL[initialState.chain]}/address/${
                      strategy.strategyAddress
                    }`}
                  >
                    {strategy.strategyName}
                  </a>
                </Descriptions.Item>
                <Descriptions.Item label="Underlying Token">
                  {!isEmpty(underlyingTokens) && (
                    <CoinSuperPosition array={underlyingTokens.split(",")} />
                  )}
                </Descriptions.Item>
                <Descriptions.Item label="Asset Value">
                  {toFixed(totalAssetBaseCurrent, decimals, displayDecimals) +
                    ` ${unit}`}
                </Descriptions.Item>
                <Descriptions.Item label="Status">Active</Descriptions.Item>
              </Descriptions>
            </Col>
          </Row>
        </Card>
      </Suspense>
      <Suspense fallback={null}>
        <Card
          loading={loading}
          title="Apy (%)"
          className={styles.offlineCard}
          bordered={false}
          style={{
            marginTop: 32,
          }}
          {...chartResponsiveConfig.cardProps}
        >
          <div style={chartResponsiveConfig.chartStyle}>
            <LineEchart
              option={option}
              style={{ height: "100%", width: "100%" }}
            />
          </div>
        </Card>
      </Suspense>
      <Suspense fallback={null}>
        <StrategyApyTable
          unit={vault === "ethi" ? "ETH" : "USD"}
          strategyName={strategy?.strategyName}
          strategyAddress={strategy?.strategyAddress}
          loading={loading}
        />
      </Suspense>
      <Suspense fallback={null}>
        <ReportTable strategyName={strategy?.strategyName} loading={loading} />
      </Suspense>
    </GridContent>
  );
};

export default Strategy;
