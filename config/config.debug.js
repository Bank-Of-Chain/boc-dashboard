// https://umijs.org/config/
import {
  defineConfig
} from 'umi';
export default defineConfig({
  base: '/dashboard/',
  publicPath: '/dashboard/',
  define: {
    ENV_INDEX: 'debug',
    API_SERVER: 'http://192.168.60.12:8080',
    DASHBOARD_ROOT: 'http://192.168.60.12/dashboard',
    IMAGE_ROOT:'http://192.168.60.12',
    SUB_GRAPH_URL: {
      1: 'https://api.thegraph.com/subgraphs/name/naruduo/my-subgraph-eth',
      56: 'https://api.thegraph.com/subgraphs/name/naruduo/my-subgraph-bsc',
      137: 'https://api.thegraph.com/subgraphs/name/naruduo/my-subgraph'
    },
    VAULT_ADDRESS: {
      1: '0x66F625B8c4c635af8b74ECe2d7eD0D58b4af3C3d',
      56: '0x937f8bb67B61ad405D56BD3e1094b172D96B4038',
      137: '0xe47F0396CfCB8134A791246924171950f1a83053'
    }
  },
});
