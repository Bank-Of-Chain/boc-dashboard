// https://umijs.org/config/
import {
  defineConfig
} from 'umi';
export default defineConfig({
  base: '/',
  publicPath: '/',
  define: {
    ENV_INDEX: 'debug',
    API_SERVER: 'https://service-qa04-sg.bankofchain.io',
    DASHBOARD_ROOT: 'https://dashboard-qa04-sg.bankofchain.io',
    IMAGE_ROOT: 'https://qa04-sg.bankofchain.io',
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
        1: 'https://qa04-sg-subgraph.bankofchain.io/subgraphs/name/boc-v1_5/subgraph-ethi',
      },
      VAULT_ADDRESS: {
        1: '0xaC9fCBA56E42d5960f813B9D0387F3D3bC003338',
      },
      ETHI_ADDRESS: {
        1: '0xf090f16dEc8b6D24082Edd25B1C8D26f2bC86128',
      }
    }
  },
});
