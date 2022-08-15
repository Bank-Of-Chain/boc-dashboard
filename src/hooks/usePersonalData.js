import { useModel } from 'umi'

import { getProfits, getPersonTvlArray, getMonthProfits, getAccountApyByAddress } from '@/services/api-service'

// === Utils === //
import moment from 'moment'
import isEmpty from 'lodash/isEmpty'
import map from 'lodash/map'
import { reverse, find } from 'lodash'
import { useEffect, useState } from 'react'
import * as ethers from 'ethers'
import { toFixed } from '@/utils/number-format'
import { USDI_BN_DECIMALS } from '@/constants/usdi'
import { APY_DURATION } from '@/constants/api'
import { VAULT_TYPE, TOKEN_DISPLAY_DECIMALS } from '@/constants/vault'
import { ETHI_DISPLAY_DECIMALS } from '@/constants/ethi'
import { getJsonRpcProvider } from '@/utils/json-provider'

const { BigNumber } = ethers

const ABI = [
  {
    inputs: [
      {
        internalType: 'address',
        name: 'account',
        type: 'address'
      }
    ],
    name: 'balanceOf',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  }
]

const dataMerge = (account, chain, vault, tokenType, requests) => {
  if (isEmpty(account)) return Promise.resolve({})

  const params = {
    chainId: chain,
    tokenType
  }
  // 当前天的字符串，按0时区算
  const date = moment().subtract(1, 'days').utc(0).format('yyyy-MM-DD')
  return Promise.all([
    // 获取7日apy数值
    getAccountApyByAddress(account, date, {
      duration: APY_DURATION.weekly,
      ...params
    }),
    // 获取30日apy数值
    getAccountApyByAddress(account, date, {
      duration: APY_DURATION.monthly,
      ...params
    }),
    // 获取tvl数据
    getPersonTvlArray(account, params),
    // 获取月度盈利数据
    getMonthProfits(account, params),
    getProfits(account, params),
    ...requests
  ])
    .then(rs => {
      const [day7Apy, day30Apy, tvls, monthProfits, profit, balanceOfToken] = rs

      const displayDecimals = {
        [VAULT_TYPE.USDi]: TOKEN_DISPLAY_DECIMALS,
        [VAULT_TYPE.ETHi]: ETHI_DISPLAY_DECIMALS
      }[vault]

      const monthProfitsData = []
      for (let i = 0; i < 12; i++) {
        const month = moment().utcOffset(0).subtract(i, 'months').format('YYYY-MM')
        const profit = find(monthProfits, item => item.month === month)?.profit || 0
        monthProfitsData.push(toFixed(profit, USDI_BN_DECIMALS, displayDecimals))
      }
      const nextData = {
        day7Apy,
        day30Apy,
        tvls: reverse(
          map(tvls.content, item => ({
            date: item.date,
            balance: toFixed(item.balance, USDI_BN_DECIMALS, displayDecimals)
          }))
        ),
        monthProfits: reverse(monthProfitsData),
        realizedProfit: profit.realizedProfit,
        unrealizedProfit: profit.unrealizedProfit,
        balanceOfToken
      }

      return nextData
    })
    .catch(error => {
      console.error('PersonalV2数据初始化失败', error)
      return {}
    })
}

export default function usePersonalData(tokenType) {
  const [data, setData] = useState({})
  const [loading, setLoading] = useState(false)
  const { initialState } = useModel('@@initialState')

  useEffect(() => {
    const jsonRpcProvider = getJsonRpcProvider(initialState?.chain)
    if (!initialState?.address || !jsonRpcProvider || !initialState?.chain) {
      return
    }
    setLoading(true)
    const requests = []
    const tokenContract = new ethers.Contract(initialState.tokenAddress, ABI, jsonRpcProvider)
    requests.push(tokenContract.balanceOf(initialState?.address).catch(() => BigNumber.from(0)))
    dataMerge(initialState?.address?.toLowerCase(), initialState?.chain, initialState?.vault, tokenType, requests)
      .then(r => {
        setData(r)
        setLoading(false)
      })
      .finally(() => setLoading(false))
  }, [initialState?.address, initialState?.chain])

  return {
    dataSource: data,
    loading: loading
  }
}
