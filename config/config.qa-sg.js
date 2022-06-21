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
        1: 'https://qa-sg-subgraph.bankofchain.io/subgraphs/name/boc-v1_5/subgraph-eth',
        56: 'https://api.thegraph.com/subgraphs/name/bankofchain/boc-subgraph-bnb',
        137: 'https://api.thegraph.com/subgraphs/name/bankofchain/boc-subgraph-polygon'
      },
      VAULT_ADDRESS: {
        1: '0x359570B3a0437805D0a71457D61AD26a28cAC9A2',
        56: '0x76609c83dD684F0D4c0F0c9849db0a1b5a96CAB2',
        137: '0xd3feAe6c4fdfDE73Bd2fE99c8fE6944904DAA68A'
      },
      USDI_ADDRESS: {
        1: '0x67aD6EA566BA6B0fC52e97Bc25CE46120fdAc04c',
        56: '0xCFC6E8577a414f561D459fC4a030e3463A500d29',
        137: '0x8DEb399a86f28f62f0F24daF56c4aDD8e57EEcD5'
      },
    },
    ETHI: {
      SUB_GRAPH_URL: {
        1: 'https://qa-sg-subgraph.bankofchain.io/subgraphs/name/boc-v1_5/subgraph-ethi',
      },
      VAULT_ADDRESS: {
        1: '0x70E5370b8981Abc6e14C91F4AcE823954EFC8eA3',
      },
      ETHI_ADDRESS: {
        1: '0x33E45b187da34826aBCEDA1039231Be46f1b05Af' ,
      }
    },
  },
});
