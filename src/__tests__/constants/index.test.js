import { APY_DURATION, TOKEN_TYPE } from '@/constants/index'

test('has 4 apy duration types', () => {
  expect(Object.keys(APY_DURATION).length).toBe(4)
})

test('has 2 token types', () => {
  expect(Object.keys(TOKEN_TYPE).length).toBe(2)
})
