import { useModel } from 'umi';
import {
  getAccountDetail,
  getDaysAgoTimestamp,
  getPastLatestAccountDailyData,
  getPastLatestVaultDailyData,
  getVaultDailyData,
  getVaultSummaryData,
  getAccountDetailByDays,
  getVaultDailyByDays
} from '@/services/dashboard-service';

// === Utils === //
import moment from 'moment';
import isEmpty from 'lodash/isEmpty';
import filter from 'lodash/filter';
import pick from 'lodash/pick';
import map from 'lodash/map';
import { arrayAppendOfDay, usedPreValue } from '@/helper/array-append'
import { useEffect, useState } from 'react';
import * as ethers from "ethers";
import useUserProvider from '@/hooks/useUserProvider'
import {getDecimals} from '@/apollo/client'

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
},
{
  "inputs": [],
  "name": "pricePerShare",
  "outputs": [{
    "internalType": "uint256",
    "name": "",
    "type": "uint256"
  }],
  "stateMutability": "view",
  "type": "function"
}]

/**
 * 预处理数据
 * @param {*} rs
 * @returns
 */
const appendAccountDailyDatas = (rs) => {
  if(isEmpty(rs)||rs.loading) return []
  const { data: { accountDailyDatas }} = rs
  // 补齐到365条
  const appendArray = arrayAppendOfDay(accountDailyDatas, 365, 'dayTimestamp')
  // 补齐字段数据
  const setDefaultValueArray = usedPreValue(appendArray, 'currentDepositedUSDT')
  const setDefaultShareArray = usedPreValue(setDefaultValueArray, 'currentShares')
  // 选取里面有用的字段
  const result = map(setDefaultShareArray, i => pick(i, ['dayTimestamp', 'currentDepositedUSDT', 'accumulatedProfit', 'currentShares']))
  return result
}

const appendVaultDailyDatas  = rs => {
  if(isEmpty(rs) || rs.loading) return []
  const { data: { vaultDailyDatas }} = rs
  // 补齐到365条
  const appendArray = arrayAppendOfDay(vaultDailyDatas, 365, 'id')
  // 补齐字段数据
  const setDefaultValueArray = usedPreValue(appendArray, 'pricePerShare')
  // 选取里面有用的字段
  const result = map(setDefaultValueArray, i => pick(i, ['id', 'pricePerShare', 'unlockedPricePerShare']))
  return result
}

const dataMerge = (account, requests) => {
  if(isEmpty(account)) return Promise.resolve({})
  const thirtyDaysAgoTimestamp = getDaysAgoTimestamp(30)
  // 13个月前的秒数
  const time = moment().subtract(1, 'year').subtract(1, 'month').startOf('day').valueOf() / 1000
  return Promise.all([
    getVaultSummaryData(),
    getAccountDetail(account),
    getPastLatestAccountDailyData(account, thirtyDaysAgoTimestamp),
    getVaultDailyData(30),
    getPastLatestVaultDailyData(thirtyDaysAgoTimestamp),
    // 获取过去一年的数据
    getAccountDetailByDays(account, time).then(appendAccountDailyDatas),
    getVaultDailyByDays(time).then(appendVaultDailyDatas),
    ...requests
  ])
    .then((rs) => {
      const [
          vaultSummary = {},
          accountDetail = {},
          pastLatestAccountDailyData = {},
          vaultDailyDatas = [],
          pastLatestVaultDailyData = {},
          accountDailyDatasInYear = {},
          vaultDailyDatesInYear = {},
          liveAcountShares,
          livePricePerShare
        ] = rs;
      const nextData = {
        vaultSummary: vaultSummary?.data,
        accountDetail: accountDetail?.data?.account,
        pastLatestAccountDailyData: pastLatestAccountDailyData?.data?.accountDailyDatas[0],
        vaultDailyDatas,
        pastLatestVaultDailyData: pastLatestVaultDailyData?.data?.vaultDailyDatas[0],
        accountDailyDatasInYear,
        vaultDailyDatesInYear,
        vaultLastUpdateTime: vaultDailyDatas.length>0?vaultDailyDatas[vaultDailyDatas.length-1].id : undefined,
        liveAcountShares,
        livePricePerShare
      };
      return nextData;
    })
    .catch((error) => {
      console.error('Personal数据初始化失败', error);
    });
};

export default function usePersonalData() {
  const [data, setData] = useState({})
  const [loading, setLoading] = useState(false)
  const {
    initialState
  } = useModel('@@initialState')
  const { userProvider } = useUserProvider()

  useEffect(() => {
    setLoading(true)
    const requests = []
    if (!isEmpty(userProvider) && initialState?.address) {
      const vaultAddress = VAULT_ADDRESS[initialState?.chain]
      const vaultContract = new ethers.Contract(vaultAddress, ABI, userProvider)
      requests.push(vaultContract.balanceOf(initialState?.address).catch((e) => {
        console.error(e)
        return BigNumber.from(0)
      }))
      requests.push(vaultContract.pricePerShare().catch((e) => {
        console.error(e)
        return BigNumber.from(getDecimals().toString())
      }))
    }
    dataMerge(initialState?.address?.toLowerCase(), requests).then(r => {
      setData(r)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [initialState?.address, userProvider, initialState?.chain])

  return {
    dataSource: data,
    loading: loading,
  };
}
