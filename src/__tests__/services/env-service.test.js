import { isProEnv } from '@/services/env-service'

test('pr-sg is Pro env', () => {
  const result = isProEnv('pr-sg')
  expect(result).toBeTruthy()
})

test('xpr-sg is not Pro env', () => {
  const result = isProEnv('xpr-sg')
  expect(result).toBeFalsy()
})
