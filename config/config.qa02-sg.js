// https://umijs.org/config/
import {
  defineConfig
} from 'umi';
export default defineConfig({
  base: '/',
  publicPath: '/',
  define: {
    ENV_INDEX: 'qa02-sg',
    API_SERVER: 'https://service-qa02-sg.bankofchain.io',
    DASHBOARD_ROOT: 'https://dashboard-qa02-sg.bankofchain.io',
    IMAGE_ROOT: 'https://qa02-sg.bankofchain.io',
    RPC_URL: {
      1: "https://rpc-qa02-sg.bankofchain.io",
      56: "https://bsc-dataseed.binance.org",
      137: "https://rpc-mainnet.maticvigil.com",
      31337: "https://rpc-qa02-sg.bankofchain.io",
    },
    USDI: {
      SUB_GRAPH_URL: {
        1: 'https://api.thegraph.com/subgraphs/name/bankofchain/boc-subgraph-ethereum',
        56: 'https://api.thegraph.com/subgraphs/name/bankofchain/boc-subgraph-bnb',
        137: 'https://api.thegraph.com/subgraphs/name/bankofchain/boc-subgraph-polygon'
      },
      VAULT_ADDRESS: {
        1: '0x9BcC604D4381C5b0Ad12Ff3Bf32bEdE063416BC7',
        56: '0x76609c83dD684F0D4c0F0c9849db0a1b5a96CAB2',
        137: '0xd3feAe6c4fdfDE73Bd2fE99c8fE6944904DAA68A'
      },
      USDI_ADDRESS: {
        1: '0xf090f16dEc8b6D24082Edd25B1C8D26f2bC86128',
        56: '0xCFC6E8577a414f561D459fC4a030e3463A500d29',
        137: '0x8DEb399a86f28f62f0F24daF56c4aDD8e57EEcD5'
      },
    },
    ETHI: {
      SUB_GRAPH_URL: {
        1: 'https://qa02-sg-subgraph.bankofchain.io/subgraphs/name/boc-v1_5/subgraph-ethi',
      },
      VAULT_ADDRESS: {
        1: '0xaC9fCBA56E42d5960f813B9D0387F3D3bC003338',
      },
      ETHI_ADDRESS: {
        1: '0xf090f16dEc8b6D24082Edd25B1C8D26f2bC86128',
      }
    }
  },
});
