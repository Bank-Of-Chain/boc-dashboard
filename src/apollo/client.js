import { ApolloClient, InMemoryCache } from "@apollo/client";

import { ETH, BSC, MATIC } from "../constants/chain";

import { VAULT_TYPE } from "@/constants/vault";

const USDI_SUB_GRAPH_URL = USDI.SUB_GRAPH_URL;
const USDI_CLIENT = {
  [MATIC.id]: new ApolloClient({
    uri: USDI_SUB_GRAPH_URL[MATIC.id],
    cache: new InMemoryCache(),
  }),
  [BSC.id]: new ApolloClient({
    uri: USDI_SUB_GRAPH_URL[BSC.id],
    cache: new InMemoryCache(),
  }),
  [ETH.id]: new ApolloClient({
    uri: USDI_SUB_GRAPH_URL[ETH.id],
    cache: new InMemoryCache(),
  }),
};

const ETHI_CLIENT = {
  [ETH.id]: new ApolloClient({
    uri: ETHI.SUB_GRAPH_URL[ETH.id],
    cache: new InMemoryCache(),
  }),
};

export const getClient = (vault, chain) => {
  const vaultClient = {
    [VAULT_TYPE.USDi]: USDI_CLIENT,
    [VAULT_TYPE.ETHi]: ETHI_CLIENT,
  }[vault];
  return vaultClient[chain];
};
