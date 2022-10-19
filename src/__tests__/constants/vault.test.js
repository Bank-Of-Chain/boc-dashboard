import { VAULT_TYPE } from '@/constants/vault'

test('has 4 vault types', () => {
  expect(Object.keys(VAULT_TYPE).length).toBe(4)
})
