import { map, reverse, findIndex, max, isNil, every } from 'lodash'

//默认配置
const DEFAULT_OPTIONS = {
  // 变化比率，增加/减少5%以上，则需求减弱
  rateOfChange: 500, //base 10000,
  startIndex: 0
}
export const bestIntervalForArrays = (arrays = [], options = DEFAULT_OPTIONS) => {
  const maxPercent = 100
  const minPercentArray = map(arrays, i => bestInterval(i, options))
  console.log('minPercentArray=', minPercentArray)
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
      //如果从这个点往前，数据都是null，那就没有必要展示了
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
