import { client } from '../../src/apollo/client';
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

function getDaysAgoTimestamp(daysAgo) {
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const daysAgoTimestamp = currentTimestamp - daysAgo * 86400;
  return daysAgoTimestamp - (daysAgoTimestamp % 86400);
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
    usdtPrice
    holderCount
    strategies(where: {debt_gt: 0, addToVault: true}) {
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
  const { data } = await client.query({
    query: gql(VAULT_DETAIL_QUERY),
    variables: {
      sevenDaysAgoTimestamp: getDaysAgoTimestamp(7),
    },
  });
  return {
    data: data.vaults[0],
  };
};

const VAULT_DAILY_QERY = `
query($beginDayTimestamp: BigInt) {
  vaultDailyDatas (where: {
    id_gt: $beginDayTimestamp
  }) {
    id
    holderCount
    newHolderCount
    tvl
    pricePerShare
    totalProfit
    usdtPrice
  }
}
`;
export const getVaultDailyData = async (day) => {
  if(isEmpty(day)) return
  return await client
    .query({
      query: gql(VAULT_DAILY_QERY),
      variables: {
        beginDayTimestamp: getDaysAgoTimestamp(day),
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
    pricePerShare
    totalProfit
    usdtPrice
  }
}
`;
export const getVaultTodayData = async () => {
  const currentTimestamp = Math.floor(Date.parse(new Date()) / 1000);
  const todayTimestamp = currentTimestamp - (currentTimestamp % 86400);
  const { data } = await client.query({
    query: gql(VAULT_TODAY_QUERY),
    variables: {
      todayTimestamp,
    },
  });
  return {
    data: data.vaultDailyData,
  };
};

const vaultHourlyData = `
query($beginHourTimestamp: BigInt) {
  vaultHourlyDatas (where: {
    id_gt: $beginHourTimestamp
  }) {
    id
    tvl
    pricePerShare
    usdtPrice
  }
}
`;
export const getVaultHourlyData = async (day) => {
  return await client
    .query({
      query: gql(vaultHourlyData),
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
    reports {
      id
      profit
      usdtPrice
      timestamp
    }
    lastReportTime
  }
}
`;
export const getStrategyById = async (strategyAddress) => {
  return await client.query({
    query: gql(STRATEGY_DETAIL_QUERY),
    variables: {
      strategyAddress,
    },
  }).then(data => data.data.strategy);
};

const TXN_QUERY = `
query($relatedContractAddress: Bytes) {
  importantEvents(where: {address: $relatedContractAddress}) {
    id
    method
    from
    address
    shares
    tokenDetails {
      usdtInUSD
    }
    timestamp
  }
}
`;
export const getTransations = async (relatedContractAddress) => {
  if(isEmpty(relatedContractAddress)) return
  return await client.query({
    query: gql(TXN_QUERY),
    variables: {
      relatedContractAddress,
    },
  }).then(data => data.data.importantEvents);
};
