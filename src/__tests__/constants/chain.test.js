import CHAINS, { ETH, MATIC } from '@/constants/chain'

test('support chains has 2', () => {
  expect(CHAINS.length).toBe(2)
})

test('eth decimals is 1e6', () => {
  expect(ETH.decimals.toString()).toBe('1000000')
})

test('matic decimals is 1e18', () => {
  expect(MATIC.decimals.toString()).toBe('1000000')
})
