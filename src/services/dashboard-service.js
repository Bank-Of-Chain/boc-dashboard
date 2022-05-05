import { getClient } from '../../src/apollo/client';
import { gql } from '@apollo/client';
import { isEmpty } from 'lodash';
import { VAULT_TYPE } from '@/constants/vault'

const getDashboardDetailQuery = (token) => `
query ($tokenAddress: Bytes, $valutAddress: Bytes) {
  ${token}(id: $tokenAddress) {
    tokenInfo {
      decimals
    }
    totalSupply
    holderCount
  }
  vault(id: $valutAddress) {
    id
    totalValue
    strategies(where: {isAdded: true}) {
      id
      protocol
      totalValue
    }
  }
}
`;
const USDI_DASHBOARD_DETAIL_QUERY = getDashboardDetailQuery('usdi')
const ETHI_DASHBOARD_DETAIL_QUERY = getDashboardDetailQuery('ethi')

export const getDashboardDetail = async (vault, chain, tokenAddress = '', valutAddress = '') => {
  const client = getClient(vault, chain)
  if (isEmpty(client)) {
    return
  }
  const QUERY = {
    [VAULT_TYPE.USDi]: USDI_DASHBOARD_DETAIL_QUERY,
    [VAULT_TYPE.ETHi]: ETHI_DASHBOARD_DETAIL_QUERY,
  }[vault]

  const { data } = await client.query({
    query: gql(QUERY),
    variables: {
      tokenAddress: tokenAddress.toLowerCase(),
      valutAddress: valutAddress.toLowerCase()
    }
  });
  return data
};

const STRATEGY_DETAIL_QUERY = `
query($strategyAddress: Bytes) {
  strategy(id: $strategyAddress) {
    id
    name
    protocol
    positionDetail {
      token {
        id
        symbol
      }
    }
    isAdded
    totalValue
  }
}
`;
export const getStrategyById = async (vault, chain, strategyAddress) => {
  const client = getClient(vault, chain)
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

const getRecentActivityQuery = (entity, type) => `
query($types: [${type}], $first: Int) {
  ${entity}(
    orderBy: timestamp,
    orderDirection: desc,
    first: $first,
    where: {
      type_in: $types
    },
  ) {
    id
    type
    transferredAmount
    changeAmount
    timestamp
    fromAccountUpdate {
      account {
        id
      }
    }
    transaction {
      id
    }
		toAccountUpdate {
      account {
        id
      }
    }
  }
}
`;
const USDI_ACTIVITY_QUERY = getRecentActivityQuery('usdiUpdates', 'USDiUpdateType')
const ETHI_ACTIVITY_QUERY = getRecentActivityQuery('ethiUpdates', 'ETHiUpdateType')

export const getRecentActivity = async (vault, chain, types, total = 100) => {
  const client = getClient(vault, chain)
  if (isEmpty(client)) {
    return
  }
  const QUERY = {
    [VAULT_TYPE.USDi]: USDI_ACTIVITY_QUERY,
    [VAULT_TYPE.ETHi]: ETHI_ACTIVITY_QUERY,
  }[vault]

  return await client
    .query({
      query: gql(QUERY),
      variables: {
        types,
        first: total
      },
    })
    .then((res) => res.data.usdiUpdates);
};
