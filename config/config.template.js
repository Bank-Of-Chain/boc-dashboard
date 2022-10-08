/**
 * {{env}} config
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
                  destination: './zip/dashboard-' + moment().format('yyyyMMDDHHmmss') + '({{env}}).zip'
                }
              ]
            }
          }
        })
      )
    }
  },
  define: {
    ENV_INDEX: '{{env}}',
    API_SERVER: '{{{API_SERVER}}}',
    DASHBOARD_ROOT: '{{{DASHBOARD_ROOT}}}',
    IMAGE_ROOT: '{{{IMAGE_ROOT}}}',
    PUBLISH_TIME: '{{{PUBLISH_TIME}}}',
    PUBLISH_BRANCH: '{{{PUBLISH_BRANCH}}}',
    CHAIN_BROWSER_URL: {
      1: 'https://etherscan.io',
      137: 'https://polygonscan.com'
    },
    RPC_URL: {
      1: '{{{RPC_FOR_1}}}',
      137: '{{{RPC_FOR_137}}}',
      31337: '{{{RPC_FOR_31337}}}'
    },
    USDI: {
      SUB_GRAPH_URL: {
        1: '{{{SUB_GRAPH_URL_FOR_USDI_ETH}}}',
        137: '{{{SUB_GRAPH_URL_FOR_USDI_MATIC}}}'
      },
      VAULT_ADDRESS: {
        1: '{{USDI_VAULT_FOR_ETH}}',
        137: '{{USDI_VAULT_FOR_MATIC}}'
      },
      USDI_ADDRESS: {
        1: '{{USDI_FOR_ETH}}',
        137: '{{USDI_FOR_MATIC}}'
      },
      VAULT_BUFFER_ADDRESS: {
        1: '{{VAULT_BUFFER_FOR_USDI_ETH}}',
        137: '{{VAULT_BUFFER_FOR_USDI_MATIC}}'
      }
    },
    ETHI: {
      SUB_GRAPH_URL: {
        1: '{{{SUB_GRAPH_URL_FOR_ETHI}}}'
      },
      VAULT_ADDRESS: {
        1: '{{ETHI_VAULT}}'
      },
      ETHI_ADDRESS: {
        1: '{{ETHI_FOR_ETH}}'
      },
      VAULT_BUFFER_ADDRESS: {
        1: '{{VAULT_BUFFER_FOR_ETHI_ETH}}'
      }
    }
  }
})
