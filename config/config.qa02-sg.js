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
        1: 'https://qa02-sg-subgraph.bankofchain.io/subgraphs/name/boc-v1_5/subgraph-eth',
        56: 'https://qa02-sg-subgraph.bankofchain.io/subgraphs/name/boc-v1_5/subgraph-eth',
        137: 'https://qa02-sg-subgraph.bankofchain.io/subgraphs/name/boc-v1_5/subgraph-eth'
      },
      VAULT_ADDRESS: {
        1: '0x38A70c040CA5F5439ad52d0e821063b0EC0B52b6',
        56: '0x76609c83dD684F0D4c0F0c9849db0a1b5a96CAB2',
        137: '0xe6cFc17053c64838Fd7bb55BD4A2cb5b207A71ed'
      },
      USDI_ADDRESS: {
        1: '0xe70f935c32dA4dB13e7876795f1e175465e6458e',
        56: '0xCFC6E8577a414f561D459fC4a030e3463A500d29',
        137: '0x965A01d39A9835d2B7e9e53bDc5C8501B962e8a3'
      },
    },
    ETHI: {
      SUB_GRAPH_URL: {
        1: 'https://qa02-sg-subgraph.bankofchain.io/subgraphs/name/boc-v1_5/subgraph-ethi',
      },
      VAULT_ADDRESS: {
        1: '0x95775fD3Afb1F4072794CA4ddA27F2444BCf8Ac3',
      },
      ETHI_ADDRESS: {
        1: '0xCBBe2A5c3A22BE749D5DDF24e9534f98951983e2',
      }
    }
  },
});
