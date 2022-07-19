/**
 * stage-sg环境配置文件
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
                    "(stage-sg).zip",
                },
              ],
            },
          },
        })
      );
    }
  },
  define: {
    ENV_INDEX: "stage-sg",
    API_SERVER: "https://service-stage-sg.bankofchain.io",
    DASHBOARD_ROOT: "https://dashboard-stage-sg.bankofchain.io",
    IMAGE_ROOT: "https://stage-sg.bankofchain.io",
    CHAIN_BROWSER_URL: {
      1: "https://etherscan.io",
      56: "https://bscscan.com",
      137: "https://polygonscan.com",
    },
    RPC_URL: {
      1: "https://rpc-stage-sg.bankofchain.io",
      56: "https://rpc-stage-sg.bankofchain.io",
      137: "https://rpc-stage-sg.bankofchain.io",
      31337: "https://rpc-stage-sg.bankofchain.io",
    },
    USDI: {
      SUB_GRAPH_URL: {
        1: "https://stage-sg-subgraph.bankofchain.io/subgraphs/name/boc-v1_5/subgraph-eth",
        56: "https://stage-sg-subgraph.bankofchain.io/subgraphs/name/boc-v1_5/subgraph-eth",
        137: "https://stage-sg-subgraph.bankofchain.io/subgraphs/name/boc-v1_5/subgraph-eth",
      },
      VAULT_ADDRESS: {
        1: "0x0a17FabeA4633ce714F1Fa4a2dcA62C3bAc4758d",
        56: "0x2f64734C74e72661C9857059928Ed398593da173",
        137: "0x12087c013f6269A90F113F8935f51C713a09b173",
      },
      USDI_ADDRESS: {
        1: "0xd9fEc8238711935D6c8d79Bef2B9546ef23FC046",
        56: "0xc7C037221Cb8Af497A2963e553263aE38e01dA62",
        137: "0x04Cd8B3e384e7bBB01109bc8b6708fCAeD5e9eB0",
      },
      VAULT_BUFFER_ADDRESS: {
        1: "0xb932C8342106776E73E39D695F3FFC3A9624eCE0",
        56: "0x13398e151530AbDF387d8A1Fa4C3a75EC355Cc4d",
        137: "0xfDFB68F5195DF817824Ee881CF63E94402eEc46A",
      },
    },
    ETHI: {
      SUB_GRAPH_URL: {
        1: "https://stage-sg-subgraph.bankofchain.io/subgraphs/name/boc-v1_5/subgraph-ethi",
      },
      VAULT_ADDRESS: {
        1: "0x2e8880cAdC08E9B438c6052F5ce3869FBd6cE513",
      },
      ETHI_ADDRESS: {
        1: "0xeC827421505972a2AE9C320302d3573B42363C26",
      },
      VAULT_BUFFER_ADDRESS: {
        1: "0x1D13fF25b10C9a6741DFdce229073bed652197c7",
      },
    },
  },
});
