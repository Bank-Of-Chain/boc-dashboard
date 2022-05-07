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
    SUB_GRAPH_URL: {
      1: 'https://stage-sg-subgraph.bankofchain.io/subgraphs/name/boc-v1_5/subgraph',
      56: 'https://stage-sg-subgraph.bankofchain.io/subgraphs/name/boc-v1_5/subgraph',
      137: 'https://stage-sg-subgraph.bankofchain.io/subgraphs/name/boc-v1_5/subgraph'
    }
  },
});
