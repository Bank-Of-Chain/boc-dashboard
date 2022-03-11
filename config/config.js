// https://umijs.org/config/
import { defineConfig } from 'umi';
import { join } from 'path';
import defaultSettings from './defaultSettings';
import proxy from './proxy';
import routes from './routes';

const { REACT_APP_ENV } = process.env;
export default defineConfig({
  base: '/',
  publicPath: '/',
  hash: true,
  history:{
    type: 'hash',
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
    default: 'en-US',
    antd: true,
    // default true, when it is true, will use `navigator.language` overwrite default
    baseNavigator: false,
  },
  dynamicImport: {
    loading: '@ant-design/pro-layout/es/PageLoading',
  },
  targets: {
    ie: 11,
  },
  // umi routes: https://umijs.org/docs/routing
  routes,
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    'primary-color': defaultSettings.primaryColor,
    'text-color': defaultSettings.textColor,
    'card-head-color': defaultSettings.textColor,
    'table-header-color': defaultSettings.textColor,
    'modal-heading-color': defaultSettings.textColor,
  },
  // esbuild is father build tools
  // https://umijs.org/plugins/plugin-esbuild
  esbuild: {},
  title: false,
  ignoreMomentLocale: true,
  proxy: proxy[REACT_APP_ENV || 'dev'],
  manifest: {
    basePath: '/',
  },
  // Fast Refresh 热更新
  fastRefresh: {},
  openAPI: [
    {
      requestLibPath: "import { request } from 'umi'",
      // 或者使用在线的版本
      // schemaPath: "https://gw.alipayobjects.com/os/antfincdn/M%24jrzTTYJN/oneapi.json"
      schemaPath: join(__dirname, 'oneapi.json'),
      mock: false,
    },
    {
      requestLibPath: "import { request } from 'umi'",
      schemaPath: 'https://gw.alipayobjects.com/os/antfincdn/CA1dOm%2631B/openapi.json',
      projectName: 'swagger',
    },
  ],
  nodeModulesTransform: {
    type: 'none',
  },
  mfsu: {},
  webpack5: {},
  exportStatic: {},
  define: {
    ENV_INDEX: 'pro',
    API_SERVER: 'https://service.bankofchain.io',
    IMAGE_ROOT: 'https://dashboard.bankofchain.io',
    SUB_GRAPH_URL: {
      1: 'https://api.thegraph.com/subgraphs/name/bankofchain/boc-subgraph-eth',
      56: 'https://api.thegraph.com/subgraphs/name/bankofchain/boc-subgraph-bsc',
      137: 'https://api.thegraph.com/subgraphs/name/bankofchain/boc-subgraph-matic',
    },
    CHAIN_BROWSER_URL: {
      1: 'https://etherscan.io',
      56: 'https://bscscan.com',
      137: 'https://polygonscan.com',
    },
    VAULT_ADDRESS: {
      1: '0x008586B7f6768EDc269D9e5cd276316d33CECE6d',
      56: '0x699F86dd50224544E6c23670Af44682CAe9db3c5',
      137: '0xFB7f340A7DEfD3bB0072844db6D5EbdFAD765dea'
    }
  },
});
