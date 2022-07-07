// https://umijs.org/config/
import { defineConfig } from "umi";

const ETHI_FOR_ETH = "0x8cB9Aca95D1EdebBfe6BD9Da4DC4a2024457bD32";

const USDI_FOR_ETH = "0xBe15Eed7D8e91D20263d4521c9eB0F4e3510bfBF";
const USDI_FOR_BSC = "0xCFC6E8577a414f561D459fC4a030e3463A500d29";
const USDI_FOR_MATIC = "0x8DEb399a86f28f62f0F24daF56c4aDD8e57EEcD5";

const ETHI_VAULT = "0xDae16f755941cbC0C9D240233a6F581d1734DaA2";
const USDI_VAULT_FOR_ETH = "0xd5C7A01E49ab534e31ABcf63bA5a394fF1E5EfAC";
const USDI_VAULT_FOR_BSC = "0x76609c83dD684F0D4c0F0c9849db0a1b5a96CAB2";
const USDI_VAULT_FOR_MATIC = "0xd3feAe6c4fdfDE73Bd2fE99c8fE6944904DAA68A";

const VAULT_BUFFER_FOR_ETHI_ETH = "0x2F54D1563963fC04770E85AF819c89Dc807f6a06";
const VAULT_BUFFER_FOR_USDI_ETH = "0x942ED2fa862887Dc698682cc6a86355324F0f01e";
const VAULT_BUFFER_FOR_USDI_BSC = "";
const VAULT_BUFFER_FOR_USDI_MATIC = "";

export default defineConfig({
  base: "/",
  publicPath: "/",
  define: {
    ENV_INDEX: "qa04-sg",
    API_SERVER: "https://service-qa04-sg.bankofchain.io",
    DASHBOARD_ROOT: "https://dashboard-qa04-sg.bankofchain.io",
    IMAGE_ROOT: "https://qa04-sg.bankofchain.io",
    RPC_URL: {
      1: "https://rpc-qa04-sg.bankofchain.io",
      56: "https://bsc-dataseed.binance.org",
      137: "https://rpc-mainnet.maticvigil.com",
      31337: "https://rpc-qa04-sg.bankofchain.io",
    },
    USDI: {
      SUB_GRAPH_URL: {
        1: "https://qa04-sg-subgraph.bankofchain.io/subgraphs/name/boc-v1_5/subgraph-eth",
        56: "https://api.thegraph.com/subgraphs/name/bankofchain/boc-subgraph-bnb",
        137: "https://api.thegraph.com/subgraphs/name/bankofchain/boc-subgraph-polygon",
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
        1: "https://qa04-sg-subgraph.bankofchain.io/subgraphs/name/boc-v1_5/subgraph-ethi",
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
