// https://umijs.org/config/
import { defineConfig } from 'umi';
export default defineConfig({
  base: '/dashboard/',
  publicPath: '/dashboard/',
  define:{
    ENV_INDEX: 'inte',
    API_SERVER: 'http://192.168.60.40:8080',
    DASHBOARD_ROOT: 'http://192.168.60.40/dashboard',
    IMAGE_ROOT:'http://192.168.60.40/',
    SUB_GRAPH_URL: {
      1: 'https://api.thegraph.com/subgraphs/name/naruduo/my-subgraph-eth',
      137: 'https://api.thegraph.com/subgraphs/name/naruduo/my-subgraph'
    }
  },
});
