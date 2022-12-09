import { useCallback } from 'react'

// === Hooks === //
import useRise from '@/hooks/useRise'

// === Services === //
import { getStrategyExtends } from '@/services/api-service'

const useStrategyDetails = (vaultAddress, strategyId) => {
  const promiseCall = useCallback(() => {
    return getStrategyExtends()
  }, [vaultAddress, strategyId])

  const abcFetch = useCallback(async () => {
    return promiseCall().then(rs => rs.totalElements)
  }, [promiseCall])

  const bcdFetch = useCallback(async () => {
    return promiseCall().then(rs => rs.size)
  }, [promiseCall])

  const { element: a } = useRise(abcFetch)

  const { element: b } = useRise(bcdFetch)

  return {
    a,
    b,
    UNDERLYING_LIQUIDITY: '123',
    ETH_POS: '10.55%',
    LIMIT_ORDER: 323,
    STRATEGY_LEVERAGE: 113,
    UNDERLYING_BORROW: 2333,
    INTEREST_BORROW_APY: 1231
  }
}

export default useStrategyDetails
