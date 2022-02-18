import { useModel } from 'umi';
import {
  getAccountDetail,
  getDaysAgoTimestamp,
  getPastLatestAccountDailyData,
  getPastLatestVaultDailyData,
  getVaultDailyData,
  getVaultSummaryData,
  getAccountDetailByDays
} from '@/services/dashboard-service';

// === Utils === //
import moment from 'moment';
import isEmpty from 'lodash/isEmpty';
import filter from 'lodash/filter';
import pick from 'lodash/pick';
import map from 'lodash/map';
import { arrayAppendOfDay, usedPreValue } from '@/helper/array-append'
import { useEffect, useState } from 'react';

/**
 * 预处理数据
 * @param {*} rs
 * @returns
 */
const appendAccountDailyDatas = (rs) => {
  if(isEmpty(rs)||rs.loading) return []
  const { data: { accountDailyDatas }} = rs
  // 格式化数据
  const list = map(accountDailyDatas, i => {
    return {
      ...i,
      // 时间戳
      dayTimestamp: 1 * i.dayTimestamp,
      // 用户当前的tvl
      currentDepositedUSDT: 1 * i.currentDepositedUSDT,
      // 用户这一天的盈利
      accumulatedProfit: 1 * i.accumulatedProfit
    }
  })
  // 补齐到365条
  const appendArray = arrayAppendOfDay(list, 365, 'dayTimestamp')
  // 补齐字段数据
  const setDefaultValueArray = usedPreValue(appendArray, 'currentDepositedUSDT')
  // 将无用的数据过滤
  const filterArray = filter(setDefaultValueArray, i => i.currentDepositedUSDT > 0 || i.accumulatedProfit > 0)
  // 选取里面有用的字段
  const result = map(filterArray, i => pick(i, ['dayTimestamp', 'currentDepositedUSDT', 'accumulatedProfit']))
  return result
}

const dataMerge = (account) => {
  if(isEmpty(account)) return Promise.resolve({})
  const thirtyDaysAgoTimestamp = getDaysAgoTimestamp(30)
  return Promise.all([
    getVaultSummaryData(),
    getAccountDetail(account),
    getPastLatestAccountDailyData(account, thirtyDaysAgoTimestamp),
    getVaultDailyData(30),
    getPastLatestVaultDailyData(thirtyDaysAgoTimestamp),
    // 获取过去一年的数据
    getAccountDetailByDays(account, moment().subtract(1, 'year').startOf('day').valueOf() / 1000)
  ])
    .then((rs) => {
      const [
          vaultSummary = {},
          accountDetail = {},
          pastLatestAccountDailyData = {},
          vaultDailyDatas = [],
          pastLatestVaultDailyData = {},
          accountDailyDatasInYear = {}
        ] = rs;
      const nextData = {
        vaultSummary: vaultSummary?.data,
        accountDetail: accountDetail?.data?.account,
        pastLatestAccountDailyData: pastLatestAccountDailyData?.data?.accountDailyDatas[0],
        vaultDailyDatas,
        pastLatestVaultDailyData: pastLatestVaultDailyData?.data?.vaultDailyDatas[0],
        accountDailyDatasInYear: appendAccountDailyDatas(accountDailyDatasInYear)
      };
      console.log('nextData=', nextData);
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

  useEffect(() => {
    setLoading(true)
    dataMerge(initialState?.address).then(r => {
      setData(r)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [initialState?.address])

  return {
    dataSource: data,
    loading: loading,
  };
}
