import BN from 'bignumber.js';
import isUndefined from 'lodash/isUndefined';
import {
  isNull
} from 'lodash';
import isEmpty from 'lodash/isEmpty';

export const toFixed = (value, precision = 1, ...args) => {
  if (isUndefined(value) || isNull(value)) {
    return undefined
  }
  if (isEmpty(value)) {
    return 0
  }
  const results = BN(value.toString()).div(BN(precision.toString()));
  if (results.isInteger()) {
    return results.toFixed()
  }
  return results.toFixed(...args);
}


const DISPLAY_DECIMALS = 2
export const toLeastOneFixed = (balance, decimals, displayDecimals = DISPLAY_DECIMALS) => {
  const value = BN(balance.toString())
  const decimalsValue = BN(10).pow(decimals)
  const isLessThenDisplay = decimals > 6 && !value.eq(0) && value.abs().lt(BN(10).pow(decimals - displayDecimals + 1))
  if (isLessThenDisplay) {
    return toFixed(value, decimalsValue, decimals - value.abs().toString().length + 1)
  }
  return toFixed(value, decimalsValue, displayDecimals)
}
