/**
 * {{env}}环境配置文件
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
    ENV_INDEX: "{{env}}",
    API_SERVER: "https://service-{{env}}.bankofchain.io",
    DASHBOARD_ROOT: "https://dashboard-{{env}}.bankofchain.io",
    IMAGE_ROOT: "https://{{env}}.bankofchain.io",
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
      1: "https://rpc-{{env}}.bankofchain.io",
      56: "https://rpc-{{env}}.bankofchain.io",
      137: "https://rpc-{{env}}.bankofchain.io",
      31337: "https://rpc-{{env}}.bankofchain.io",
    },
    USDI: {
      SUB_GRAPH_URL: {
        1: "https://{{env}}-subgraph.bankofchain.io/subgraphs/name/boc-v1_5/subgraph-eth",
        56: "https://{{env}}-subgraph.bankofchain.io/subgraphs/name/boc-v1_5/subgraph-eth",
        137: "https://{{env}}-subgraph.bankofchain.io/subgraphs/name/boc-v1_5/subgraph-eth",
      },
      VAULT_ADDRESS: {
        1: "{{USDI_VAULT_FOR_ETH}}",
        56: "{{USDI_VAULT_FOR_BSC}}",
        137: "{{USDI_VAULT_FOR_MATIC}}",
      },
      USDI_ADDRESS: {
        1: "{{USDI_FOR_ETH}}",
        56: "{{USDI_FOR_BSC}}",
        137: "{{USDI_FOR_MATIC}}",
      },
      VAULT_BUFFER_ADDRESS: {
        1: "{{VAULT_BUFFER_FOR_USDI_ETH}}",
        56: "{{VAULT_BUFFER_FOR_USDI_BSC}}",
        137: "{{VAULT_BUFFER_FOR_USDI_MATIC}}",
      },
    },
    ETHI: {
      SUB_GRAPH_URL: {
        1: "https://{{env}}-subgraph.bankofchain.io/subgraphs/name/boc-v1_5/subgraph-ethi",
      },
      VAULT_ADDRESS: {
        1: "{{ETHI_VAULT}}",
      },
      ETHI_ADDRESS: {
        1: "{{ETHI_FOR_ETH}}",
      },
      VAULT_BUFFER_ADDRESS: {
        1: "{{VAULT_BUFFER_FOR_ETHI_ETH}}",
      },
    },
  },
});
