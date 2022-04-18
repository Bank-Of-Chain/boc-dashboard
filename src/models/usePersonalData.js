import { useModel } from 'umi';

// === Services === //
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
import {
  getProfits,
  getTvlArray,
  getMonthProfits,
  getAccountApyByAddress,
} from '@/services/api-service';

// === Utils === //
import moment from 'moment';
import isEmpty from 'lodash/isEmpty';
import pick from 'lodash/pick';
import map from 'lodash/map';
import { arrayAppendOfDay, usedPreValue } from '@/utils/array-append'
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
  // 补齐到365条，最新一天没数据不展示
  const appendArray = arrayAppendOfDay(accountDailyDatas, 366, 'dayTimestamp').slice(-365)
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
  // 补齐到365条，最新一天没数据不展示
  const appendArray = arrayAppendOfDay(vaultDailyDatas, 366, 'id').slice(-365)
  // 补齐字段数据
  let setDefaultValueArray = usedPreValue(appendArray, 'pricePerShare')
  setDefaultValueArray = usedPreValue(setDefaultValueArray, 'unlockedPricePerShare')
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

const dataMergeV2 = (account, chain, requests) => {
  if(isEmpty(account)) return Promise.resolve({})

  // 当前天的字符串，按0时区算
  const date = moment().utc(0).format('yyyy-MM-DD')
  return Promise.all([
    // 获取7日apy数值
    getAccountApyByAddress(chain, account, date, 'weekly'),
    // 获取30日apy数值
    getAccountApyByAddress(chain, account, date, 'monthly'),
    // 获取tvl数据
    getTvlArray(chain, account),
    // 获取月度盈利数据
    getMonthProfits(account, chain),
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
      const nextData = {
        day7Apy,
        day30Apy,
        tvls,
        monthProfits,
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
  const [dataV2, setDataV2] = useState({})
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
    }).finally(() => setLoading(false))

  }, [initialState?.address, userProvider, initialState?.chain])

  useEffect(() => {
    setLoading(true)
    const requests = []
    if (!isEmpty(userProvider) && initialState?.address) {
      const usdiAddress = USDI_ADDRESS[initialState?.chain]
      const usdiContract = new ethers.Contract(usdiAddress, ABI, userProvider)
      requests.push(usdiContract.balanceOf(initialState?.address).catch(() => BigNumber.from(0)))
    }
    dataMergeV2(initialState?.address?.toLowerCase(), initialState?.chain, requests).then(r => {
      setDataV2(r)
      setLoading(false)
    }).finally(() => setLoading(false))
  }, [initialState?.address, userProvider, initialState?.chain])

  return {
    dataV2,
    dataSource: data,
    loading: loading,
  };
}
