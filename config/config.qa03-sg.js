// https://umijs.org/config/
import {
  defineConfig
} from 'umi';
export default defineConfig({
  base: '/',
  publicPath: '/',
  define: {
    ENV_INDEX: 'debug',
    API_SERVER: 'https://service-qa03-sg.bankofchain.io',
    DASHBOARD_ROOT: 'https://dashboard-qa03-sg.bankofchain.io',
    IMAGE_ROOT: 'https://qa03-sg.bankofchain.io',
    USDI: {
      SUB_GRAPH_URL: {
        1: 'https://api.thegraph.com/subgraphs/name/bankofchain/boc-subgraph-bnb',
        56: 'https://api.thegraph.com/subgraphs/name/bankofchain/boc-subgraph-bnb',
        137: 'https://api.thegraph.com/subgraphs/name/bankofchain/boc-subgraph-polygon'
      },
      VAULT_ADDRESS: {
        1: '0x76609c83dD684F0D4c0F0c9849db0a1b5a96CAB2',
        56: '0x76609c83dD684F0D4c0F0c9849db0a1b5a96CAB2',
        137: '0xd3feAe6c4fdfDE73Bd2fE99c8fE6944904DAA68A'
      },
      USDI_ADDRESS: {
        1: '0xCFC6E8577a414f561D459fC4a030e3463A500d29',
        56: '0xCFC6E8577a414f561D459fC4a030e3463A500d29',
        137: '0x8DEb399a86f28f62f0F24daF56c4aDD8e57EEcD5'
      },
    },
    ETHI: {
      SUB_GRAPH_URL: {
        1: 'https://qa03-sg-subgraph.bankofchain.io/subgraphs/name/boc-v1_5/subgraph-ethi',
      },
      VAULT_ADDRESS: {
        1: '0xaC47e91215fb80462139756f43438402998E4A3a',
      },
      ETHI_ADDRESS: {
        1: '0xdFdE6B33f13de2CA1A75A6F7169f50541B14f75b',
      }
    }
  },
});
