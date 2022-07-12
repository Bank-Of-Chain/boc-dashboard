// https://umijs.org/config/
import { defineConfig } from "umi";

const ETHI_FOR_ETH = "0x0Dd99d9f56A14E9D53b2DdC62D9f0bAbe806647A";

const USDI_FOR_ETH = "0x3C1Cb427D20F15563aDa8C249E71db76d7183B6c";
const USDI_FOR_BSC = "0x459239D96976440d68fd78e1401983376840d563";
const USDI_FOR_MATIC = "0x04Cd8B3e384e7bBB01109bc8b6708fCAeD5e9eB0";

const ETHI_VAULT = "0xDae16f755941cbC0C9D240233a6F581d1734DaA2";
const USDI_VAULT_FOR_ETH = "0xd5C7A01E49ab534e31ABcf63bA5a394fF1E5EfAC";
const USDI_VAULT_FOR_BSC = "0x2856a0C8034bF887928845D05179847e0ADC2209";
const USDI_VAULT_FOR_MATIC = "0x12087c013f6269A90F113F8935f51C713a09b173";

const VAULT_BUFFER_FOR_ETHI_ETH = "0xd3FFD73C53F139cEBB80b6A524bE280955b3f4db";
const VAULT_BUFFER_FOR_USDI_ETH = "0x7C8BaafA542c57fF9B2B90612bf8aB9E86e22C09";
const VAULT_BUFFER_FOR_USDI_BSC = "0x3E1f6Ce5900640176b63F205195AF0f4dD940339";
const VAULT_BUFFER_FOR_USDI_MATIC =
  "0xfDFB68F5195DF817824Ee881CF63E94402eEc46A";

export default defineConfig({
  base: "/",
  publicPath: "/",
  define: {
    ENV_INDEX: "qa-sg",
    API_SERVER: "https://service-qa-sg.bankofchain.io",
    DASHBOARD_ROOT: "https://dashboard-qa-sg.bankofchain.io",
    IMAGE_ROOT: "https://qa-sg.bankofchain.io",
    RPC_URL: {
      1: "https://rpc-qa-sg.bankofchain.io",
      56: "https://rpc-qa-sg.bankofchain.io",
      137: "https://rpc-qa-sg.bankofchain.io",
      31337: "https://rpc-qa-sg.bankofchain.io",
    },
    USDI: {
      SUB_GRAPH_URL: {
        1: "https://api.thegraph.com/subgraphs/name/bankofchain/boc-subgraph-eth",
        56: "https://qa-sg-subgraph.bankofchain.io/subgraphs/name/boc-v1_5/subgraph-eth",
        137: "https://qa-sg-subgraph.bankofchain.io/subgraphs/name/boc-v1_5/subgraph-eth",
      },
      VAULT_ADDRESS: {
        1: USDI_VAULT_FOR_ETH,
        56: USDI_VAULT_FOR_BSC,
        137: USDI_VAULT_FOR_MATIC,
      },
      USDI_ADDRESS: {
        1: USDI_FOR_ETH,
        56: USDI_FOR_BSC,
        137: USDI_FOR_MATIC,
      },
      VAULT_BUFFER_ADDRESS: {
        1: VAULT_BUFFER_FOR_USDI_ETH,
        56: VAULT_BUFFER_FOR_USDI_BSC,
        137: VAULT_BUFFER_FOR_USDI_MATIC,
      },
    },
    ETHI: {
      SUB_GRAPH_URL: {
        1: "https://api.thegraph.com/subgraphs/name/bankofchain/boc-subgraph-ethi",
      },
      VAULT_ADDRESS: {
        1: ETHI_VAULT,
      },
      ETHI_ADDRESS: {
        1: ETHI_FOR_ETH,
      },
      VAULT_BUFFER_ADDRESS: {
        1: VAULT_BUFFER_FOR_ETHI_ETH,
      },
    },
  },
});
