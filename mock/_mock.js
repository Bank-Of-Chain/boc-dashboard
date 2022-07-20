import moment from "moment";
import { Random } from "mockjs";
import map from "lodash/map";
import BigNumber from "bignumber.js";
// mock data
const visitData = [];
const beginDay = new Date().getTime();
const fakeY = [7, 5, 4, 2, 4, 7, 5, 6, 5, 9, 6, 3, 1, 5, 3, 6, 5];

for (let i = 0; i < fakeY.length; i += 1) {
  visitData.push({
    x: moment(new Date(beginDay + 1000 * 60 * 60 * 24 * i)).format(
      "YYYY-MM-DD"
    ),
    y: fakeY[i],
  });
}

const visitData2 = [];
const fakeY2 = [1, 6, 4, 8, 3, 7, 2];

for (let i = 0; i < fakeY2.length; i += 1) {
  visitData2.push({
    x: moment(new Date(beginDay + 1000 * 60 * 60 * 24 * i)).format(
      "YYYY-MM-DD"
    ),
    y: fakeY2[i],
  });
}

const salesData = [];

for (let i = 0; i < 12; i += 1) {
  salesData.push({
    x: `${i + 1}月`,
    y: Math.floor(Math.random() * 1000) + 200,
  });
}

const searchData = [];

for (let i = 0; i < 50; i += 1) {
  searchData.push({
    index: i + 1,
    keyword: `搜索关键词-${i}`,
    count: Math.floor(Math.random() * 1000),
    range: Math.floor(Math.random() * 100),
    status: Math.floor((Math.random() * 10) % 2),
  });
}

const salesTypeData = [
  {
    x: "家用电器",
    y: 4544,
  },
  {
    x: "食用酒水",
    y: 3321,
  },
  {
    x: "个护健康",
    y: 3113,
  },
  {
    x: "服饰箱包",
    y: 2341,
  },
  {
    x: "母婴产品",
    y: 1231,
  },
  {
    x: "其他",
    y: 1231,
  },
];
const salesTypeDataOnline = [
  {
    x: "家用电器",
    y: 244,
  },
  {
    x: "食用酒水",
    y: 321,
  },
  {
    x: "个护健康",
    y: 311,
  },
  {
    x: "服饰箱包",
    y: 41,
  },
  {
    x: "母婴产品",
    y: 121,
  },
  {
    x: "其他",
    y: 111,
  },
];
const salesTypeDataOffline = [
  {
    x: "家用电器",
    y: 99,
  },
  {
    x: "食用酒水",
    y: 188,
  },
  {
    x: "个护健康",
    y: 344,
  },
  {
    x: "服饰箱包",
    y: 255,
  },
  {
    x: "其他",
    y: 65,
  },
];
const offlineData = [];

for (let i = 0; i < 10; i += 1) {
  offlineData.push({
    name: `Stores ${i}`,
    cvr: Math.ceil(Math.random() * 9) / 10,
  });
}

const offlineChartData = [];

for (let i = 0; i < 20; i += 1) {
  const date = moment(new Date().getTime() + 1000 * 60 * 30 * i).format(
    "HH:mm"
  );
  offlineChartData.push({
    date,
    type: "客流量",
    value: Math.floor(Math.random() * 100) + 10,
  });
  offlineChartData.push({
    date,
    type: "支付笔数",
    value: Math.floor(Math.random() * 100) + 10,
  });
}

const radarOriginData = [
  {
    name: "个人",
    ref: 10,
    koubei: 8,
    output: 4,
    contribute: 5,
    hot: 7,
  },
  {
    name: "团队",
    ref: 3,
    koubei: 9,
    output: 6,
    contribute: 3,
    hot: 1,
  },
  {
    name: "部门",
    ref: 4,
    koubei: 1,
    output: 6,
    contribute: 5,
    hot: 7,
  },
];
const radarData = [];
const radarTitleMap = {
  ref: "引用",
  koubei: "口碑",
  output: "产量",
  contribute: "贡献",
  hot: "热度",
};
radarOriginData.forEach((item) => {
  Object.keys(item).forEach((key) => {
    if (key !== "name") {
      radarData.push({
        name: item.name,
        label: radarTitleMap[key],
        value: item[key],
      });
    }
  });
});
const getFakeChartData = {
  visitData,
  visitData2,
  salesData,
  searchData,
  offlineData,
  offlineChartData,
  salesTypeData,
  salesTypeDataOnline,
  salesTypeDataOffline,
  radarData,
};

const fakeChartData = (_, res) => {
  return res.json({
    data: getFakeChartData,
  });
};

/** */
const fakeToken = () => {
  return {
    id: Random.guid(),
    name: Random.word(5),
    symbol: Random.word(5),
    decimals: Random.pick([6, 18]),
  };
};

/** */
const fakeTokenDetail = () => {
  return {
    id: Random.pick([
      "0xdAC17F958D2ee523a2206206994597C13D831ec7",
      "0x55d398326f99059fF775485246999027B3197955",
      "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56",
      "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d",
      "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
      "0x8E870D67F660D95d5be530380D0eC0bd388289E1",
      "0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3",
    ]),
    token: fakeToken(),
    amount: Random.natural(),
    usdtAmount: Random.natural(),
    usdtPrice: fakeUsdtPrice(),
    usdtInUSD: Random.natural(),
  };
};
/** */
const fakeVaultHourlyData = () => {
  return {
    id: Random.guid(),
    pricePerShare: fakeTokenDetail(),
    netInflowFunds: fakeTokenDetail(),
  };
};
/** */
const fakeVaultDailyData = () => {
  return {
    id: Random.guid(),
    newHolderCount: Random.natural(),
    tvl: fakeTokenDetail(),
    pricePerShare: fakeTokenDetail(),
    // newHolders: map(Random.range(Random.natural(5, 20)), Random.guid),
    totalProfit: fakeTokenDetail(),
  };
};

/** */
const fakeStrategyReport = () => {
  return {
    id: Random.guid(),
    // strategy: fakeStrategy(),
    profit: fakeTokenDetail(),
    timestamp: Random.date("T"),
  };
};

/** */
const fakeCalAPY = () => {
  return {
    id: Random.guid(),
    strategy: fakeStrategy(),
    assetsBefore: Random.natural(),
    assetsDelta: Random.natural(),
    timeDelta: Random.date("T"),
    timestamp: Random.date("T"),
  };
};
/** */
const fakeStrategy = () => {
  return {
    id: Random.guid(),
    name: Random.word(10),
    // vault: fakeVault(),
    protocol: fakeProtocol(),
    addToVault: Random.boolean(),
    minReportDelay: Random.natural(),
    maxReportDelay: Random.natural(),
    profitFactor: Random.natural(),
    underlyingTokens: map(Random.range(Random.natural(1, 4)), fakeTokenDetail),
    debt: fakeTokenDetail(),
    depositedAssets: fakeTokenDetail(),
    reports: map(Random.range(Random.natural(5, 10)), fakeStrategyReport),
    lastReportTime: Random.natural(),
  };
};

/** */
const fakeAccount = () => {
  return {
    id: Random.guid(),
    depositedAssets: Random.natural(),
    accumulatedProfit: Random.natural(),
  };
};

/** */
const fakeUsdtPrice = () => {
  return {
    id: Random.guid(),
    price: Random.natural(),
  };
};
/** */
const fakeVault = () => {
  return {
    id: Random.guid(),
    decimals: Random.pick([6, 18]),
    strategies: map(Random.range(Random.natural(5, 20)), fakeStrategy),
    profitFeePercent: 0,
    emergencyShutdown: Random.boolean(),
    adjustPosition: Random.boolean(),
    pricePerShare: fakeTokenDetail(),
    tvl: fakeTokenDetail(),
    tokenDetails: map(Random.range(Random.natural(5, 20)), fakeTokenDetail),
    holderCount: Random.natural(),
    holders: map(Random.range(Random.natural(5, 20)), fakeAccount),
  };
};

/** */
const fakeProtocol = () => {
  return {
    id: Random.pick(["dodo", "convex", "uniswap", "uniswapv3"]),
    totalDebt: fakeTokenDetail(),
    // strategies: map(Random.range(Random.natural(5, 20)), fakeStrategy)
  };
};

const fakeImportantTxn = () => {
  return {
    id: Random.guid(),
    method: Random.pick(["Deposit", "Withdraw"]),
    address: Random.guid(),
    tokenDetails: map(Random.range(Random.natural(5, 20)), fakeTokenDetail),
    totalValueInUSD: Random.natural(),
    from: Random.guid(),
    timestamp: Random.date("T"),
  };
};

export default {
  "GET  /api/fake_analysis_chart_data": fakeChartData,
  "GET  /api/apys": (_, res) =>
    res.json([
      {
        id: 1549388226717253634,
        chainId: 1,
        vaultAddress: "0xDae16f755941cbC0C9D240233a6F581d1734DaA2",
        strategyAddress: "0xb9ac4abd48f9c831a78cea7da3503626a1a0e6d7",
        strategyName: "UniswapV2StEthWEthStrategy",
        dailyWeightAsset: "509256550714565610",
        weeklyWeightAsset: "592027537049640639",
        dailyUnrealizedProfit: "0",
        dailyUnrealizedApy: 0,
        weeklyUnrealizedProfit: "0",
        weeklyUnrealizedApy: 0,
        dailyRealizedProfit: "39968236260941",
        dailyRealizedApy: 0.028641173409086118,
        weeklyRealizedProfit: "704010601635198",
        weeklyRealizedApy: 0.5429593376459967,
        dailyOfficialApy: 0.08955879126438195,
        weeklyOfficialApy: 0.09833068906109066,
        scheduleTimestamp: 1657317648,
        scheduleTime: "2022-07-08 22:00:48",
        apyValidateTime: "2022-07-08",
      },
      {
        id: 1549388898288238594,
        chainId: 1,
        vaultAddress: "0xDae16f755941cbC0C9D240233a6F581d1734DaA2",
        strategyAddress: "0xb9ac4abd48f9c831a78cea7da3503626a1a0e6d7",
        strategyName: "UniswapV2StEthWEthStrategy",
        dailyWeightAsset: "2500000062702945276",
        weeklyWeightAsset: "924359290317545096",
        dailyUnrealizedProfit: "0",
        dailyUnrealizedApy: 0,
        weeklyUnrealizedProfit: "0",
        weeklyUnrealizedApy: 0,
        dailyRealizedProfit: "288191855440162",
        dailyRealizedApy: 0.04616339365187416,
        weeklyRealizedProfit: "594302664665447",
        weeklyRealizedApy: 0.2935431247764817,
        dailyOfficialApy: 0.03925107579085928,
        weeklyOfficialApy: 0.07878180160775128,
        scheduleTimestamp: 1657486801,
        scheduleTime: "2022-07-10 21:00:01",
        apyValidateTime: "2022-07-10",
      },
      {
        id: 1549388925844815873,
        chainId: 1,
        vaultAddress: "0xDae16f755941cbC0C9D240233a6F581d1734DaA2",
        strategyAddress: "0xb9ac4abd48f9c831a78cea7da3503626a1a0e6d7",
        strategyName: "UniswapV2StEthWEthStrategy",
        dailyWeightAsset: "2500268683910446305",
        weeklyWeightAsset: "1406744906042719721",
        dailyUnrealizedProfit: "0",
        dailyUnrealizedApy: 0,
        weeklyUnrealizedProfit: "0",
        weeklyUnrealizedApy: 0,
        dailyRealizedProfit: "248687520413841",
        dailyRealizedApy: 0.036303215680644874,
        weeklyRealizedProfit: "721929015121974",
        weeklyRealizedApy: 0.20594104759447607,
        dailyOfficialApy: 0.060822613251501165,
        weeklyOfficialApy: 0.0768685465434975,
        scheduleTimestamp: 1657576827,
        scheduleTime: "2022-07-11 22:00:27",
        apyValidateTime: "2022-07-11",
      },
      {
        id: 1549389220331094017,
        chainId: 1,
        vaultAddress: "0xDae16f755941cbC0C9D240233a6F581d1734DaA2",
        strategyAddress: "0xb9ac4abd48f9c831a78cea7da3503626a1a0e6d7",
        strategyName: "UniswapV2StEthWEthStrategy",
        dailyWeightAsset: "2501644154152611969",
        weeklyWeightAsset: "1589228114061035095",
        dailyUnrealizedProfit: "0",
        dailyUnrealizedApy: 0,
        weeklyUnrealizedProfit: "0",
        weeklyUnrealizedApy: 0,
        dailyRealizedProfit: "384382700854749",
        dailyRealizedApy: 0.05609078107823939,
        weeklyRealizedProfit: "970616535535815",
        weeklyRealizedApy: 0.2496776246202872,
        dailyOfficialApy: 0.058551646229341905,
        weeklyOfficialApy: 0.07242044181832008,
        scheduleTimestamp: 1657659600,
        scheduleTime: "2022-07-12 21:00:00",
        apyValidateTime: "2022-07-12",
      },
      {
        id: 1549389240912543746,
        chainId: 1,
        vaultAddress: "0xDae16f755941cbC0C9D240233a6F581d1734DaA2",
        strategyAddress: "0xb9ac4abd48f9c831a78cea7da3503626a1a0e6d7",
        strategyName: "UniswapV2StEthWEthStrategy",
        dailyWeightAsset: "2501141985153088413",
        weeklyWeightAsset: "1921491151667261036",
        dailyUnrealizedProfit: "0",
        dailyUnrealizedApy: 0,
        weeklyUnrealizedProfit: "0",
        weeklyUnrealizedApy: 0,
        dailyRealizedProfit: "596171176807975",
        dailyRealizedApy: 0.08700024321231203,
        weeklyRealizedProfit: "1168186230071376",
        weeklyRealizedApy: 0.24836504946396842,
        dailyOfficialApy: 0.08191678127047555,
        weeklyOfficialApy: 0.0639011076423317,
        scheduleTimestamp: 1657746001,
        scheduleTime: "2022-07-13 21:00:01",
        apyValidateTime: "2022-07-13",
      },
      {
        id: 1549389264014770178,
        chainId: 1,
        vaultAddress: "0xDae16f755941cbC0C9D240233a6F581d1734DaA2",
        strategyAddress: "0xb9ac4abd48f9c831a78cea7da3503626a1a0e6d7",
        strategyName: "UniswapV2StEthWEthStrategy",
        dailyWeightAsset: "2490808057004251012",
        weeklyWeightAsset: "2600623898727581717",
        dailyUnrealizedProfit: "0",
        dailyUnrealizedApy: 0,
        weeklyUnrealizedProfit: "0",
        weeklyUnrealizedApy: 0,
        dailyRealizedProfit: "175456511927438",
        dailyRealizedApy: 0.025711780220401215,
        weeklyRealizedProfit: "1557401489777668",
        weeklyRealizedApy: 0.24423687777493397,
        dailyOfficialApy: 0,
        weeklyOfficialApy: 0,
        scheduleTimestamp: 1657836503,
        scheduleTime: "2022-07-14 22:08:23",
        apyValidateTime: "2022-07-14",
      },
    ]),
  "GET  /api/vault-1": (_, res) =>
    res.json({
      data: fakeVault(),
    }),
  "GET  /api/vault-2": (_, res) =>
    res.json({
      data: fakeVaultDailyData(),
    }),
  "GET  /api/vault-3": (_, res) =>
    res.json({
      data: fakeVaultHourlyData(),
    }),
  "GET  /api/protocol-3": (_, res) =>
    res.json({
      data: fakeProtocol(),
    }),
  "GET /api/strategy-3": (_, res) =>
    res.json({
      data: fakeStrategy(),
    }),
  "GET  /api/txn-1": (_, res) =>
    res.json({
      data: map(Random.range(Random.natural(5, 30)), fakeImportantTxn),
    }),
  "GET /apy/vault_estimate_apy": (_, res) =>
    res.json({
      content: [
        {
          apy: "11.35",
          date: "2022-05-17",
        },
        {
          apy: "12.35",
          date: "2022-05-18",
        },
        {
          apy: "13.35",
          date: "2022-05-19",
        },
        {
          apy: "14.35",
          date: "2022-05-20",
        },
        {
          apy: "14.05",
          date: "2022-05-21",
        },
        {
          apy: "13.35",
          date: "2022-05-22",
        },
      ],
    }),
  "GET /chains/137/vaults/0xd3feAe6c4fdfDE73Bd2fE99c8fE6944904DAA68A/strategy_apy":
    (_, res) =>
      res.json({
        content: [
          {
            type: "estimate",
            apy: "11.35",
            date: moment().utcOffset(0).startOf("day").valueOf() / 1000,
          },
          {
            type: "estimate",
            apy: "11.35",
            date:
              moment().utcOffset(0).startOf("day").add(1, "days").valueOf() /
              1000,
          },
          {
            type: "estimate",
            apy: "12.35",
            date:
              moment().utcOffset(0).startOf("day").add(2, "days").valueOf() /
              1000,
          },
          {
            type: "estimate",
            apy: "13.35",
            date:
              moment().utcOffset(0).startOf("day").add(3, "days").valueOf() /
              1000,
          },
          {
            type: "estimate",
            apy: "14.35",
            date:
              moment().utcOffset(0).startOf("day").add(4, "days").valueOf() /
              1000,
          },
          {
            type: "estimate",
            apy: "14.05",
            date:
              moment().utcOffset(0).startOf("day").add(5, "days").valueOf() /
              1000,
          },
          {
            type: "estimate",
            apy: "13.35",
            date:
              moment().utcOffset(0).startOf("day").add(6, "days").valueOf() /
              1000,
          },
        ],
      }),
};
