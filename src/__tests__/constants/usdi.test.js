import { RECENT_ACTIVITY_TYPE } from '@/constants/usdi'

test('has 4 activity types', () => {
  expect(Object.keys(RECENT_ACTIVITY_TYPE).length).toBe(4)
})
