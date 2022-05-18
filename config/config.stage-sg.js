// https://umijs.org/config/
import { defineConfig } from 'umi';
export default defineConfig({
  base: '/',
  publicPath: '/',
  define:{
    ENV_INDEX: 'stage-sg',
    API_SERVER: 'https://service-stage-sg.bankofchain.io',
    DASHBOARD_ROOT: 'https://dashboard-stage-sg.bankofchain.io',
    IMAGE_ROOT:'https://stage-sg.bankofchain.io',
    RPC_URL: {
      1: "http://122.248.220.253:8545",
      56: "https://bsc-dataseed.binance.org",
      137: "https://rpc-mainnet.maticvigil.com"
    },
    SUB_GRAPH_URL: {
      1: 'https://stage-sg-subgraph.bankofchain.io/subgraphs/name/boc-v1_5/subgraph',
      56: 'https://stage-sg-subgraph.bankofchain.io/subgraphs/name/boc-v1_5/subgraph',
      137: 'https://stage-sg-subgraph.bankofchain.io/subgraphs/name/boc-v1_5/subgraph'
    },
    VAULT_ADDRESS: {
      1: '0x9bcc604d4381c5b0ad12ff3bf32bede063416bc7',
      56: '0xFEE2d383Ee292283eC43bdf0fa360296BE1e1149',
      137: '0x204d2e5c581506e939295daf99079b590ace906e'
    },
    USDI_ADDRESS: {
      1: '0xf090f16dec8b6d24082edd25b1c8d26f2bc86128',
      56: '0xE3e7A4B35574Ce4b9Bc661cD93e8804Da548932a',
      137: '0x6dc1bebb8e0881aca6f082f5f53dd740c2ddf379'
    }
  },
});
