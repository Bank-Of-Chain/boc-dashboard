import { client } from '../../src/apollo/client';
import { gql } from '@apollo/client';
import { request } from 'umi';
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

const VAULT_DETAIL_QUERY = `
query {
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
    }
  }
}
`;
export const getVaultDetails = async () => {
  const { data } = await client.query({
    query: gql(VAULT_DETAIL_QUERY),
  });
  return {
    data: data.vaults[0],
  };
};

const VAULT_DAILY_QERY = `
query($beginDayTimestamp: Int) {
  vaultHourlyDatas (where: {
    id_gt: $beginDayTimestamp
  }) {
    id
    newHolderCount
    tvl
    pricePerShare
    totalProfit
    usdtPrice
  }
}
`;
export const getVaultDailyData = async (day) => {
  const currentTimestamp = Date.parse(new Date());
  const beginDayTimestamp = Math.floor((currentTimestamp / 1000 - day * 86400) / 86400);
  return await client.query({
    query: gql(VAULT_DAILY_QERY),
    variables: {
      beginDayTimestamp,
    },
  });
};

const VAULT_TODAY_QUERY = `
query($todayTimestamp: Int) {
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
  const currentTimestamp = Date.parse(new Date());
  const todayTimestamp = Math.floor(currentTimestamp / 1000 / 86400);
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
query($beginHourTimestamp: Int) {
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
  const currentTimestamp = Date.parse(new Date());
  const beginHourTimestamp = Math.floor((currentTimestamp / 1000 - day * 24 * 3600) / 3600);
  return await client.query({
    query: gql(vaultHourlyData),
    variables: {
      beginHourTimestamp,
    },
  });
};

export const getProtocols = async () => {
  // TODO: 待实现
  const url = '/api/protocol-3';
  return await request(url);
};

export const getStrategyById = async () => {
  // TODO: 待实现
  const url = '/api/strategy-3';
  return await request(url);
};

export const getTransations = async () => {
  // TODO: 待实现
  const url = '/api/txn-1';
  return await request(url);
};
