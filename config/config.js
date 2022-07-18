/**
 * qa02-sg环境配置文件
 */

// https://umijs.org/config/
import { defineConfig } from "umi";
import defaultSettings from "./defaultSettings";
import proxy from "./proxy";
import routes from "./routes";
import FileManagerPlugin from "filemanager-webpack-plugin";
import moment from "moment";

const { REACT_APP_ENV, UMI_ENV, NODE_ENV } = process.env;
export default defineConfig({
  base: "/",
  publicPath: "/",
  hash: true,
  history: {
    type: "hash",
  },
  antd: {
    dark: true,
    // 启用紧凑模式
    // compact: true,
  },
  dva: {
    hmr: true,
  },
  layout: {
    // https://umijs.org/zh-CN/plugins/plugin-layout
    locale: true,
    siderWidth: 208,
    ...defaultSettings,
  },
  // https://umijs.org/zh-CN/plugins/plugin-locale
  locale: {
    // default zh-CN
    default: "en-US",
    antd: true,
    // default true, when it is true, will use `navigator.language` overwrite default
    baseNavigator: false,
  },
  dynamicImport: {
    loading: "@ant-design/pro-layout/es/PageLoading",
  },
  targets: {
    ie: 11,
  },
  // umi routes: https://umijs.org/docs/routing
  routes,
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    "primary-color": defaultSettings.primaryColor,
    "text-color": defaultSettings.textColor,
    "card-head-color": defaultSettings.textColor,
    "table-header-color": defaultSettings.textColor,
    "modal-heading-color": defaultSettings.textColor,
  },
  // esbuild is father build tools
  // https://umijs.org/plugins/plugin-esbuild
  esbuild: {},
  title: false,
  ignoreMomentLocale: true,
  proxy: proxy[REACT_APP_ENV || "dev"],
  manifest: {
    basePath: "/",
  },
  // Fast Refresh 热更新
  fastRefresh: {},
  openAPI: [],
  nodeModulesTransform: {
    type: "none",
  },
  mfsu: {},
  webpack5: {},
  exportStatic: {},
  chainWebpack: (config) => {
    if (NODE_ENV === "production") {
      config.plugin("FileManagerPlugin").use(
        new FileManagerPlugin({
          events: {
            onEnd: {
              archive: [
                {
                  source: "./dist",
                  destination:
                    "./zip/dashboard-" +
                    moment().format("yyyyMMDDHHmmss") +
                    "(" +
                    UMI_ENV +
                    ").zip",
                },
              ],
            },
          },
        })
      );
    }
  },
  define: {
    ENV_INDEX: "qa02-sg",
    API_SERVER: "https://service-qa02-sg.bankofchain.io",
    DASHBOARD_ROOT: "https://dashboard-qa02-sg.bankofchain.io",
    IMAGE_ROOT: "https://qa02-sg.bankofchain.io",
    CHAIN_BROWSER_URL: {
      1: "https://etherscan.io",
      56: "https://bscscan.com",
      137: "https://polygonscan.com",
    },
    RPC_URL: {
      1: "https://rpc.ankr.com/eth",
      56: "https://bsc-dataseed.binance.org",
      137: "https://rpc-mainnet.maticvigil.com",
    },
    RPC_URL: {
      1: "https://rpc-qa02-sg.bankofchain.io",
      56: "https://rpc-qa02-sg.bankofchain.io",
      137: "https://rpc-qa02-sg.bankofchain.io",
      31337: "https://rpc-qa02-sg.bankofchain.io",
    },
    USDI: {
      SUB_GRAPH_URL: {
        1: "https://qa02-sg-subgraph.bankofchain.io/subgraphs/name/boc-v1_5/subgraph-eth",
        56: "https://qa02-sg-subgraph.bankofchain.io/subgraphs/name/boc-v1_5/subgraph-eth",
        137: "https://qa02-sg-subgraph.bankofchain.io/subgraphs/name/boc-v1_5/subgraph-eth",
      },
      VAULT_ADDRESS: {
        1: "711",
        56: "0x76609c83dD684F0D4c0F0c9849db0a1b5a96CAB2",
        137: "0xd3feAe6c4fdfDE73Bd2fE99c8fE6944904DAA68A",
      },
      USDI_ADDRESS: {
        1: "10",
        56: "0xd19D3AC573Cb92D8A043724144f7F0080eA9650a",
        137: "0x3A81ced09917adE002F269bD96014716bACC1BE2",
      },
      VAULT_BUFFER_ADDRESS: {
        1: "8",
        56: "0xAB4F5f1Ee46Af26A9201c2C28af9C570727c582d",
        137: "0xFdc146E92D892F326CB9a1A480f58fc30a766c98",
      },
    },
    ETHI: {
      SUB_GRAPH_URL: {
        1: "https://qa02-sg-subgraph.bankofchain.io/subgraphs/name/boc-v1_5/subgraph-ethi",
      },
      VAULT_ADDRESS: {
        1: "19",
      },
      ETHI_ADDRESS: {
        1: "22",
      },
      VAULT_BUFFER_ADDRESS: {
        1: "20",
      },
    },
  },
});
