// https://umijs.org/config/
import {
  defineConfig
} from 'umi';
export default defineConfig({
  base: '/',
  publicPath: '/',
  define: {
    ENV_INDEX: 'debug',
    API_SERVER: 'https://service-inte.bankofchain.io',
    DASHBOARD_ROOT: 'https://dashboard-inte.bankofchain.io',
    IMAGE_ROOT:'https://inte.bankofchain.io',
    SUB_GRAPH_URL: {
      1: 'https://api.thegraph.com/subgraphs/name/naruduo/my-subgraph-eth',
      56: 'https://api.thegraph.com/subgraphs/name/naruduo/my-subgraph-bsc',
      137: 'https://inte.bankofchain.io/subgraph/subgraphs/name/boc-v1_5/subgraph'
    },
    VAULT_ADDRESS: {
      1: '0x66F625B8c4c635af8b74ECe2d7eD0D58b4af3C3d',
      56: '0x937f8bb67B61ad405D56BD3e1094b172D96B4038',
      137: '0x7a6e91c3c4fcb9157a27eb901210aa1df9d05b45' // subgraph 查询需要小写
    },
    USDI_ADDRESS: {
      1: '',
      56: '',
      137: '0xb334795bf50e4943d076dfb38d8c1a50f9f5a101' // subgraph 查询需要小写
    }
  },
});
