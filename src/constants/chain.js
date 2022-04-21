import BN from 'bignumber.js'
const ETH = {
  id: '1',
  name: 'Ethereum',
  decimals: BN(1e6),
  rpcUrl: `https://cloudflare-eth.com`,
  blockExplorer: "https://etherscan.io",
}
const BSC = {
  id: '56',
  name: 'BNB Chain',
  decimals: BN(1e18),
  rpcUrl: `https://bsc-dataseed.binance.org/`,
  blockExplorer: "https://bscscan.com/",
}
const MATIC = {
  id: '137',
  name: 'Polygon',
  decimals: BN(1e6),
  rpcUrl: "https://polygon-rpc.com/",
  blockExplorer: "https://explorer-mainnet.maticvigil.com/",
}
// const CHAINS = [ETH, BSC, MATIC]
const CHAINS = [MATIC]

export const CHIANS_NAME = {
  '1': 'Ethereum',
  '56': 'BNB Chain ',
  '137': 'Polygon',
  '31337': 'Local Fork Chain'
}

export {
  ETH,
  BSC,
  MATIC
}
export default CHAINS
