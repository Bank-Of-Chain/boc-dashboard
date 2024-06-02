import { renderHook } from '@testing-library/react-hooks'
import useUserAddress from '@/hooks/useUserAddress'
import { mockProvider } from './../jest'

// === Utils === //
import { isEmpty } from 'lodash'

test('useUserAddress hooks Render', async () => {
  const { result, waitFor } = renderHook(() => useUserAddress(mockProvider()))
  await waitFor(() => !isEmpty(result.current))
  expect(result.current).toBe('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266')
})
