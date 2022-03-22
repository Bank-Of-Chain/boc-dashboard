import { getClient, ethClient } from '../../src/apollo/client';
import { gql } from '@apollo/client';
import { request } from 'umi';
import { get, isEmpty } from 'lodash';
export const fetchData = async () => {
  const postBody = {
    query: `{
      calAPYs(where: {
      strategyAddress: \ "0x4717eaa5da97f11bda3a3f021a20fd8cb72eab64\"
      timestamp_gt: 1640855520
    }) {
      assetsBefore
      assetsDelta
      timeDelta
      timestamp
    }
    }`,
    variables: null,
  };
  const url = 'https://api.thegraph.com/subgraphs/name/naruduo/mysubgraph';
  return await request(url, {
    data: postBody,
    method: 'post',
  });
};

export function getDaysAgoTimestamp(daysAgo) {
  const currentTimestamp = new Date(new Date().setHours(0, 0, 0, 0));
  const daysAgoTimestamp = currentTimestamp.getTime() /1000 - daysAgo * 24*3600;
  return daysAgoTimestamp;
}

const VAULT_DETAIL_QUERY = `
query($sevenDaysAgoTimestamp: BigInt) {
  vaults(first: 1) {
    id
    decimals
    emergencyShutdown
    adjustPosition
    pricePerShare
    tvl
    totalShares
    usdtPrice
    holderCount
    totalProfit
    trackedAssetsValue
    strategies(
      orderBy: debt,
      orderDirection: desc
      where: {addToVault: true}
    ) {
      id
      name
      protocol {
        id
        totalDebt
        usdtPrice
      }
      underlyingTokens {
        token {
          id
          symbol
        }
      }
      addToVault
      debt
      depositedAssets
      usdtPrice
      reports(where: {
        timestamp_gt: $sevenDaysAgoTimestamp
      }) {
        profit
        usdtPrice
      }
    }
  }
}
`;
export const getVaultDetails = async () => {
  const client = getClient()
  if (isEmpty(client)) return
  const {
    data
  } = await client.query({
    query: gql(VAULT_DETAIL_QUERY),
    variables: {
      sevenDaysAgoTimestamp: getDaysAgoTimestamp(7),
    },
  });
  return {
    data: data.vaults[0],
  };
};

const VAULT_SUMMARY_DATA = `
query {
  vaults {
    id
    decimals
    tvl
    totalShares
    pricePerShare
  }
}
`
export const getVaultSummaryData = async () => {
  const client = getClient()
  if (isEmpty(client)) return
  const {
    data
  } = await client.query({
    query: gql(VAULT_SUMMARY_DATA),
  })
  return {
    data: data.vaults[0],
  }
}

const VAULT_DAILY_QUERY = `
query($beginDayTimestamp: BigInt) {
  vaultDailyDatas (where: {
    id_gt: $beginDayTimestamp
  }) {
    id
    holderCount
    newHolderCount
    tvl
    totalShares
    pricePerShare
    unlockedPricePerShare
    totalProfit
    usdtPrice
    lockedProfitDegradationTimestamp
  }
}
`;
// 2月8日 0点时间戳
const timeStart = 1644249600;
export const getVaultDailyData = async (day) => {
  const client = getClient()
  if (isEmpty(client)) return

  let nextStartTimestamp = getDaysAgoTimestamp(day)
  if (client === ethClient) {
    // eth链 不统计2月7日前的数据
    if (nextStartTimestamp < timeStart) {
      nextStartTimestamp = timeStart
    }
  }
  return await client
    .query({
      query: gql(VAULT_DAILY_QUERY),
      variables: {
        beginDayTimestamp: nextStartTimestamp,
      },
    })
    .then((resp) => get(resp, 'data.vaultDailyDatas'));
};

const VAULT_TODAY_QUERY = `
query($todayTimestamp: BigInt) {
  vaultDailyData (id: $todayTimestamp) {
    id
    newHolderCount
    tvl
    totalShares
    pricePerShare
    totalProfit
    usdtPrice
  }
}
`;
export const getVaultTodayData = async () => {
  const client = getClient()
  if (isEmpty(client)) return
  const currentTimestamp = Math.floor(Date.parse(new Date()) / 1000);
  const todayTimestamp = currentTimestamp - (currentTimestamp % 86400);
  const {
    data
  } = await client.query({
    query: gql(VAULT_TODAY_QUERY),
    variables: {
      todayTimestamp,
    },
  });
  return {
    data: data.vaultDailyData,
  };
};

const VAULT_HOURLY_QUERY = `
query($beginHourTimestamp: BigInt) {
  vaultHourlyDatas (where: {
    id_gt: $beginHourTimestamp
  }) {
    id
    tvl
    totalShares
    pricePerShare
    usdtPrice
  }
}
`;
export const getVaultHourlyData = async (day) => {
  const client = getClient()
  if (isEmpty(client)) return
  return await client
    .query({
      query: gql(VAULT_HOURLY_QUERY),
      variables: {
        beginHourTimestamp: getDaysAgoTimestamp(day),
      },
    })
    .then((resp) => get(resp, 'data.vaultHourlyDatas'));
};

export const getProtocols = async () => {
  // TODO: 待实现
  const url = '/api/protocol-3';
  return await request(url);
};

const STRATEGY__PAGINATION_QUERY = `
query($sevenDaysAgoTimestamp: BigInt, $pageSize: Int, $skipNumber: Int) {
  strategies(
    orderBy: debt,
    orderDirection: desc,
    where: {addToVault: true},
    first: $pageSize,
    skip: $skipNumber
  ) {
    id
    name
    protocol {
      id
      totalDebt
      usdtPrice
    }
    underlyingTokens {
      token {
        id
        symbol
      }
    }
    addToVault
    debt
    depositedAssets
    usdtPrice
    reports(where: {
      timestamp_gt: $sevenDaysAgoTimestamp
    }) {
      profit
      usdtPrice
    }
  }
}
`
export const queryStrategies = async (pageNumber, pageSize) => {
  const skipNumber = (pageNumber - 1) * pageSize
  const client = getClient()
  if (isEmpty(client)) return
  return await client.query({
    query: gql(STRATEGY__PAGINATION_QUERY),
    variables: {
      beginHourTimestamp: getDaysAgoTimestamp(day),
      pageSize,
      skipNumber
    }
  })
}

const STRATEGY_DETAIL_QUERY = `
query($strategyAddress: Bytes) {
  strategy(id: $strategyAddress) {
    id
    name
    protocol {
      id
    }
    underlyingTokens {
      token {
        id
        symbol
      }
    }
    addToVault
    debt
    depositedAssets
    usdtPrice
    reports (orderBy: timestamp, orderDirection: desc) {
      id
      profit
      nowStrategyTotalDebt
      usdtPrice
      timestamp
    }
    lastReportTime
  }
}
`;
export const getStrategyById = async (strategyAddress) => {
  const client = getClient()
  if (isEmpty(client)) return
  return await client
    .query({
      query: gql(STRATEGY_DETAIL_QUERY),
      variables: {
        strategyAddress,
      },
    })
    .then((data) => data.data.strategy);
};

const TXN_QUERY = `
query($relatedContractAddress: Bytes) {
  importantEvents(
    orderBy: timestamp,
    orderDirection: desc,
    where: {
      address: $relatedContractAddress
    }) {
    id
    method
    from
    address
    shares
    shareValue
    timestamp
  }
}
`;
export const getTransations = async (relatedContractAddress) => {
  if (isEmpty(relatedContractAddress)) return;
  const client = getClient()
  if (isEmpty(client)) return
  return await client
    .query({
      query: gql(TXN_QUERY),
      variables: {
        relatedContractAddress,
      },
    })
    .then((data) => data.data.importantEvents);
};

const TXN_PAGINATION_QUERY = `
query($relatedContractAddress: Bytes, $pageSize: Int, $skipNumber: Int) {
  importantEvents(
    orderBy: timestamp,
    orderDirection: desc,
    where: {
      address: $relatedContractAddress
    },
    first: $pageSize,
    skip: $skipNumber) {
    id
    method
    from
    address
    shares
    shareValue
    timestamp
  }
}
`;
export const queryTransactions = async (relatedContractAddress, pageNumber, pageSize) => {
  const skipNumber = (pageNumber - 1) * pageSize
  const client = getClient()
  if (isEmpty(client)) return
  return await client
    .query({
      query: gql(TXN_PAGINATION_QUERY),
      variables: {
        relatedContractAddress,
        skipNumber,
        pageSize
      }
    })
}

const PAST_LATEST_VAULT_DAILY_DATA = `
query($endDayTimestamp: ID) {
  vaultDailyDatas(
    first: 1,
    orderBy: id,
    orderDirection: desc,
    where: {
    	id_lte: $endDayTimestamp
  }) {
    id
    holderCount
    newHolderCount
    tvl
    pricePerShare
    unlockedPricePerShare
    totalProfit
    usdtPrice
    lockedProfitDegradationTimestamp
  }
}`;
export const getPastLatestVaultDailyData = async (endDayTimestamp) => {
  const client = getClient()
  if (isEmpty(client)) return
  return await client.query({
    query: gql(PAST_LATEST_VAULT_DAILY_DATA),
    variables: {
      endDayTimestamp,
    },
  });
};

const REPORT_PAGINATION_QUERY = `
query($pageSize: Int, $skipNumber: Int) {
  reports (
    orderBy: timestamp,
    orderDirection: desc,
    first: $pageSize,
    skip: $skipNumber
  ) {
    id
    profit
    nowStrategyTotalDebt
    usdtPrice
    timestamp
  }
}
`
export const queryReports = async (pageNumber, pageSize) => {
  const skipNumber = (pageNumber - 1) * pageSize
  const client = getClient()
  if (isEmpty(client)) return
  return await client.query({
    query: gql(REPORT_PAGINATION_QUERY),
    variables: {
      pageSize,
      skipNumber
    }
  })
}

const ACCOUNT_DETAIL_QUERY = `
query($userAddress: ID, $beginDayTimestamp: BigInt) {
  account(id: $userAddress) {
    id
    shares
    depositedUSDT
    accumulatedProfit
    accountDailyDatas(where: {
      dayTimestamp_gt: $beginDayTimestamp
    }) {
      id
      currentShares
      currentDepositedUSDT
      accumulatedProfit
      dayTimestamp
    }
  }
}
`;
export const getAccountDetail = async (userAddress) => {
  const client = getClient()
  if (isEmpty(client)) return
  return await client.query({
    query: gql(ACCOUNT_DETAIL_QUERY),
    variables: {
      userAddress,
      beginDayTimestamp: getDaysAgoTimestamp(30)
    }
  });
}

const PAST_LATEST_ACCOUNT_DAILY_QUERY = `
query($userAddress: String, $endDayTimestamp: BigInt) {
  accountDailyDatas(where: {
    account: $userAddress,
    dayTimestamp_lte: $endDayTimestamp
  }, orderBy: dayTimestamp, orderDirection: desc, first: 1) {
    id
    currentShares
    currentDepositedUSDT
    accumulatedProfit
    dayTimestamp
  }
}
`
export const getPastLatestAccountDailyData = async (userAddress, endDayTimestamp) => {
  const client = getClient()
  if (isEmpty(client)) return
  return await client.query({
    query: gql(PAST_LATEST_ACCOUNT_DAILY_QUERY),
    variables: {
      userAddress,
      endDayTimestamp,
    }
  })
}


/**
 * 获取用户详情信息，
 * @param {string} userAddress 用户地址
 * @param {number} beginDayTimestamp 起始的时间，毫秒数
 * @returns
 */
export const getAccountDetailByDays = async (userAddress, beginDayTimestamp) => {
  const client = getClient()
  if (isEmpty(client)) return
  const query = `
    query($account: String, $beginTimestamp: BigInt) {
      accountDailyDatas(where: {
          account: $account,
          dayTimestamp_gt: $beginTimestamp
      }, orderBy: dayTimestamp, orderDirection: desc) {
          account {
              id
          }
          currentShares
          currentDepositedUSDT
        accumulatedProfit
        dayTimestamp
      }
    }
  `
  return await client.query({
    query: gql(query),
    variables: {
      account: userAddress,
      beginTimestamp: beginDayTimestamp,
    }
  })
}
/**
 * 获取vault详情信息，
 * @param {number} beginDayTimestamp 起始的时间，毫秒数
 * @returns
 */
export const getVaultDailyByDays = async (beginDayTimestamp) => {
  const client = getClient()
  if (isEmpty(client)) return
  const query = `
    query($beginDayTimestamp: BigInt) {
      vaultDailyDatas (where: {
        id_gt: $beginDayTimestamp
      }) {
        id
        holderCount
        newHolderCount
        tvl
        totalShares
        pricePerShare
        unlockedPricePerShare
        totalProfit
        usdtPrice
        lockedProfitDegradationTimestamp
      }
    }
  `;
  return await client
    .query({
      query: gql(query),
      variables: {
        beginDayTimestamp,
      },
    })
}
