import { bestIntervalForArrays, bestInterval } from '@/utils/echart-utils'

test('echart-utils bestIntervalForArrays with empty array', () => {
  const result = bestIntervalForArrays([])
  expect(result).toStrictEqual([0, 100])
})

test('echart-utils bestIntervalForArrays with equal element array', () => {
  const result = bestIntervalForArrays([[1, 1, 1, 1, 1, 1, 1, 1, 1]], {
    startIndex: 3,
    rateOfChange: 500
  })
  expect(result).toStrictEqual([0, 100])
})

test('echart-utils bestIntervalForArrays with arrays', () => {
  const result = bestIntervalForArrays(
    [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 2, 2, 2, 2, 2]
    ],
    {
      startIndex: 3,
      rateOfChange: 500
    }
  )
  expect(result).toStrictEqual([50.5, 100])
})

test('echart-utils bestIntervalForArrays with one of array is not enough', () => {
  const result = bestIntervalForArrays([[1, 1, 1, 1, 1, 1, 1, 1, 1, 1], [1]], {
    startIndex: 3,
    rateOfChange: 500
  })
  expect(result).toStrictEqual([0, 100])
})

test('echart-utils bestInterval with empty array', () => {
  const result = bestInterval([])
  expect(result).toBe(0)
})

test('echart-utils bestInterval with equal element array', () => {
  const result = bestInterval([1, 1, 1, 1, 1, 1, 1, 1, 1, 1])
  expect(result).toBe(0)
})

test('echart-utils bestInterval with array', () => {
  const result = bestInterval([1, 1, 1, 1, 1, 2, 2, 2, 2, 2])
  expect(result).toBe(50.5)
})

test('echart-utils bestInterval with startIndex = 30', () => {
  const result = bestInterval([1, 1, 1, 1, 1, 2, 2, 2, 2, 2], {
    startIndex: 30
  })
  expect(result).toBe(0)
})
