import {
  ApolloClient,
  InMemoryCache
} from '@apollo/client';

import {
  ETH,
  BSC,
  MATIC
} from '../constants/chain'

export const maticClient = new ApolloClient({
  uri: SUB_GRAPH_URL[MATIC.id],
  cache: new InMemoryCache(),
});

export const bscClient = new ApolloClient({
  uri: SUB_GRAPH_URL[BSC.id],
  cache: new InMemoryCache(),
});

export const ethClient = new ApolloClient({
  uri: SUB_GRAPH_URL[ETH.id],
  cache: new InMemoryCache(),
});

const CLIENT = {
  [MATIC.id]: maticClient,
  [BSC.id]: bscClient,
  [ETH.id]: ethClient
}
let CHAIN_ID = ''

export const setClient = chain => {
  CHAIN_ID = chain
}

export const getClient = chain => {
  if (chain) {
    return CLIENT[chain]
  }
  return CLIENT[CHAIN_ID]
}

const DECIMALS = {
  [MATIC.id]: MATIC.decimals,
  [BSC.id]: BSC.decimals,
  [ETH.id]: ETH.decimals
}

export const getDecimals = chain => {
  if (chain) {
    return DECIMALS[chain]
  }
  return DECIMALS[CHAIN_ID]
}
