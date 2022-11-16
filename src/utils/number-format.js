// === Utils === //
import BN from 'bignumber.js'
import { isNil, isNull } from 'lodash'
import isEmpty from 'lodash/isEmpty'
import numeral from 'numeral'

export const toFixed = (value, precision = 1, ...args) => {
  if (isNil(value)) return undefined
  if (isNull(precision)) return value.toString()
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
  const isLessThenDisplay = decimals > 6 && !value.eq(0) && value.abs().lt(BN(10).pow(decimals - displayDecimals + 1))
  let displayValue
  if (isLessThenDisplay) {
    displayValue = toFixed(value, decimalsValue, decimals - value.abs().toString().length + 1)
    return displayValue
  }
  displayValue = toFixed(value, decimalsValue, displayDecimals)
  return parseFloat(displayValue)
}

// APY > 1000, show 1000+
export const formatApyLabel = value => {
  const result = parseFloat(value)
  if (isNaN(result)) {
    return value
  }
  if (result <= 1000) {
    return result
  }
  return '1000+'
}

// APY > 1000, use 1000 to render chart
export const formatApyValue = value => {
  const result = parseFloat(value)
  if (isNaN(result)) {
    return value
  }
  if (result <= 1000) {
    return result
  }
  return 1000
}

/**
 *
 * @param {*} value
 * @param {*} format
 * @returns
 */
export const numberSplit = (value, format = '0.00') => {
  const totalSupplyTextWithSymbol = numeral(value).format(`${format} a`)
  return totalSupplyTextWithSymbol.split(' ')
}
