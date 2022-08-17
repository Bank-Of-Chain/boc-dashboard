/**
 * qa04-sg config
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
                    "(qa04-sg).zip",
                },
              ],
            },
          },
        })
      );
    }
  },
  define: {
    ENV_INDEX: "qa04-sg",
    API_SERVER: "https://service-qa04-sg.bankofchain.io",
    DASHBOARD_ROOT: "https://dashboard-qa04-sg.bankofchain.io",
    IMAGE_ROOT: "https://qa04-sg.bankofchain.io",
    CHAIN_BROWSER_URL: {
      1: "https://etherscan.io",
      137: "https://polygonscan.com",
    },
    RPC_URL: {
      1: "https://rpc-qa04-sg.bankofchain.io",
      137: "https://rpc-qa04-sg.bankofchain.io",
      31337: "https://rpc-qa04-sg.bankofchain.io",
    },
    USDI: {
      SUB_GRAPH_URL: {
        1: "https://qa04-sg-subgraph.bankofchain.io/subgraphs/name/boc-v1_5/subgraph-eth",
        137: "https://qa04-sg-subgraph.bankofchain.io/subgraphs/name/boc-v1_5/subgraph-eth",
      },
      VAULT_ADDRESS: {
        1: "0xd5C7A01E49ab534e31ABcf63bA5a394fF1E5EfAC",
        137: "13",
      },
      USDI_ADDRESS: {
        1: "0xBe15Eed7D8e91D20263d4521c9eB0F4e3510bfBF",
        137: "16",
      },
      VAULT_BUFFER_ADDRESS: {
        1: "8",
        137: "14",
      },
    },
    ETHI: {
      SUB_GRAPH_URL: {
        1: "https://qa04-sg-subgraph.bankofchain.io/subgraphs/name/boc-v1_5/subgraph-ethi",
      },
      VAULT_ADDRESS: {
        1: "0xDae16f755941cbC0C9D240233a6F581d1734DaA2",
      },
      ETHI_ADDRESS: {
        1: "0x8cB9Aca95D1EdebBfe6BD9Da4DC4a2024457bD32",
      },
      VAULT_BUFFER_ADDRESS: {
        1: "20",
      },
    },
  },
});
