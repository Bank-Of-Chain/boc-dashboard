const ETH_STRATEGIES_MAP = [
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
  'Stargate',
  'DForce',
  'Synapse'
]

const BSC_STRATEGIES_MAP = [
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

const MATIC_STRATEGIES_MAP = [
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
const STRATEGIES_MAP = {
  1: ETH_STRATEGIES_MAP,
  56: BSC_STRATEGIES_MAP,
  137: MATIC_STRATEGIES_MAP,
}

export default STRATEGIES_MAP

export {
  ETH_STRATEGIES_MAP,
  BSC_STRATEGIES_MAP,
  MATIC_STRATEGIES_MAP
}
