// https://umijs.org/config/
import { defineConfig } from 'umi';
export default defineConfig({
  base: '/',
  publicPath: '/',
  define:{
    ENV_INDEX: 'pro',
    API_SERVER: 'https://service-v1.bankofchain.io',
    DASHBOARD_ROOT: 'https://dashboard-v1.bankofchain.io',
    IMAGE_ROOT:'https://web-v1.bankofchain.io',
    SUB_GRAPH_URL: {
      1: '',
      56: '',
      137: 'https://api.thegraph.com/subgraphs/name/bankofchain/boc-subgraph-polygon'
    },
    USDI_VAULT_ADDRESS: {
      1: '',
      56: '',
      137: '0xd3feAe6c4fdfDE73Bd2fE99c8fE6944904DAA68A'
    },
    USDI_ADDRESS: {
      1: '',
      56: '',
      137: '0x8DEb399a86f28f62f0F24daF56c4aDD8e57EEcD5'
    },
    ETHI_VAULT_ADDRESS: {
      1: '0x76609c83dD684F0D4c0F0c9849db0a1b5a96CAB2',
    },
    EHI_ADDRESS: {
      1: '0x76609c83dD684F0D4c0F0c9849db0a1b5a96CAB2',
    }
  },
});
