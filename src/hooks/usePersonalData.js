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
import useWallet from '@/hooks/useWallet'
import {toFixed} from '@/utils/number-format'
import { USDI_BN_DECIMALS } from "@/constants/usdi"

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

const dataMerge = (account, chain, requests) => {
  if(isEmpty(account)) return Promise.resolve({})

  // 当前天的字符串，按0时区算
  const date = moment().utc(0).format('yyyy-MM-DD')
  return Promise.all([
    // 获取7日apy数值
    getAccountApyByAddress(chain, account, date, 'weekly'),
    // 获取30日apy数值
    getAccountApyByAddress(chain, account, date, 'monthly'),
    // 获取tvl数据
    getPersonTvlArray(chain, account),
    // 获取月度盈利数据
    getMonthProfits(chain, account),
    getProfits(chain, account),
    ...requests
  ])
    .then((rs) => {
      const [
          day7Apy,
          day30Apy,
          tvls,
          monthProfits,
          profit,
          balanceOfUsdi,
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
        balanceOfUsdi
      };

      return nextData;
    })
    .catch((error) => {
      console.error('PersonalV2数据初始化失败', error);
      return {}
    });
}

export default function usePersonalData() {
  const [data, setData] = useState({})
  const [loading, setLoading] = useState(false)
  const {
    initialState
  } = useModel('@@initialState')
  const { userProvider } = useWallet()

  useEffect(() => {
    if (!initialState?.address || !userProvider || !initialState?.chain) {
      return
    }
    setLoading(true)
    const requests = []
    if (!isEmpty(userProvider) && initialState?.address) {
      const usdiAddress = USDI_ADDRESS[initialState?.chain]
      const usdiContract = new ethers.Contract(usdiAddress, ABI, userProvider)
      requests.push(usdiContract.balanceOf(initialState?.address).catch(() => BigNumber.from(0)))
    }
    dataMerge(initialState?.address?.toLowerCase(), initialState?.chain, requests).then(r => {
      setData(r)
      setLoading(false)
    }).finally(() => setLoading(false))
  }, [initialState?.address, userProvider, initialState?.chain])

  return {
    dataSource: data,
    loading: loading,
  };
}
