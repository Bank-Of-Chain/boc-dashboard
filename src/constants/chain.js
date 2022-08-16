import BN from 'bignumber.js'
const ETH = {
  id: '1',
  name: 'Ethereum',
  decimals: BN(1e6),
  rpcUrl: `https://cloudflare-eth.com`,
  blockExplorer: 'https://etherscan.io'
}
const MATIC = {
  id: '137',
  name: 'Polygon',
  decimals: BN(1e6),
  rpcUrl: 'https://polygon-rpc.com/',
  blockExplorer: 'https://explorer-mainnet.maticvigil.com/'
}

const CHAINS = [ETH, MATIC]

export const CHIANS_NAME = {
  1: 'Ethereum',
  137: 'Polygon',
  31337: 'Local Fork Chain'
}

export { ETH, MATIC }
export default CHAINS
