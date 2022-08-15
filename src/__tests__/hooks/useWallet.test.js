import { renderHook } from '@testing-library/react-hooks'
import useWallet from '@/hooks/useWallet'

test('useWallet hooks Render', () => {
  renderHook(() => useWallet())
})
