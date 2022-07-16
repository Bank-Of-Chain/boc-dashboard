// https://umijs.org/config/
import { defineConfig } from "umi";

const ETHI_FOR_ETH = "0x0Dd99d9f56A14E9D53b2DdC62D9f0bAbe806647A";

const USDI_FOR_ETH = "0x3C1Cb427D20F15563aDa8C249E71db76d7183B6c";
const USDI_FOR_BSC = "0xd19D3AC573Cb92D8A043724144f7F0080eA9650a";
const USDI_FOR_MATIC = "0x3A81ced09917adE002F269bD96014716bACC1BE2";

const ETHI_VAULT = "0xDae16f755941cbC0C9D240233a6F581d1734DaA2";
const USDI_VAULT_FOR_ETH = "0xd5C7A01E49ab534e31ABcf63bA5a394fF1E5EfAC";
const USDI_VAULT_FOR_BSC = "0x76609c83dD684F0D4c0F0c9849db0a1b5a96CAB2";
const USDI_VAULT_FOR_MATIC = "0xd3feAe6c4fdfDE73Bd2fE99c8fE6944904DAA68A";

const VAULT_BUFFER_FOR_ETHI_ETH = "0xd3FFD73C53F139cEBB80b6A524bE280955b3f4db";
const VAULT_BUFFER_FOR_USDI_ETH = "0x7C8BaafA542c57fF9B2B90612bf8aB9E86e22C09";
const VAULT_BUFFER_FOR_USDI_BSC = "0xAB4F5f1Ee46Af26A9201c2C28af9C570727c582d";
const VAULT_BUFFER_FOR_USDI_MATIC =
  "0xFdc146E92D892F326CB9a1A480f58fc30a766c98";

export default defineConfig({
  base: "/",
  publicPath: "/",
  define: {
    ENV_INDEX: "qa02-sg",
    API_SERVER: "https://service-qa02-sg.bankofchain.io",
    DASHBOARD_ROOT: "https://dashboard-qa02-sg.bankofchain.io",
    IMAGE_ROOT: "https://qa02-sg.bankofchain.io",
    RPC_URL: {
      1: "https://rpc-qa02-sg.bankofchain.io",
      56: "https://rpc-qa02-sg.bankofchain.io",
      137: "https://rpc-qa02-sg.bankofchain.io",
      31337: "https://rpc-qa02-sg.bankofchain.io",
    },
    USDI: {
      SUB_GRAPH_URL: {
        1: "https://api.thegraph.com/subgraphs/name/bankofchain/boc-subgraph-eth",
        56: "https://qa02-sg-subgraph.bankofchain.io/subgraphs/name/boc-v1_5/subgraph-eth",
        137: "https://qa02-sg-subgraph.bankofchain.io/subgraphs/name/boc-v1_5/subgraph-eth",
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
