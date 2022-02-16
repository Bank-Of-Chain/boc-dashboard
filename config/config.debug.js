// https://umijs.org/config/
import { defineConfig } from 'umi';
export default defineConfig({
  base: '/dashboard/',
  publicPath: '/dashboard/',
  define:{
    API_SERVER: 'http://192.168.60.12:8080',
    IMAGE_ROOT: 'http://192.168.60.12/dashboard'
  }
});
