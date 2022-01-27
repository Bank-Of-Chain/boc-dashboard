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
