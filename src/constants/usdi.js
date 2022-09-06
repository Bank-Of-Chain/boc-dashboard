import BN from 'bignumber.js'

export const RECENT_ACTIVITY_TYPE = {
  Mint: 'Deposit',
  Burn: 'Burn',
  Rebase: 'Rebase',
  Transfer: 'Transfer'
}

export const USDI_DECIMALS = 18

export const USDI_BN_DECIMALS = BN(1e18)
