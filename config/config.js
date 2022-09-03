/**
 * pr02-sg config
 */

// https://umijs.org/config/
import { defineConfig } from 'umi'
import defaultSettings from './defaultSettings'
import proxy from './proxy'
import routes from './routes'
import FileManagerPlugin from 'filemanager-webpack-plugin'
import moment from 'moment'

const { REACT_APP_ENV, UMI_ENV, NODE_ENV } = process.env
export default defineConfig({
  base: '/',
  publicPath: '/',
  hash: true,
  history: {
    type: 'hash'
  },
  antd: {
    dark: true
  },
  dva: {
    hmr: true
  },
  layout: {
    // https://umijs.org/zh-CN/plugins/plugin-layout
    locale: true,
    siderWidth: 208,
    ...defaultSettings
  },
  // https://umijs.org/zh-CN/plugins/plugin-locale
  locale: {
    // default zh-CN
    default: 'en-US',
    antd: true,
    // default true, when it is true, will use `navigator.language` overwrite default
    baseNavigator: false
  },
  dynamicImport: {
    loading: '@ant-design/pro-layout/es/PageLoading'
  },
  targets: {
    ie: 11
  },
  // umi routes: https://umijs.org/docs/routing
  routes,
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    'primary-color': defaultSettings.primaryColor,
    'text-color': defaultSettings.textColor,
    'card-head-color': defaultSettings.textColor,
    'table-header-color': defaultSettings.textColor,
    'modal-heading-color': defaultSettings.textColor
  },
  // esbuild is father build tools
  // https://umijs.org/plugins/plugin-esbuild
  esbuild: {},
  title: false,
  ignoreMomentLocale: true,
  proxy: proxy[REACT_APP_ENV || 'dev'],
  manifest: {
    basePath: '/'
  },
  fastRefresh: {},
  openAPI: [],
  nodeModulesTransform: {
    type: 'none'
  },
  mfsu: {},
  webpack5: {},
  exportStatic: {},
  chainWebpack: config => {
    if (NODE_ENV === 'production') {
      config.plugin('FileManagerPlugin').use(
        new FileManagerPlugin({
          events: {
            onEnd: {
              archive: [
                {
                  source: './dist',
                  destination: './zip/dashboard-' + moment().format('yyyyMMDDHHmmss') + '(pr02-sg).zip'
                }
              ]
            }
          }
        })
      )
    }
  },
  define: {
    ENV_INDEX: 'pr02-sg',
    API_SERVER: 'https://service-pr02-sg.bankofchain.io',
    DASHBOARD_ROOT: 'https://dashboard-v2.bankofchain.io',
    IMAGE_ROOT: 'https://v2.bankofchain.io',
    CHAIN_BROWSER_URL: {
      1: 'https://etherscan.io',
      137: 'https://polygonscan.com'
    },
    RPC_URL: {
      1: 'https://rpc.ankr.com/eth',
      137: 'https://rpc-mainnet.maticvigil.com',
      31337: ''
    },
    USDI: {
      SUB_GRAPH_URL: {
        1: 'https://api.thegraph.com/subgraphs/name/bankofchain/boc-ethereum',
        137: ''
      },
      VAULT_ADDRESS: {
        1: '0x30D120f80D60E7b58CA9fFaf1aaB1815f000B7c3',
        137: ''
      },
      USDI_ADDRESS: {
        1: '0x83131242843257bc6C43771762ba467346Efb2CF',
        137: ''
      },
      VAULT_BUFFER_ADDRESS: {
        1: '0x0b8D3634a05cc6b50E4D026c0eaFa8469cA98480',
        137: ''
      }
    },
    ETHI: {
      SUB_GRAPH_URL: {
        1: 'https://api.thegraph.com/subgraphs/name/bankofchain/boc-ethi'
      },
      VAULT_ADDRESS: {
        1: '0x8f0Cb368C63fbEDF7a90E43fE50F7eb8B9411746'
      },
      ETHI_ADDRESS: {
        1: '0x1A597356E7064D4401110FAa2242bD0B51D1E4Fa'
      },
      VAULT_BUFFER_ADDRESS: {
        1: '0xC8915157b36ed6D0F36827a1Bb5E9b0cDd1e87Cd'
      }
    }
  }
})
