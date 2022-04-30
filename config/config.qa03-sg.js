// https://umijs.org/config/
import { defineConfig } from 'umi';
export default defineConfig({
  base: '/',
  publicPath: '/',
  define:{
    ENV_INDEX: 'qa03-sg',
    API_SERVER: 'https://service-qa03-sg.bankofchain.io',
    DASHBOARD_ROOT: 'https://dashboard-qa03-sg.bankofchain.io',
    IMAGE_ROOT:'https://qa03-sg.bankofchain.io',
    SUB_GRAPH_URL: {
      1: 'https://qa03-sg-subgraph.bankofchain.io/subgraphs/name/boc-v1_5/subgraph',
      56: 'https://qa03-sg-subgraph.bankofchain.io/subgraphs/name/boc-v1_5/subgraph',
      137: 'https://qa03-sg-subgraph.bankofchain.io/subgraphs/name/boc-v1_5/subgraph'
    }
  },
});
