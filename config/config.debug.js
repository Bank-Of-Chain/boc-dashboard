// https://umijs.org/config/
import { defineConfig } from 'umi';
export default defineConfig({
  base: '/dashboard/',
  publicPath: '/dashboard/',
  define:{
    API_SERVER: 'http://192.168.60.12:8080',
    IMAGE_ROOT: 'http://192.168.60.12/dashboard',
    SUB_GRAPH_URL: {
      1: 'https://api.thegraph.com/subgraphs/name/naruduo/my-subgraph-eth',
      137: 'https://api.thegraph.com/subgraphs/name/naruduo/my-subgraph'
    }
  },
});
