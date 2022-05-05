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
    // API_SERVER: 'http://192.168.75.50/server',
    API_SERVER: 'http://192.168.75.33:8080',
    DASHBOARD_ROOT: '.',
    IMAGE_ROOT:'http://192.168.75.50',
    USDI: {
      SUB_GRAPH_URL: {
        1: 'https://api.thegraph.com/subgraphs/name/bankofchain/boc-subgraph-bnb',
        56: 'https://api.thegraph.com/subgraphs/name/bankofchain/boc-subgraph-bnb',
        137: 'https://api.thegraph.com/subgraphs/name/bankofchain/boc-subgraph-polygon'
      },
      VAULT_ADDRESS: {
        1: '0x70bDA08DBe07363968e9EE53d899dFE48560605B',
        56: '0x76609c83dD684F0D4c0F0c9849db0a1b5a96CAB2',
        137: '0xd3feAe6c4fdfDE73Bd2fE99c8fE6944904DAA68A'
      },
      USDI_ADDRESS: {
        1: '0xE3e7A4B35574Ce4b9Bc661cD93e8804Da548932a',
        56: '0xCFC6E8577a414f561D459fC4a030e3463A500d29',
        137: '0x8DEb399a86f28f62f0F24daF56c4aDD8e57EEcD5'
      },
    },
    ETHI: {
      SUB_GRAPH_URL: {
        1: 'http://192.168.75.33:8000/subgraphs/name/boc-v1_5/subgraph-ethi',
      },
      VAULT_ADDRESS: {
        1: '0xeF31027350Be2c7439C1b0BE022d49421488b72C',
      },
      ETHI_ADDRESS: {
        1: '0x63fea6E447F120B8Faf85B53cdaD8348e645D80E',
      }
    }
  }
});
