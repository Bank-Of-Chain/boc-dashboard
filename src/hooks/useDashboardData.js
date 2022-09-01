import { useEffect, useState } from 'react'

// === Services === //
import { getDashboardDetail } from '@/services/dashboard-service'

// === Utils === //
import { useModel } from 'umi'
import isEmpty from 'lodash/isEmpty'

const dataMerge = initialState => {
  const { vault, chain, vaultAddress, tokenAddress, vaultBufferAddress } = initialState
  if (isEmpty(tokenAddress) || isEmpty(vaultAddress)) {
    return Promise.reject(new Error('fetch tokenAddress or vaultAddress failed'))
  }
  return getDashboardDetail(vault, chain, tokenAddress, vaultAddress, vaultBufferAddress).catch(error => {
    console.error('init DashBoard data failed', error)
    return {
      pegToken: {
        totalSupply: '0',
        holderCount: '0'
      },
      vault: {
        totalAssets: '0',
        strategies: []
      },
      vaultBuffer: {
        totalSupply: '0'
      }
    }
  })
}

export default function useDashboardData() {
  const [data, setData] = useState({})
  const [loading, setLoading] = useState(false)
  const { initialState } = useModel('@@initialState')

  useEffect(() => {
    if (initialState?.chain) {
      setLoading(true)
      dataMerge(initialState)
        .then(setData)
        .finally(() => {
          setLoading(false)
        })
    }
  }, [initialState?.chain, initialState?.vault])

  return {
    dataSource: data,
    loading
  }
}
