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
    API_SERVER: 'http://192.168.75.50/server',
    DASHBOARD_ROOT: '.',
    IMAGE_ROOT:'http://192.168.75.50',
    SUB_GRAPH_URL: {
      1: 'https://api.thegraph.com/subgraphs/name/naruduo/my-subgraph-eth',
      56: 'http://192.168.75.33:8000/subgraphs/name/boc-v1_5/subgraph',
      137: 'http://192.168.75.33:8000/subgraphs/name/boc-v1_5/subgraph',
    },
    VAULT_ADDRESS: {
      1: '0x70bDA08DBe07363968e9EE53d899dFE48560605B',
      56: '0xFEE2d383Ee292283eC43bdf0fa360296BE1e1149',
      137: '0x204d2e5c581506e939295daf99079b590ace906e'
    },
    USDI_ADDRESS: {
      1: '',
      56: '0xE3e7A4B35574Ce4b9Bc661cD93e8804Da548932a',
      137: '0x6dc1bebb8e0881aca6f082f5f53dd740c2ddf379'
    },
    ETHI_VAULT_ADDRESS: {
      1: '0x76609c83dD684F0D4c0F0c9849db0a1b5a96CAB2',
    },
    EHI_ADDRESS: {
      1: '0x76609c83dD684F0D4c0F0c9849db0a1b5a96CAB2',
    }
  }
});
