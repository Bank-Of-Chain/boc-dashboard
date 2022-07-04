// https://umijs.org/config/
import { defineConfig } from 'umi'

const ETHI_FOR_ETH = '0x33E45b187da34826aBCEDA1039231Be46f1b05Af'

const USDI_FOR_ETH = '0x67aD6EA566BA6B0fC52e97Bc25CE46120fdAc04c'
const USDI_FOR_BSC = ''
const USDI_FOR_MATIC = ''

const ETHI_VAULT = '0x70E5370b8981Abc6e14C91F4AcE823954EFC8eA3'
const USDI_VAULT_FOR_ETH = '0x359570B3a0437805D0a71457D61AD26a28cAC9A2'
const USDI_VAULT_FOR_BSC = ''
const USDI_VAULT_FOR_MATIC = ''

export default defineConfig({
  base: '/',
  publicPath: '/',
  define: {
    ENV_INDEX: 'stage-sg',
    API_SERVER: 'https://service-stage-sg.bankofchain.io',
    DASHBOARD_ROOT: 'https://dashboard-stage-sg.bankofchain.io',
    IMAGE_ROOT: 'https://stage-sg.bankofchain.io',
    RPC_URL: {
      1: 'https://rpc-stage-sg.bankofchain.io',
      56: 'https://rpc-stage-sg.bankofchain.io',
      137: 'https://rpc-stage-sg.bankofchain.io',
      31337: 'https://rpc-stage-sg.bankofchain.io',
    },
    USDI: {
      SUB_GRAPH_URL: {
        1: 'https://stage-sg-subgraph.bankofchain.io/subgraphs/name/boc-v1_5/subgraph-eth',
        56: 'https://api.thegraph.com/subgraphs/name/bankofchain/boc-subgraph-bnb',
        137: 'https://api.thegraph.com/subgraphs/name/bankofchain/boc-subgraph-polygon',
      },
      VAULT_ADDRESS: {
        1: USDI_VAULT_FOR_ETH,
        56: USDI_VAULT_FOR_BSC,
        137: USDI_VAULT_FOR_MATIC,
      },
      USDI_ADDRESS: {
        1: USDI_FOR_ETH,
        56: USDI_FOR_BSC,
        137: USDI_FOR_MATIC,
      },
    },
    ETHI: {
      SUB_GRAPH_URL: {
        1: 'https://stage-sg-subgraph.bankofchain.io/subgraphs/name/boc-v1_5/subgraph-ethi',
      },
      VAULT_ADDRESS: {
        1: ETHI_VAULT,
      },
      ETHI_ADDRESS: {
        1: ETHI_FOR_ETH,
      },
    },
  },
})
