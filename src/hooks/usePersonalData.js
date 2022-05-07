import { useModel } from 'umi';

import {
  getProfits,
  getPersonTvlArray,
  getMonthProfits,
  getAccountApyByAddress,
} from '@/services/api-service';

// === Utils === //
import moment from 'moment';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
import { reverse, find } from 'lodash'
import { useEffect, useState } from 'react';
import * as ethers from "ethers";
import useUserProvider from '@/hooks/useUserProvider'
import {toFixed} from '@/utils/number-format'
import { USDI_BN_DECIMALS } from "@/constants/usdi"
import { APY_DURATION } from "@/constants/api"

const { BigNumber } = ethers

const ABI = [{
  "inputs": [{
    "internalType": "address",
    "name": "account",
    "type": "address"
  }],
  "name": "balanceOf",
  "outputs": [{
    "internalType": "uint256",
    "name": "",
    "type": "uint256"
  }],
  "stateMutability": "view",
  "type": "function"
}]

const dataMerge = (account, chain, tokenType, requests) => {
  if(isEmpty(account)) return Promise.resolve({})

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
    .then((rs) => {
      const [
        day7Apy,
        day30Apy,
        tvls,
        monthProfits,
        profit,
        balanceOfToken,
      ] = rs;

      const monthProfitsData = []
      for (let i = 0; i < 12; i++) {
        const month = moment().utcOffset(0).subtract(i, 'months').format('YYYY-MM')
        const profit = find(monthProfits, item => item.month === month)?.profit || 0
        monthProfitsData.push(toFixed(profit, USDI_BN_DECIMALS, 2))
      }
      const nextData = {
        day7Apy,
        day30Apy,
        tvls: reverse(map(tvls.content, item => ({
          date: item.date,
          balance: toFixed(item.balance, USDI_BN_DECIMALS, 2)
        }))),
        monthProfits: reverse(monthProfitsData),
        realizedProfit: profit.realizedProfit,
        unrealizedProfit: profit.unrealizedProfit,
        balanceOfToken
      };

      return nextData;
    })
    .catch((error) => {
      console.error('PersonalV2数据初始化失败', error);
      return {}
    });
}

export default function usePersonalData(tokenType) {
  const [data, setData] = useState({})
  const [loading, setLoading] = useState(false)
  const {
    initialState
  } = useModel('@@initialState')
  const { userProvider } = useUserProvider()

  useEffect(() => {
    if (!initialState?.address || !userProvider || !initialState?.chain) {
      return
    }
    setLoading(true)
    const requests = []
    if (!isEmpty(userProvider) && initialState?.address) {
      const tokenContract = new ethers.Contract(initialState.tokenAddress, ABI, userProvider)
      requests.push(tokenContract.balanceOf(initialState?.address).catch(() => BigNumber.from(0)))
    }
    dataMerge(initialState?.address?.toLowerCase(), initialState?.chain, tokenType, requests).then(r => {
      setData(r)
      setLoading(false)
    }).finally(() => setLoading(false))
  }, [initialState?.address, userProvider, initialState?.chain])

  return {
    dataSource: data,
    loading: loading,
  };
}
