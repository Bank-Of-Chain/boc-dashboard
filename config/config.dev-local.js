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
    IMAGE_ROOT:'http://192.168.60.12',
    SUB_GRAPH_URL: {
      1: 'https://api.thegraph.com/subgraphs/name/naruduo/my-subgraph-eth',
      56: 'https://api.thegraph.com/subgraphs/name/naruduo/my-subgraph-bsc',
      137: 'https://api.thegraph.com/subgraphs/name/naruduo/my-subgraph'
    }
  }
});
