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
  base: '/dashboard/',
  publicPath: '/dashboard/',
  define: {
    ENV_INDEX: 'qa-local',
    API_SERVER: 'http://192.168.75.50/server',
    DASHBOARD_ROOT: 'http://192.168.75.50/dashboard',
    IMAGE_ROOT: 'http://192.168.75.50',
    RPC_URL: {
      1: 'http://192.168.75.50:8545',
      56: 'https://bsc-dataseed.binance.org',
      137: 'https://rpc-mainnet.maticvigil.com',
    },
    USDI: {
      SUB_GRAPH_URL: {
        1: 'https://api.thegraph.com/subgraphs/name/naruduo/my-subgraph-eth',
        56: 'http://192.168.75.33:8000/subgraphs/name/boc-v1_5/subgraph',
        137: 'http://192.168.67.39:8000/subgraphs/name/boc-v1_5/subgraph',
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
        1: 'https://api.thegraph.com/subgraphs/name/naruduo/my-subgraph-eth',
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
