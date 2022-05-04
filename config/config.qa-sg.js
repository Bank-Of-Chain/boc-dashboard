// https://umijs.org/config/
import {
  defineConfig
} from 'umi';
export default defineConfig({
  base: '/dashboard/',
  publicPath: '/dashboard/',
  define: {
    ENV_INDEX: 'debug',
    API_SERVER: 'http://13.215.137.222/server',
    DASHBOARD_ROOT: 'http://13.215.137.22/dashboard',
    IMAGE_ROOT:'http://13.215.137.222',
    USDI: {
      SUB_GRAPH_URL: {
        1: 'https://api.thegraph.com/subgraphs/name/naruduo/my-subgraph-eth',
        56: 'https://api.thegraph.com/subgraphs/name/naruduo/my-subgraph-bsc',
        137: 'http://13.215.137.222/subgraph/subgraphs/name/boc-v1_5/subgraph'
      },
      VAULT_ADDRESS: {
        1: '0x66F625B8c4c635af8b74ECe2d7eD0D58b4af3C3d',
        56: '0x937f8bb67B61ad405D56BD3e1094b172D96B4038',
        137: '0x204d2e5c581506e939295daf99079b590ace906e'
      },
      USDI_ADDRESS: {
        1: '',
        56: '',
        137: '0x6dc1bebb8e0881aca6f082f5f53dd740c2ddf379'
      },
    },
    ETHI: {
      SUB_GRAPH_URL: {
        1: 'https://api.thegraph.com/subgraphs/name/naruduo/my-subgraph-eth',
      },
      VAULT_ADDRESS: {
        1: '0x76609c83dD684F0D4c0F0c9849db0a1b5a96CAB2',
      },
      ETHI_ADDRESS: {
        1: '0x76609c83dD684F0D4c0F0c9849db0a1b5a96CAB2',
      }
    },
  },
});
