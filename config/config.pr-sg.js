// https://umijs.org/config/
import { defineConfig } from 'umi';
export default defineConfig({
  base: '/',
  publicPath: '/',
  define:{
    ENV_INDEX: 'pr-sg',
    API_SERVER: 'https://service-v1.bankofchain.io',
    DASHBOARD_ROOT: 'https://dashboard-v1.bankofchain.io',
    IMAGE_ROOT:'https://web-v1.bankofchain.io',
    RPC_URL: {
      1: "https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
      56: "https://bsc-dataseed.binance.org",
      137: "https://polygon-rpc.com"
    },
    USDI: {
      SUB_GRAPH_URL: {
        1: 'https://api.thegraph.com/subgraphs/name/bankofchain/boc-subgraph-ethereum',
        56: 'https://api.thegraph.com/subgraphs/name/bankofchain/boc-subgraph-bnb',
        137: 'https://api.thegraph.com/subgraphs/name/bankofchain/boc-subgraph-polygon'
      },
      VAULT_ADDRESS: {
        1: '0xd5C7A01E49ab534e31ABcf63bA5a394fF1E5EfAC',
        56: '0x76609c83dD684F0D4c0F0c9849db0a1b5a96CAB2',
        137: '0xd3feAe6c4fdfDE73Bd2fE99c8fE6944904DAA68A'
      },
      USDI_ADDRESS: {
        1: '0xBe15Eed7D8e91D20263d4521c9eB0F4e3510bfBF',
        56: '0xCFC6E8577a414f561D459fC4a030e3463A500d29',
        137: '0x8DEb399a86f28f62f0F24daF56c4aDD8e57EEcD5'
      },
    },
    ETHI: {
      SUB_GRAPH_URL: {
        1: 'https://api.thegraph.com/subgraphs/name/bankofchain/boc-subgraph-ethi',
      },
      VAULT_ADDRESS: {
        1: '0xDae16f755941cbC0C9D240233a6F581d1734DaA2',
      },
      ETHI_ADDRESS: {
        1: '0x8cB9Aca95D1EdebBfe6BD9Da4DC4a2024457bD32',
      }
    }
  },
});
