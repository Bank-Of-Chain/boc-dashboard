import BN from 'bignumber.js'
const ETH = {
  id: '1',
  name: 'ETH',
  decimals: BN(1e6)
}
const BSC = {
  id: '56',
  name: 'BSC',
  decimals: BN(1e18)
}
const MATIC = {
  id: '137',
  name: 'MATIC',
  decimals: BN(1e6)
}
const CHAINS = [ETH, BSC, MATIC]

export {
  ETH,
  BSC,
  MATIC
}
export default CHAINS
