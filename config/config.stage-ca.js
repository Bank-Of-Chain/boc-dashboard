// https://umijs.org/config/
import { defineConfig } from 'umi';
export default defineConfig({
  base: '/dashboard/',
  publicPath: '/dashboard/',
  define:{
    ENV_INDEX: 'stage-ca',
    API_SERVER: 'http://192.168.60.40:8080',
    DASHBOARD_ROOT: 'http://192.168.60.40/dashboard',
    IMAGE_ROOT:'http://192.168.60.40',
    RPC_URL: {
      1: "https://rpc.ankr.com/eth",
      56: "https://bsc-dataseed.binance.org",
      137: "https://rpc-mainnet.maticvigil.com"
    },
  },
});
