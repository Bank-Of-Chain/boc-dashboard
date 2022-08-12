import { getClient } from "@/apollo/client";
import { gql } from "@apollo/client";
import { isEmpty } from "lodash";
import { VAULT_TYPE } from "@/constants/vault";

const USDI_DASHBOARD_DETAIL_QUERY = `
query ($tokenAddress: Bytes, $valutAddress: Bytes, $vaultBufferAddress: Bytes) {
  pegToken(id: $tokenAddress) {
    tokenInfo {
      decimals
    }
    totalSupply
    holderCount
  }
  vault(id: $valutAddress) {
    id
    totalValueInVault
    totalAssets
    strategies(where: {isAdded: true}) {
      id
      protocol
      totalValue
    }
    isAdjust
  }
  vaultBuffer(id: $vaultBufferAddress) {
    id
    totalSupply
  }
}
`;
const ETHI_DASHBOARD_DETAIL_QUERY = `
query ($tokenAddress: Bytes, $valutAddress: Bytes, $vaultBufferAddress: Bytes) {
  pegToken(id: $tokenAddress) {
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
    isAdjust
  }
  vaultBuffer(id: $vaultBufferAddress) {
    id
    totalSupply
  }
}
`;

export const getDashboardDetail = async (
  vault,
  chain,
  tokenAddress = "",
  valutAddress = "",
  vaultBufferAddress = ""
) => {
  const client = getClient(vault, chain);
  if (isEmpty(client)) {
    return;
  }
  const QUERY = {
    [VAULT_TYPE.USDi]: USDI_DASHBOARD_DETAIL_QUERY,
    [VAULT_TYPE.ETHi]: ETHI_DASHBOARD_DETAIL_QUERY,
  }[vault];

  const { data } = await client.query({
    query: gql(QUERY),
    variables: {
      tokenAddress: tokenAddress.toLowerCase(),
      valutAddress: valutAddress.toLowerCase(),
      vaultBufferAddress: vaultBufferAddress.toLowerCase(),
    },
  });
  return data;
};

const getRecentActivityQuery = () => `
query($types: [PegTokenUpdateType], $first: Int) {
  pegTokenUpdates(
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
    totalSupplyChangeAmount
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

export const getRecentActivity = async (vault, chain, types, total = 100) => {
  const client = getClient(vault, chain);
  if (isEmpty(client)) {
    return;
  }
  const QUERY = {
    [VAULT_TYPE.USDi]: getRecentActivityQuery(),
    [VAULT_TYPE.ETHi]: getRecentActivityQuery(),
  }[vault];

  return await client
    .query({
      query: gql(QUERY),
      variables: {
        types,
        first: total,
      },
    })
    .then((res) => res.data.pegTokenUpdates);
};
