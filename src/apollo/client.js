import {
  ApolloClient,
  InMemoryCache
} from '@apollo/client';

export const maticClient = new ApolloClient({
  uri: SUB_GRAPH_URL['137'],
  cache: new InMemoryCache(),
});

export const bscClient = new ApolloClient({
  uri: SUB_GRAPH_URL['56'],
  cache: new InMemoryCache(),
});

export const ethClient = new ApolloClient({
  uri: SUB_GRAPH_URL['1'],
  cache: new InMemoryCache(),
});

const CLIENT = {
  '137': maticClient,
  '56': bscClient,
  '1': ethClient
}
let CHAIN_ID = '1'

export const setClient = chain => {
  CHAIN_ID = chain
}

export const getClient = chain => {
  if (chain) {
    return CLIENT[chain]
  }
  return CLIENT[CHAIN_ID]
}
