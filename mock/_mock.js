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
        id: 1551786819371569153,
        chainId: 1,
        vaultAddress: "0xd5C7A01E49ab534e31ABcf63bA5a394fF1E5EfAC",
        strategyAddress: "0xe481cddd4e9cb261177c19a3646c9697e295b36b",
        strategyName: "DForceLendUsdcStrategy",
        dailyWeightAsset: "1",
        weeklyWeightAsset: "21481496676394210366470",
        dailyUnrealizedProfit: "0",
        dailyUnrealizedApy: 0.0,
        weeklyUnrealizedProfit: "0",
        weeklyUnrealizedApy: 0.0,
        dailyRealizedProfit: "4692101188844851239",
        dailyRealizedApy: 0.07869591212074623,
        weeklyRealizedProfit: "26272323600574541889",
        weeklyRealizedApy: 0.06500535552687148,
        dailyOfficialApy: 0.07950557418086415,
        weeklyOfficialApy: 0.06480108096156134,
        scheduleTimestamp: 1658275146,
        scheduleTime: "2022-07-19 23:59:06",
        apyValidateTime: "2022-07-19",
      },
      {
        id: 1551787655095029762,
        chainId: 1,
        vaultAddress: "0xd5C7A01E49ab534e31ABcf63bA5a394fF1E5EfAC",
        strategyAddress: "0xe481cddd4e9cb261177c19a3646c9697e295b36b",
        strategyName: "DForceLendUsdcStrategy",
        dailyWeightAsset: "0",
        weeklyWeightAsset: "21599319772444715557027",
        dailyUnrealizedProfit: "0",
        dailyUnrealizedApy: 0.0,
        weeklyUnrealizedProfit: "0",
        weeklyUnrealizedApy: 0.0,
        dailyRealizedProfit: "4675697725819142641",
        dailyRealizedApy: 0.0782797388488361,
        weeklyRealizedProfit: "27562035728742865490",
        weeklyRealizedApy: 0.06852352987515942,
        dailyOfficialApy: 0.07810385679515267,
        weeklyOfficialApy: 0.06757047243873582,
        scheduleTimestamp: 1658361598,
        scheduleTime: "2022-07-20 23:59:58",
        apyValidateTime: "2022-07-20",
      },
      {
        id: 1551787669934477313,
        chainId: 1,
        vaultAddress: "0xd5C7A01E49ab534e31ABcf63bA5a394fF1E5EfAC",
        strategyAddress: "0xe481cddd4e9cb261177c19a3646c9697e295b36b",
        strategyName: "DForceLendUsdcStrategy",
        dailyWeightAsset: "0",
        weeklyWeightAsset: "21720564492205340150437",
        dailyUnrealizedProfit: "0",
        dailyUnrealizedApy: 0.0,
        weeklyUnrealizedProfit: "0",
        weeklyUnrealizedApy: 0.0,
        dailyRealizedProfit: "4498690515005092535",
        dailyRealizedApy: 0.07535621704674078,
        weeklyRealizedProfit: "28454246624683213087",
        weeklyRealizedApy: 0.07005471079916714,
        dailyOfficialApy: 0.07504691727862656,
        weeklyOfficialApy: 0.06935201643523459,
        scheduleTimestamp: 1658447991,
        scheduleTime: "2022-07-21 23:59:51",
        apyValidateTime: "2022-07-21",
      },
      {
        id: 1551787684677455873,
        chainId: 1,
        vaultAddress: "0xd5C7A01E49ab534e31ABcf63bA5a394fF1E5EfAC",
        strategyAddress: "0xe481cddd4e9cb261177c19a3646c9697e295b36b",
        strategyName: "DForceLendUsdcStrategy",
        dailyWeightAsset: "0",
        weeklyWeightAsset: "21839099665510140599008",
        dailyUnrealizedProfit: "0",
        dailyUnrealizedApy: 0.0,
        weeklyUnrealizedProfit: "0",
        weeklyUnrealizedApy: 0.0,
        dailyRealizedProfit: "4562121721201427978",
        dailyRealizedApy: 0.07643488708043833,
        weeklyRealizedProfit: "29408546160506242670",
        weeklyRealizedApy: 0.07177510960953293,
        dailyOfficialApy: 0.07611561632001199,
        weeklyOfficialApy: 0.0712897478711838,
        scheduleTimestamp: 1658534386,
        scheduleTime: "2022-07-22 23:59:46",
        apyValidateTime: "2022-07-22",
      },
      {
        id: 1551813279977295873,
        chainId: 1,
        vaultAddress: "0xd5C7A01E49ab534e31ABcf63bA5a394fF1E5EfAC",
        strategyAddress: "0xe481cddd4e9cb261177c19a3646c9697e295b36b",
        strategyName: "DForceLendUsdcStrategy",
        dailyWeightAsset: "0",
        weeklyWeightAsset: "21958797396065696430293",
        dailyUnrealizedProfit: "186810963131614300",
        dailyUnrealizedApy: 0.0030764216834486824,
        weeklyUnrealizedProfit: "186810963131614300",
        weeklyUnrealizedApy: 4.424776808675812e-4,
        dailyRealizedProfit: "4602873766000664230",
        dailyRealizedApy: 0.07714045256291868,
        weeklyRealizedProfit: "30382236176478220529",
        weeklyRealizedApy: 0.07454528035790209,
        dailyOfficialApy: 0.07995961425094819,
        weeklyOfficialApy: 0.07372100512210422,
        scheduleTimestamp: 1658620789,
        scheduleTime: "2022-07-23 23:59:49",
        apyValidateTime: "2022-07-23",
      },
      {
        id: 1551813293793333250,
        chainId: 1,
        vaultAddress: "0xd5C7A01E49ab534e31ABcf63bA5a394fF1E5EfAC",
        strategyAddress: "0xe481cddd4e9cb261177c19a3646c9697e295b36b",
        strategyName: "DForceLendUsdcStrategy",
        dailyWeightAsset: "0",
        weeklyWeightAsset: "22079227427567905568463",
        dailyUnrealizedProfit: "2480964292204992240",
        dailyUnrealizedApy: 0.041625338591851246,
        weeklyUnrealizedProfit: "2667775255336606540",
        weeklyUnrealizedApy: 0.006302421540292258,
        dailyRealizedProfit: "2115736982063474529",
        dailyRealizedApy: 0.03539082563331952,
        weeklyRealizedProfit: "28804422488134509396",
        weeklyRealizedApy: 0.07014554571868059,
        dailyOfficialApy: 0.07669539766245592,
        weeklyOfficialApy: 0.07552921103195454,
        scheduleTimestamp: 1658707193,
        scheduleTime: "2022-07-24 23:59:53",
        apyValidateTime: "2022-07-24",
      },
      {
        id: 1551813307647119362,
        chainId: 1,
        vaultAddress: "0xd5C7A01E49ab534e31ABcf63bA5a394fF1E5EfAC",
        strategyAddress: "0xe481cddd4e9cb261177c19a3646c9697e295b36b",
        strategyName: "DForceLendUsdcStrategy",
        dailyWeightAsset: "0",
        weeklyWeightAsset: "0",
        dailyUnrealizedProfit: "2449430034614748180",
        dailyUnrealizedApy: 0.04108679895919343,
        weeklyUnrealizedProfit: "5117205289951354720",
        weeklyUnrealizedApy: 0.012058549766831739,
        dailyRealizedProfit: "2115674861355945218",
        dailyRealizedApy: 0.03539082563331952,
        weeklyRealizedProfit: "27262896760290598370",
        weeklyRealizedApy: 0.06590921441295583,
        dailyOfficialApy: 0.05342000145260029,
        weeklyOfficialApy: 0.07408613482336746,
        scheduleTimestamp: 1658793594,
        scheduleTime: "2022-07-25 23:59:54",
        apyValidateTime: "2022-07-25",
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
