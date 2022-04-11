// https://umijs.org/config/
import { defineConfig } from 'umi';
export default defineConfig({
  base: '/',
  publicPath: '/',
  plugins: [
    // https://github.com/zthxxx/react-dev-inspector
    'react-dev-inspector/plugins/umi/react-inspector',
  ],
  // https://github.com/zthxxx/react-dev-inspector#inspector-loader-props
  inspectorConfig: {
    exclude: [],
    babelPlugins: [],
    babelOptions: {},
  },
  define:{
    ENV_INDEX: 'dev',
    API_SERVER: 'http://192.168.60.12/server',
    DASHBOARD_ROOT: '.',
    IMAGE_ROOT:'http://localhost:3001',
    SUB_GRAPH_URL: {
      1: 'https://api.thegraph.com/subgraphs/name/naruduo/my-subgraph-eth',
      56: 'https://api.thegraph.com/subgraphs/name/naruduo/my-subgraph-bsc',
      137: 'https://api.thegraph.com/subgraphs/name/naruduo/my-subgraph'
    },
    VAULT_ADDRESS: {
      1: '0x70bDA08DBe07363968e9EE53d899dFE48560605B',
      56: '0x937f8bb67B61ad405D56BD3e1094b172D96B4038',
      137: '0xe47F0396CfCB8134A791246924171950f1a83053'
    }
  }
});
