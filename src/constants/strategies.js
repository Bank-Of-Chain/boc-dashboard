const USDI_ETH_STRATEGIES_MAP = [
  'Balancer',
  'UniswapV2',
  'Dodo',
  'Sushi_Kashi',
  'Sushi_Swap',
  'Convex',
  'Rari',
  'UniswapV3',
  'YearnEarn',
  'YearnV2',
  'YearnIron',
  'GUni',
]

const USDI_BSC_STRATEGIES_MAP = [
  'Bunny',
  'Pancake',
  'Alpaca',
  'Venus',
  'Ellipsis',
  'Belt',
  'Dodo',
  'DForce',
  'Synapse',
  'Stargate'
]

const USDI_MATIC_STRATEGIES_MAP = [
  'Curve',
  'Aave',
  'Balancer',
  'Gravity',
  'Polycat',
  'Qi',
  'Quickswap',
  'Sushi',
  'Synapse',
  'Dodo'
]

const ETHI_ETH_STRATEGIES_MAP = [
  'Balancer',
  'UniswapV2',
]

export const USDI_STRATEGIES_MAP = {
  1: USDI_ETH_STRATEGIES_MAP,
  56: USDI_BSC_STRATEGIES_MAP,
  137: USDI_MATIC_STRATEGIES_MAP,
}

export const ETHI_STRATEGIES_MAP = {
  1: ETHI_ETH_STRATEGIES_MAP,
}

export {
  USDI_ETH_STRATEGIES_MAP,
  USDI_BSC_STRATEGIES_MAP,
  USDI_MATIC_STRATEGIES_MAP,
  ETHI_ETH_STRATEGIES_MAP
}
