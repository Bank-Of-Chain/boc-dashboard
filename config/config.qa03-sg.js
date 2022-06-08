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
      56: "https://bsc-dataseed.binance.org",
      137: "https://rpc-mainnet.maticvigil.com",
      31337: "https://rpc-qa03-sg.bankofchain.io",
    },
    USDI: {
      SUB_GRAPH_URL: {
        1: 'https://api.thegraph.com/subgraphs/name/bankofchain/boc-subgraph-ethereum',
        56: 'https://api.thegraph.com/subgraphs/name/bankofchain/boc-subgraph-bnb',
        137: 'https://qa03-sg-subgraph.bankofchain.io/subgraphs/name/boc-v1_5/subgraph-eth'
      },
      VAULT_ADDRESS: {
        1: '0xd5C7A01E49ab534e31ABcf63bA5a394fF1E5EfAC',
        56: '0x76609c83dD684F0D4c0F0c9849db0a1b5a96CAB2',
        137: '0xe6cFc17053c64838Fd7bb55BD4A2cb5b207A71ed'
      },
      USDI_ADDRESS: {
        1: '0xBe15Eed7D8e91D20263d4521c9eB0F4e3510bfBF',
        56: '0xCFC6E8577a414f561D459fC4a030e3463A500d29',
        137: '0x965A01d39A9835d2B7e9e53bDc5C8501B962e8a3'
      },
    },
    ETHI: {
      SUB_GRAPH_URL: {
        1: 'https://api.thegraph.com/subgraphs/name/bankofchain/boc-subgraph-ethi',
      },
      VAULT_ADDRESS: {
        1: '0xd9140951d8aE6E5F625a02F5908535e16e3af964',
      },
      ETHI_ADDRESS: {
        1: '0xe039608E695D21aB11675EBBA00261A0e750526c',
      }
    }
  },
});
