// https://umijs.org/config/
import {
  defineConfig
} from 'umi';
export default defineConfig({
  base: '/',
  publicPath: '/',
  define: {
    ENV_INDEX: 'qa03-sg',
    API_SERVER: 'https://service-qa03-sg.bankofchain.io',
    DASHBOARD_ROOT: 'https://dashboard-qa03-sg.bankofchain.io',
    IMAGE_ROOT: 'https://qa03-sg.bankofchain.io',
    RPC_URL: {
      1: "https://rpc-qa03-sg.bankofchain.io",
      56: "https://rpc-qa03-sg.bankofchain.io",
      137: "https://rpc-qa03-sg.bankofchain.io", // 个人页使用
      31337: "https://rpc-qa03-sg.bankofchain.io", // 钱包连接是 31337
    },
    USDI: {
      SUB_GRAPH_URL: {
        1: 'https://qa03-sg-subgraph.bankofchain.io/subgraphs/name/boc-v1_5/subgraph-eth',
        56: 'https://api.thegraph.com/subgraphs/name/bankofchain/boc-subgraph-bnb',
        137: 'https://api.thegraph.com/subgraphs/name/bankofchain/boc-subgraph-polygon'
      },
      VAULT_ADDRESS: {
        1: '0x359570B3a0437805D0a71457D61AD26a28cAC9A2',
        56: '0x76609c83dD684F0D4c0F0c9849db0a1b5a96CAB2',
        137: '0xd3feAe6c4fdfDE73Bd2fE99c8fE6944904DAA68A'
      },
      USDI_ADDRESS: {
        1: '0x67aD6EA566BA6B0fC52e97Bc25CE46120fdAc04c',
        56: '0xCFC6E8577a414f561D459fC4a030e3463A500d29',
        137: '0x8DEb399a86f28f62f0F24daF56c4aDD8e57EEcD5'
      },
    },
    ETHI: {
      SUB_GRAPH_URL: {
        1: 'https://qa03-sg-subgraph.bankofchain.io/subgraphs/name/boc-v1_5/subgraph-ethi',
      },
      VAULT_ADDRESS: {
        1: '0x4000F8820522AC96C4221b299876e3e53bCc8525',
      },
      ETHI_ADDRESS: {
        1: '0x0c626FC4A447b01554518550e30600136864640B',
      }
    }
  },
});
