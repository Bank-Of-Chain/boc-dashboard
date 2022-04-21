// https://umijs.org/config/
import {
  defineConfig
} from 'umi';
export default defineConfig({
  base: '/',
  publicPath: '/',
  define: {
    ENV_INDEX: 'debug',
    API_SERVER: 'https://service-inte.bankofchain.io/server',
    DASHBOARD_ROOT: 'https://dashboard-inte.bankofchain.io',
    IMAGE_ROOT:'https://inte.bankofchain.io',
    SUB_GRAPH_URL: {
      1: 'https://api.thegraph.com/subgraphs/name/naruduo/my-subgraph-eth',
      56: 'https://api.thegraph.com/subgraphs/name/naruduo/my-subgraph-bsc',
      137: 'https://api.thegraph.com/subgraphs/name/naruduo/my-subgraph'
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
    }
  },
});
