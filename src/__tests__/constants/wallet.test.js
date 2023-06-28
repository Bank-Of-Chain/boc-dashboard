import { WALLET_OPTIONS } from '@/constants/wallet'

test('1 wallet support', () => {
  expect(WALLET_OPTIONS.length).toBe(1)
})
