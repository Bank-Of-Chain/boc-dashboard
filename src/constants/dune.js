/**
 * dune urls extends in strategy details
 */

export const stETH_TO_ETH = 'https://dune.com/embeds/1762890/2906553/3afaf859-20c7-44ff-a73b-c375d4ea3ffc'
export const rETH_TO_ETH = 'https://dune.com/embeds/1762890/2906532/425f7d81-c57f-42ee-81b8-ab6a4bae59bc'
export const sETH_TO_ETH = 'https://dune.com/embeds/1762913/2906565/50909a2e-877c-47ed-b847-14021e135197'

export const AUD_TO_USD = 'https://dune.com/embeds/1762827/2906438/d984086d-8fbc-40a4-9c99-9703081182d8'
export const CHF_TO_USD = 'https://dune.com/embeds/1762823/2906433/7b69c7f6-a7a5-47ff-a752-7669a9e51ea8'
export const EUR_TO_USD = 'https://dune.com/embeds/1762821/2906429/02fc8794-463b-439c-9e9a-ffd4be12e6d0'
export const GBP_TO_USD = 'https://dune.com/embeds/1762884/2906522/727f51be-0b6f-40d5-a8dd-5b0f44a0f63f'
export const JPY_TO_USD = 'https://dune.com/embeds/1762817/2906418/f8003c77-1bec-42ac-840f-cc7efb6e74de'
export const KRW_TO_USD = 'https://dune.com/embeds/1762881/2906517/c1cb3f79-61ff-4218-8c04-692978fecd5e'

const URL_MAP = {
  AaveDaiLendingStEthStrategy: [stETH_TO_ETH],
  AaveUSDCLendingStEthStrategy: [rETH_TO_ETH],
  AuraWstETHWETHStrategy: [sETH_TO_ETH],
  ConvexIBUsdtAudStrategy: [AUD_TO_USD],
  ConvexIBUsdtChfStrategy: [CHF_TO_USD],
  ConvexIBUsdtEurStrategy: [EUR_TO_USD],
  ConvexIBUsdtGbpStrategy: [GBP_TO_USD],
  ConvexIBUsdtJpyStrategy: [JPY_TO_USD],
  ConvexIBUsdtKrwStrategy: [KRW_TO_USD]
}

export default URL_MAP
