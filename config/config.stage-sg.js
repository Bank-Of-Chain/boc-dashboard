// https://umijs.org/config/
import { defineConfig } from 'umi'

const ETHI_FOR_ETH = '0x162700d1613DfEC978032A909DE02643bC55df1A'

const USDI_FOR_ETH = '0xC7143d5bA86553C06f5730c8dC9f8187a621A8D4'
const USDI_FOR_BSC = '0xCFC6E8577a414f561D459fC4a030e3463A500d29'
const USDI_FOR_MATIC = '0x8DEb399a86f28f62f0F24daF56c4aDD8e57EEcD5'

const ETHI_VAULT = '0xDae16f755941cbC0C9D240233a6F581d1734DaA2'
const USDI_VAULT_FOR_ETH = '0xd5C7A01E49ab534e31ABcf63bA5a394fF1E5EfAC'
const USDI_VAULT_FOR_BSC = '0x76609c83dD684F0D4c0F0c9849db0a1b5a96CAB2'
const USDI_VAULT_FOR_MATIC = '0xd3feAe6c4fdfDE73Bd2fE99c8fE6944904DAA68A'

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
