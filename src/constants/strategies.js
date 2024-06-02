const STRATEGIES_MAP = [
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
  'YearnIronBank',
  'GUni',
  'Stargate',
  'DForce',
  'Synapse',
  'Aura',
  'Aave',
  'Euler',
  'Alpha',
  'Gearbox',
  'StakeWise',
  'Frax'
]

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
  'Stargate',
  'DForce',
  'Synapse',
  'Aura',
  'Aave',
  'Euler'
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
  'Dodo',
  'Stargate',
  'UniswapV3'
]

const ETHI_ETH_STRATEGIES_MAP = [
  'Balancer',
  'UniswapV2',
  'Convex',
  'Aura',
  'UniswapV3',
  'StakeWise',
  'YearnV2',
  'Aave',
  'DForce',
  'Euler',
  'Stargate',
  'Alpha',
  'Gearbox',
  'Frax'
]

export const USDI_STRATEGIES_MAP = {
  1: USDI_ETH_STRATEGIES_MAP,
  137: USDI_MATIC_STRATEGIES_MAP
}

export const ETHI_STRATEGIES_MAP = {
  1: ETHI_ETH_STRATEGIES_MAP
}

export { USDI_ETH_STRATEGIES_MAP, USDI_MATIC_STRATEGIES_MAP, ETHI_ETH_STRATEGIES_MAP, STRATEGIES_MAP }
