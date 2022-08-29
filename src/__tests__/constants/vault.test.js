import { VAULT_TYPE } from '@/constants/vault'

test('has 2 vault types', () => {
  expect(Object.keys(VAULT_TYPE).length).toBe(2)
})
