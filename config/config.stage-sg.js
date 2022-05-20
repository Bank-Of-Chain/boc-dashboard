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
    USDI: {
      SUB_GRAPH_URL: {
        1: 'https://stage-sg-subgraph.bankofchain.io/subgraphs/name/boc-v1_5/subgraph',
        56: 'https://stage-sg-subgraph.bankofchain.io/subgraphs/name/boc-v1_5/subgraph',
        137: 'https://stage-sg-subgraph.bankofchain.io/subgraphs/name/boc-v1_5/subgraph'
      },
      VAULT_ADDRESS: {
        1: '0xd5C7A01E49ab534e31ABcf63bA5a394fF1E5EfAC',
        56: '0x76609c83dD684F0D4c0F0c9849db0a1b5a96CAB2',
        137: '0x85f93384BAd10d7751Fcc3bBD8F8710db3190700'
      },
      USDI_ADDRESS: {
        1: '0xBe15Eed7D8e91D20263d4521c9eB0F4e3510bfBF',
        56: '0xCFC6E8577a414f561D459fC4a030e3463A500d29',
        137: '0x1C9f974DF781C6EB3764F21Fe961ba38305213df'
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
