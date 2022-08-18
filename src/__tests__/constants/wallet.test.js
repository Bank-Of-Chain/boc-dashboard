import { WALLET_OPTIONS } from '@/constants/wallet'

test('2 wallet support', () => {
  expect(WALLET_OPTIONS.length).toBe(2)
})
