import { useEffect, useState } from 'react'

// === Services === //
import { getStrategyExtends } from '@/services/api-service'

const useStrategyDetails = (chainId, vaultAddress, strategyId) => {
  const [data, setData] = useState({})

  useEffect(() => {
    getStrategyExtends(chainId, vaultAddress, strategyId)
      .then(v => setData(v.result))
      .catch(() => {
        setData({})
      })
  }, [chainId, vaultAddress, strategyId])

  return data
}

export default useStrategyDetails
