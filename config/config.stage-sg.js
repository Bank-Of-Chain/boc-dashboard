// https://umijs.org/config/
import { defineConfig } from 'umi';
export default defineConfig({
  base: '/',
  publicPath: '/',
  define:{
    ENV_INDEX: 'stage-sg',
    API_SERVER: 'http://service-stage-sg.bankofchain.io',
    DASHBOARD_ROOT: 'http://dashboard-stage-sg.bankofchain.io',
    IMAGE_ROOT:'http://stage-sg.bankofchain.io',
    SUB_GRAPH_URL: {
      1: 'http://stage-sg-subgraph.bankofchain.io/subgraphs/name/boc-v1_5/subgraph/graphql',
      56: 'http://stage-sg-subgraph.bankofchain.io/subgraphs/name/boc-v1_5/subgraph/graphql',
      137: 'http://stage-sg-subgraph.bankofchain.io/subgraphs/name/boc-v1_5/subgraph/graphql'
    }
  },
});
