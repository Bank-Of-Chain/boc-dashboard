import BN from 'bignumber.js'
import { isNil } from 'lodash'
import isEmpty from 'lodash/isEmpty'

export const toFixed = (value, precision = 1, ...args) => {
  if (isNil(value) || isNil(value)) {
    return 0
  }
  const precisionBN = BN(precision.toString())
  if (isEmpty(value) || precisionBN.isZero()) {
    return 0
  }
  const results = BN(value.toString()).div(precisionBN)
  if (results.isInteger()) {
    return results.toFixed()
  }
  return results.toFixed(...args)
}

const DISPLAY_DECIMALS = 2
export const toLeastOneFixed = (balance, decimals, displayDecimals = DISPLAY_DECIMALS) => {
  const value = BN(balance.toString())
  const decimalsValue = BN(10).pow(decimals)
  const isLessThenDisplay =
    decimals > 6 && !value.eq(0) && value.abs().lt(BN(10).pow(decimals - displayDecimals + 1))
  let displayValue
  if (isLessThenDisplay) {
    displayValue = toFixed(value, decimalsValue, decimals - value.abs().toString().length + 1)
    return parseFloat(displayValue)
  }
  displayValue = toFixed(value, decimalsValue, displayDecimals)
  return parseFloat(displayValue)
}
