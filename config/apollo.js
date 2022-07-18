const fs = require("fs");
const argv = require("minimist")(process.argv.slice(2));
const axios = require("axios");

const { env } = argv;

const start = async () => {
  const host = "http://54.179.161.168";
  const url = `${host}:8088/configfiles/json/boc-subgraph/${env}/boc1.application`;
  console.log(`url: ${url}`);
  const { status, data } = await axios.get(url);
  if (status === 200) {
    const USDI_VAULT_FOR_ETH = data[`boc.networks.eth.vaultAddress`];
    const USDI_FOR_ETH = data[`boc.networks.eth.pegTokenAddress`];
    const VAULT_BUFFER_FOR_USDI_ETH =
      data[`boc.networks.eth.vaultBufferAddress`];

    const USDI_VAULT_FOR_BSC = data[`boc.networks.bsc.vaultAddress`];
    const USDI_FOR_BSC = data[`boc.networks.bsc.pegTokenAddress`];
    const VAULT_BUFFER_FOR_USDI_BSC =
      data[`boc.networks.bsc.vaultBufferAddress`];

    const USDI_VAULT_FOR_MATIC = data[`boc.networks.polygon.vaultAddress`];
    const USDI_FOR_MATIC = data[`boc.networks.polygon.pegTokenAddress`];
    const VAULT_BUFFER_FOR_USDI_MATIC =
      data[`boc.networks.polygon.vaultBufferAddress`];

    const ETHI_VAULT = data[`boc.networks.ethi.vaultAddress`];
    const ETHI_FOR_ETH = data[`boc.networks.ethi.pegTokenAddress`];
    const VAULT_BUFFER_FOR_ETHI_ETH =
      data[`boc.networks.ethi.vaultBufferAddress`];
    let config = {
      env,
      ETHI_FOR_ETH,
      USDI_FOR_ETH,
      USDI_FOR_BSC,
      USDI_FOR_MATIC,
      ETHI_VAULT,
      USDI_VAULT_FOR_ETH,
      USDI_VAULT_FOR_BSC,
      USDI_VAULT_FOR_MATIC,
      VAULT_BUFFER_FOR_ETHI_ETH,
      VAULT_BUFFER_FOR_USDI_ETH,
      VAULT_BUFFER_FOR_USDI_BSC,
      VAULT_BUFFER_FOR_USDI_MATIC,
      API_SERVER: getApiServer(),
      DASHBOARD_ROOT: getDashboardRoot(),
      IMAGE_ROOT: getImageRoot(),
      SUB_GRAPH_URL_FOR_USDI_ETH: getSubgraphForEthUsdi(),
      SUB_GRAPH_URL_FOR_USDI_BSC: getSubgraphForBscUsdi(),
      SUB_GRAPH_URL_FOR_USDI_MATIC: getSubgraphForMaticUsdi(),
      SUB_GRAPH_URL_FOR_ETHI: getSubgraphForEthEthi(),
      RPC_FOR_1: getRpcFor1(),
      RPC_FOR_56: getRpcFor56(),
      RPC_FOR_137: getRpcFor137(),
      RPC_FOR_31337: getRpcFor31337(),
    };
    fs.writeFileSync(
      `./config/address.json`,
      JSON.stringify(config, undefined, 4)
    );
    console.log("write json success");
  }
};

const isPrSg = () => {
  return env === "pr-sg";
};

const getApiServer = () => {
  if (isPrSg()) return "https://service.bankofchain.io";
  return `https://service-${env}.bankofchain.io`;
};

const getDashboardRoot = () => {
  if (isPrSg()) return "https://dashboard.bankofchain.io";
  return `https://dashboard-${env}.bankofchain.io`;
};

const getImageRoot = () => {
  if (isPrSg()) return "https://bankofchain.io";
  return `https://${env}.bankofchain.io`;
};

const getRpcFor1 = () => {
  if (isPrSg()) return "https://rpc.ankr.com/eth";
  return `https://rpc-${env}.bankofchain.io`;
};
const getRpcFor56 = () => {
  if (isPrSg()) return "https://bsc-dataseed.binance.org";
  return `https://rpc-${env}.bankofchain.io`;
};
const getRpcFor137 = () => {
  if (isPrSg()) return "https://rpc-mainnet.maticvigil.com";
  return `https://rpc-${env}.bankofchain.io`;
};
const getRpcFor31337 = () => {
  if (isPrSg()) return "";
  return `https://rpc-${env}.bankofchain.io`;
};

const getSubgraphForEthUsdi = () => {
  if (isPrSg())
    return "https://api.thegraph.com/subgraphs/name/bankofchain/boc-subgraph-ethereum";
  return `https://${env}-subgraph.bankofchain.io/subgraphs/name/boc-v1_5/subgraph-eth`;
};

const getSubgraphForBscUsdi = () => {
  if (isPrSg())
    return "https://api.thegraph.com/subgraphs/name/bankofchain/boc-subgraph-bnb";
  return `https://${env}-subgraph.bankofchain.io/subgraphs/name/boc-v1_5/subgraph-eth`;
};

const getSubgraphForMaticUsdi = () => {
  if (isPrSg())
    return "https://api.thegraph.com/subgraphs/name/bankofchain/boc-subgraph-polygon";
  return `https://${env}-subgraph.bankofchain.io/subgraphs/name/boc-v1_5/subgraph-eth`;
};

const getSubgraphForEthEthi = () => {
  if (isPrSg())
    return "https://api.thegraph.com/subgraphs/name/bankofchain/boc-subgraph-ethi";
  return `https://${env}-subgraph.bankofchain.io/subgraphs/name/boc-v1_5/subgraph-ethi`;
};

try {
  start();
} catch (error) {
  process.exit(2);
}
