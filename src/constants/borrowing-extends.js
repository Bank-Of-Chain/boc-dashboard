/**
 * borrowing category extends datas
 */
import { ST_ETH, ETH_ADDRESS } from './tokens'

const EXTENDS = {
  AaveDaiLendingStEthStrategy: {
    pathTokens: [ST_ETH, ETH_ADDRESS],
    warn: 'dai versus USD unanchoring risk; Risk of steth breaking anchor relative to eth; eth Clearing Risk'
  },
  AaveUSDCLendingStEthStrategy: {
    pathTokens: [ST_ETH, ETH_ADDRESS],
    warn: 'dai versus USD unanchoring risk; Risk of steth breaking anchor relative to eth; eth Clearing Risk'
  },
  EulerRevolvingLoanWETHStrategy: {
    pathTokens: [ST_ETH, ETH_ADDRESS],
    warn: 'dai versus USD unanchoring risk;Risk of steth breaking anchor relative to eth;eth Clearing Risk'
  },
  EulerRevolvingLoanWstETHStrategy: {
    pathTokens: [ST_ETH, ETH_ADDRESS],
    warn: 'dai versus USD unanchoring risk;Risk of steth breaking anchor relative to eth;eth Clearing Risk'
  }
}

export default EXTENDS
