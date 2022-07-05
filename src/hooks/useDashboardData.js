import { useEffect, useState } from 'react'
import { useModel } from 'umi'
import { getDashboardDetail } from '@/services/dashboard-service'

// === Utils === //
import isEmpty from 'lodash/isEmpty'

const dataMerge = initialState => {
  const { vault, chain, vaultAddress, tokenAddress, vaultBufferAddress } = initialState
  if (isEmpty(tokenAddress) || isEmpty(vaultAddress)) {
    return Promise.reject(new Error('token地址或vault地址获取失败'))
  }
  return getDashboardDetail(vault, chain, tokenAddress, vaultAddress, vaultBufferAddress).catch(
    error => {
      console.error('DashBoard数据初始化失败', error)
      return {
        pegToken: {
          totalSupply: '0',
          holderCount: '0',
        },
        vault: {
          totalAssets: '0',
          strategies: [],
        },
        vaultBuffer: {
          totalSupply: '0',
        },
      }
    },
  )
}

export default function useDashboardData () {
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
    loading,
  }
}
