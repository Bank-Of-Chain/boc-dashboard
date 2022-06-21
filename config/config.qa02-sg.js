// https://umijs.org/config/
import {
  defineConfig
} from 'umi';
export default defineConfig({
  base: '/',
  publicPath: '/',
  define: {
    ENV_INDEX: 'qa02-sg',
    API_SERVER: 'https://service-qa02-sg.bankofchain.io',
    DASHBOARD_ROOT: 'https://dashboard-qa02-sg.bankofchain.io',
    IMAGE_ROOT: 'https://qa02-sg.bankofchain.io',
    RPC_URL: {
      1: "https://rpc-qa02-sg.bankofchain.io",
      56: "https://bsc-dataseed.binance.org",
      137: "https://rpc-mainnet.maticvigil.com",
      31337: "https://rpc-qa02-sg.bankofchain.io",
    },
    USDI: {
      SUB_GRAPH_URL: {
        1: 'https://qa02-sg-subgraph.bankofchain.io/subgraphs/name/boc-v1_5/subgraph-eth',
        56: 'https://qa02-sg-subgraph.bankofchain.io/subgraphs/name/boc-v1_5/subgraph-eth',
        137: 'https://qa02-sg-subgraph.bankofchain.io/subgraphs/name/boc-v1_5/subgraph-eth'
      },
      VAULT_ADDRESS: {
        1: '0x54B8d8E2455946f2A5B8982283f2359812e815ce',
        56: '0x76609c83dD684F0D4c0F0c9849db0a1b5a96CAB2',
        137: '0xe6cFc17053c64838Fd7bb55BD4A2cb5b207A71ed'
      },
      USDI_ADDRESS: {
        1: '0x3C15538ED063e688c8DF3d571Cb7a0062d2fB18D',
        56: '0xCFC6E8577a414f561D459fC4a030e3463A500d29',
        137: '0x965A01d39A9835d2B7e9e53bDc5C8501B962e8a3'
      },
    },
    ETHI: {
      SUB_GRAPH_URL: {
        1: 'https://qa02-sg-subgraph.bankofchain.io/subgraphs/name/boc-v1_5/subgraph-ethi',
      },
      VAULT_ADDRESS: {
        1: '0xb932C8342106776E73E39D695F3FFC3A9624eCE0',
      },
      ETHI_ADDRESS: {
        1: '0x75c68e69775fA3E9DD38eA32E554f6BF259C1135',
      }
    }
  },
});
