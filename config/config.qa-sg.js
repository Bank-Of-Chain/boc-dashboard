// https://umijs.org/config/
import { defineConfig } from 'umi'

const ETHI_FOR_ETH = '0x0Dd99d9f56A14E9D53b2DdC62D9f0bAbe806647A'

const USDI_FOR_ETH = '0x3C1Cb427D20F15563aDa8C249E71db76d7183B6c'
const USDI_FOR_BSC = ''
const USDI_FOR_MATIC = '0x831a721007308E45e66496Ea78203d35c5AcD309'

const ETHI_VAULT = '0xDae16f755941cbC0C9D240233a6F581d1734DaA2'
const USDI_VAULT_FOR_ETH = '0xd5C7A01E49ab534e31ABcf63bA5a394fF1E5EfAC'
const USDI_VAULT_FOR_BSC = ''
const USDI_VAULT_FOR_MATIC = '0x17B43460aAA42Dd72C26A10B5038Ac2cB2278E49'

export default defineConfig({
  base: '/',
  publicPath: '/',
  define: {
    ENV_INDEX: 'qa-sg',
    API_SERVER: 'https://service-qa-sg.bankofchain.io',
    DASHBOARD_ROOT: 'https://dashboard-qa-sg.bankofchain.io',
    IMAGE_ROOT: 'https://qa-sg.bankofchain.io',
    RPC_URL: {
      1: 'https://rpc-qa-sg.bankofchain.io',
      56: 'https://bsc-dataseed.binance.org',
      137: 'https://rpc-mainnet.maticvigil.com',
      31337: 'https://rpc-qa-sg.bankofchain.io',
    },
    USDI: {
      SUB_GRAPH_URL: {
        1: 'https://api.thegraph.com/subgraphs/name/bankofchain/boc-subgraph-eth',
        56: 'https://api.thegraph.com/subgraphs/name/bankofchain/boc-subgraph-bnb',
        137: 'https://qa-sg-subgraph.bankofchain.io/subgraphs/name/boc-v1_5/subgraph-eth',
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
        1: 'https://api.thegraph.com/subgraphs/name/bankofchain/boc-subgraph-ethi',
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
