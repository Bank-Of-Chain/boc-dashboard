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
    ENV_INDEX: 'dev-local',
    API_SERVER: 'http://192.168.75.31:8080',
    DASHBOARD_ROOT: 'http://localhost:8000',
    IMAGE_ROOT:'https://web-v1.bankofchain.io',
    RPC_URL: {
      1: "http://localhost:8545",
      56: "https://bsc-dataseed.binance.org",
      137: "https://rpc-mainnet.maticvigil.com"
    },
    USDI: {
      SUB_GRAPH_URL: {
        1: 'https://api.thegraph.com/subgraphs/name/bankofchain/boc-subgraph-bnb',
        56: 'https://api.thegraph.com/subgraphs/name/bankofchain/boc-subgraph-bnb',
        137: 'https://api.thegraph.com/subgraphs/name/bankofchain/boc-subgraph-polygon'
      },
      VAULT_ADDRESS: {
        1: '0x94fFA1C7330845646CE9128450F8e6c3B5e44F86',
        56: '0x76609c83dD684F0D4c0F0c9849db0a1b5a96CAB2',
        137: '0xd3feAe6c4fdfDE73Bd2fE99c8fE6944904DAA68A'
      },
      USDI_ADDRESS: {
        1: '0xB22C255250d74B0ADD1bfB936676D2a299BF48Bd',
        56: '0xCFC6E8577a414f561D459fC4a030e3463A500d29',
        137: '0x8DEb399a86f28f62f0F24daF56c4aDD8e57EEcD5'
      },
    },
    ETHI: {
      SUB_GRAPH_URL: {
        1: 'http://192.168.75.33:8000/subgraphs/name/boc-v1_5/subgraph-ethi',
      },
      VAULT_ADDRESS: {
        1: '0xDae16f755941cbC0C9D240233a6F581d1734DaA2',
      },
      ETHI_ADDRESS: {
        1: '0x8cB9Aca95D1EdebBfe6BD9Da4DC4a2024457bD32',
      }
    }
  }
});
