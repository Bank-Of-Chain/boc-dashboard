import { ApolloClient, InMemoryCache } from '@apollo/client'

// === Constants === //
import { ETH, MATIC } from '@/constants/chain'
import { VAULT_TYPE } from '@/constants/vault'
import { SUB_GRAPH_URL_FOR_USDI_ETH, SUB_GRAPH_URL_FOR_ETHI } from '@/config/config'

const USDI_SUB_GRAPH_URL = SUB_GRAPH_URL_FOR_USDI_ETH
const USDI_CLIENT = {
  [MATIC.id]: new ApolloClient({
    uri: USDI_SUB_GRAPH_URL[MATIC.id],
    cache: new InMemoryCache()
  }),
  [ETH.id]: new ApolloClient({
    uri: USDI_SUB_GRAPH_URL[ETH.id],
    cache: new InMemoryCache()
  })
}

const ETHI_CLIENT = {
  [ETH.id]: new ApolloClient({
    uri: SUB_GRAPH_URL_FOR_ETHI,
    cache: new InMemoryCache()
  })
}

export const getClient = (vault, chain) => {
  const vaultClient = {
    [VAULT_TYPE.USDi]: USDI_CLIENT,
    [VAULT_TYPE.ETHi]: ETHI_CLIENT
  }[vault]
  return vaultClient[chain]
}
