import { useEffect, useState } from 'react'

// === Services === //
import { getStrategyExtends } from '@/services/api-service'
import { isEmpty } from 'lodash'

const useStrategyDetails = (chainId, vaultAddress, strategyId) => {
  const [data, setData] = useState({})

  useEffect(() => {
    getStrategyExtends(chainId, vaultAddress, strategyId)
      .then((v = {}) => {
        const { result } = v
        if (!isEmpty(result)) {
          setData(result)
        }
      })
      .catch(() => {
        setData({})
      })
  }, [chainId, vaultAddress, strategyId])

  return data
}

export default useStrategyDetails
