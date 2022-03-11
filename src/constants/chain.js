import BN from 'bignumber.js'
const ETH = {
  id: '1',
  name: 'ETH',
  decimals: BN(1e6),
  rpcUrl: `https://cloudflare-eth.com`,
  blockExplorer: "https://etherscan.io",
}
const BSC = {
  id: '56',
  name: 'BSC',
  decimals: BN(1e18),
  rpcUrl: `https://bsc-dataseed.binance.org/`,
  blockExplorer: "https://bscscan.com/",
}
const MATIC = {
  id: '137',
  name: 'MATIC',
  decimals: BN(1e6),
  rpcUrl: "https://polygon-rpc.com/",
  blockExplorer: "https://explorer-mainnet.maticvigil.com/",
}
const CHAINS = [ETH, BSC, MATIC]

export const CHIANS_NAME = {
  '1': 'Ethereum',
  '56': 'BSC ',
  '137': 'Matic',
  '31337': 'Local Fork'
}

export {
  ETH,
  BSC,
  MATIC
}
export default CHAINS
