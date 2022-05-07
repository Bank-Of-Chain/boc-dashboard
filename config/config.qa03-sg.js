// https://umijs.org/config/
import {
  defineConfig
} from 'umi';
export default defineConfig({
  base: '/',
  publicPath: '/',
  define: {
    ENV_INDEX: 'debug',
    API_SERVER: 'https://service-qa03-sg.bankofchain.io',
    DASHBOARD_ROOT: 'https://dashboard-qa03-sg.bankofchain.io',
    IMAGE_ROOT: 'https://qa03-sg.bankofchain.io',
    USDI: {
      SUB_GRAPH_URL: {
        1: 'https://qa03-sg-subgraph.bankofchain.io/subgraphs/name/boc-v1_5/subgraph',
        56: 'http://192.168.75.33:8000/subgraphs/name/boc-v1_5/subgraph',
        137: 'http://192.168.67.39:8000/subgraphs/name/boc-v1_5/subgraph',
      },
      VAULT_ADDRESS: {
        1: '0x9BcC604D4381C5b0Ad12Ff3Bf32bEdE063416BC7',
        56: '0xFEE2d383Ee292283eC43bdf0fa360296BE1e1149',
        137: '0x204d2e5c581506e939295daf99079b590ace906e'
      },
      USDI_ADDRESS: {
        1: '0xf090f16dEc8b6D24082Edd25B1C8D26f2bC86128',
        56: '0xE3e7A4B35574Ce4b9Bc661cD93e8804Da548932a',
        137: '0x6dc1bebb8e0881aca6f082f5f53dd740c2ddf379'
      }
    },
    ETHI: {
      SUB_GRAPH_URL: {
        1: 'https://qa02-sg-subgraph.bankofchain.io/subgraphs/name/boc-v1_5/subgraph',
      },
      VAULT_ADDRESS: {
        1: '0x9BcC604D4381C5b0Ad12Ff3Bf32bEdE063416BC7',
      },
      ETHI_ADDRESS: {
        1: '0xf090f16dEc8b6D24082Edd25B1C8D26f2bC86128',
      }
    }
  },
});
