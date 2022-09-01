import { map, reverse, findIndex, max, isNil, every, isEmpty } from 'lodash'

const DEFAULT_OPTIONS = {
  rateOfChange: 500, //base 10000,
  startIndex: 0
}
export const bestIntervalForArrays = (arrays = [], options = DEFAULT_OPTIONS) => {
  const maxPercent = 100
  if (isEmpty(arrays)) return [0, maxPercent]
  const minPercentArray = map(arrays, i => bestInterval(i, options))
  return [max(minPercentArray), maxPercent]
}

export const bestInterval = (array = [], options = DEFAULT_OPTIONS) => {
  const { rateOfChange = DEFAULT_OPTIONS.rateOfChange, startIndex } = options
  const nextRateOfChange = rateOfChange / 10000
  const reverseArray = reverse([...array])
  const continuousIndex = findIndex(reverseArray, (item, index) => {
    if (index <= startIndex) return false
    if (index === reverseArray.length) return true
    if (isNil(item)) {
      const arrayAfterCurrent = reverseArray.slice(index)
      // If data after current are all nil, no need to show
      if (every(arrayAfterCurrent, isNil)) {
        return true
      }
      return false
    }
    return Math.abs(item - reverseArray[index - 1]) > nextRateOfChange * item
  })
  const startPercent = continuousIndex === -1 ? 0 : 100.5 - (100 * continuousIndex) / array.length
  return startPercent
}
