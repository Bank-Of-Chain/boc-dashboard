/**
 * borrowing category extends datas
 */
import { ST_ETH, WETH_ADDRESS, IB_CHF_ADDRESS, IB_GBP_ADDRESS, IB_KRW_ADDRESS, IB_EUR_ADDRESS, IB_AUD_ADDRESS, IB_JPY_ADDRESS } from './tokens'

// === Utils === //
import { riskText1, riskText2, riskText3 } from '@/utils/text-utils'

const EXTENDS = {
  // usdi
  AaveDaiLendingStEthStrategy: {
    pathTokens: [ST_ETH, WETH_ADDRESS],
    warn: [riskText1('Dai'), riskText2('stETH', 'Eth'), riskText3()]
  },
  AaveUSDCLendingStEthStrategy: {
    pathTokens: [ST_ETH, WETH_ADDRESS],
    warn: [riskText1('Usdc'), riskText2('stETH', 'Eth'), riskText3()]
  },
  EulerRevolvingLoanDaiStrategy: {
    //TODO:
    // pathTokens: [DAI_ADDRESS]
  },
  EulerRevolvingLoanUsdcStrategy: {
    //TODO:
    // pathTokens: [USDC_ADDRESS]
  },
  ConvexIBUsdtGbpStrategy: {
    pathTokens: [IB_GBP_ADDRESS],
    warn: [riskText1('Usdt'), riskText2('ibGBP', 'sGBP'), riskText3('Usdt')]
  },
  ConvexIBUsdtChfStrategy: {
    pathTokens: [IB_CHF_ADDRESS],
    warn: [riskText1('Usdt'), riskText2('ibCHF', 'sCHF'), riskText3('Usdt')]
  },
  ConvexIBUsdtAudStrategy: {
    pathTokens: [IB_AUD_ADDRESS],
    warn: [riskText1('Usdt'), riskText2('ibAUD', 'sAUD'), riskText3('Usdt')]
  },
  ConvexIBUsdtEurStrategy: {
    pathTokens: [IB_EUR_ADDRESS],
    warn: [riskText1('Usdt'), riskText2('ibEUR', 'sEUR'), riskText3('Usdt')]
  },

  ConvexIBUsdtJpyStrategy: {
    pathTokens: [IB_JPY_ADDRESS],
    warn: [riskText1('Usdt'), riskText2('ibJPY', 'sJPY'), riskText3('Usdt')]
  },

  ConvexIBUsdtKrwStrategy: {
    pathTokens: [IB_KRW_ADDRESS],
    warn: [riskText1('Usdt'), riskText2('ibKRW', 'sKRW'), riskText3('Usdt')]
  },
  DForceRevolvingLoanDaiStrategy: {
    //TODO:
  },

  //ethi
  AaveWETHstETHStrategy: {
    pathTokens: [ST_ETH, WETH_ADDRESS],
    warn: [riskText2('stETH', 'Eth'), riskText3()]
  },
  EulerRevolvingLoanWETHStrategy: {
    pathTokens: [ST_ETH, WETH_ADDRESS],
    warn: [riskText2('stETH', 'Eth'), riskText3()]
  },
  EulerRevolvingLoanWstETHStrategy: {
    pathTokens: [ST_ETH, WETH_ADDRESS],
    warn: [riskText2('stETH', 'Eth'), riskText3()]
  },
  DForceRevolvingLoanETHStrategy: {
    pathTokens: [ST_ETH, WETH_ADDRESS],
    warn: [riskText2('stETH', 'Eth'), riskText3()]
  }
}

export default EXTENDS
