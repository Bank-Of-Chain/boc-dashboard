// https://umijs.org/config/
import {
  defineConfig
} from 'umi';
export default defineConfig({
  base: '/',
  publicPath: '/',
  define: {
    ENV_INDEX: 'qa-sg',
    API_SERVER: 'https://service-qa-sg.bankofchain.io',
    DASHBOARD_ROOT: 'https://dashboard-qa-sg.bankofchain.io',
    IMAGE_ROOT: 'https://qa-sg.bankofchain.io',
    RPC_URL: {
      1: "https://rpc-qa-sg.bankofchain.io",
      56: "https://bsc-dataseed.binance.org",
      137: "https://rpc-mainnet.maticvigil.com",
      31337: "https://rpc-qa-sg.bankofchain.io",
    },
    USDI: {
      SUB_GRAPH_URL: {
        1: 'https://api.thegraph.com/subgraphs/name/bankofchain/boc-subgraph-ethereum',
        56: 'https://api.thegraph.com/subgraphs/name/bankofchain/boc-subgraph-bnb',
        137: 'https://api.thegraph.com/subgraphs/name/bankofchain/boc-subgraph-polygon'
      },
      VAULT_ADDRESS: {
        1: '0x54B8d8E2455946f2A5B8982283f2359812e815ce',
        56: '0x76609c83dD684F0D4c0F0c9849db0a1b5a96CAB2',
        137: '0xd3feAe6c4fdfDE73Bd2fE99c8fE6944904DAA68A'
      },
      USDI_ADDRESS: {
        1: '0x3C15538ED063e688c8DF3d571Cb7a0062d2fB18D',
        56: '0xCFC6E8577a414f561D459fC4a030e3463A500d29',
        137: '0x8DEb399a86f28f62f0F24daF56c4aDD8e57EEcD5'
      },
    },
    ETHI: {
      SUB_GRAPH_URL: {
        1: 'https://qa-sg-subgraph.bankofchain.io/subgraphs/name/boc-v1_5/subgraph-ethi',
      },
      VAULT_ADDRESS: {
        1: '0xb932C8342106776E73E39D695F3FFC3A9624eCE0',
      },
      ETHI_ADDRESS: {
        1: '0x75c68e69775fA3E9DD38eA32E554f6BF259C1135' ,
      }
    },
  },
});
