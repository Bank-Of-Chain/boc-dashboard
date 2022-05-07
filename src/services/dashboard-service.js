import { getClient } from '../../src/apollo/client';
import { gql } from '@apollo/client';
import { isEmpty } from 'lodash';
import { VAULT_TYPE } from '@/constants/vault'

const USDI_DASHBOARD_DETAIL_QUERY = `
query ($tokenAddress: Bytes, $valutAddress: Bytes) {
  usdi(id: $tokenAddress) {
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
const ETHI_DASHBOARD_DETAIL_QUERY = `
query ($tokenAddress: Bytes, $valutAddress: Bytes) {
  ethi(id: $tokenAddress) {
    tokenInfo {
      decimals
    }
    totalSupply
    holderCount
  }
  vault(id: $valutAddress) {
    id
    totalAssets
    strategies(where: {isAdded: true}) {
      id
      protocol
      debtRecordInVault
    }
  }
}
`;

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

  const key = {
    [VAULT_TYPE.USDi]: 'usdiUpdates',
    [VAULT_TYPE.ETHi]: 'ethiUpdates',
  }[vault]

  return await client
    .query({
      query: gql(QUERY),
      variables: {
        types,
        first: total
      },
    })
    .then((res) => res.data[key]);
};
