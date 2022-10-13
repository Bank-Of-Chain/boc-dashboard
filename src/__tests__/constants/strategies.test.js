import { USDI_ETH_STRATEGIES_MAP, USDI_MATIC_STRATEGIES_MAP, ETHI_ETH_STRATEGIES_MAP } from '@/constants/strategies'

test('eth usdi has 17 platform', () => {
  expect(USDI_ETH_STRATEGIES_MAP.length).toBe(17)
})

test('matic usdi has 12 platform', () => {
  expect(USDI_MATIC_STRATEGIES_MAP.length).toBe(12)
})

test('eth ethi has 8 platform', () => {
  expect(ETHI_ETH_STRATEGIES_MAP.length).toBe(8)
})
