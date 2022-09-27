import { toFixed, toLeastOneFixed, formatApyLabel, formatApyValue } from '@/utils/number-format'

test('number-format toFixed', () => {
  const text = toFixed('10000', '100')
  expect(text).toBe('100')
})

test('number-format toFixed with value undefined', () => {
  const text = toFixed(undefined, '100')
  expect(text).toBe(undefined)
})

test('number-format toFixed with value null', () => {
  const text = toFixed(null, '100')
  expect(text).toBe(undefined)
})

test('number-format toFixed with decimals undefined', () => {
  const text = toFixed('10000', undefined)
  expect(text).toBe('10000')
})

test('number-format toFixed with decimals null', () => {
  const text = toFixed('10000', null)
  expect(text).toBe('10000')
})

test('number-format toLeastOneFixed', () => {
  const text = toLeastOneFixed('10000', 2)
  expect(text).toBe(100)
})

test('number-format formatApyLabel', () => {
  const text = formatApyLabel('10000')
  expect(text).toBe('1000+')
})

test('number-format formatApyLabel', () => {
  const text = formatApyLabel('10')
  expect(text).toBe(10)
})

test('number-format formatApyLabel', () => {
  const text = formatApyLabel(null)
  expect(text).toBe(null)
})

test('number-format formatApyValue', () => {
  const text = formatApyValue('10000')
  expect(text).toBe(1000)
})

test('number-format formatApyValue', () => {
  const text = formatApyValue('100')
  expect(text).toBe(100)
})

test('number-format formatApyValue', () => {
  const text = formatApyValue(null)
  expect(text).toBe(null)
})

test('number-format toLeastOneFixed small value', () => {
  const text = toLeastOneFixed(815436538078, 18, 4)
  expect(text).toBe('0.0000008')
})
