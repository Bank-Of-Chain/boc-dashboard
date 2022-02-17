import { useRequest } from 'umi';
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

const dataMerge = () => {
  const account = '0x2346c6b1024e97c50370c783a66d80f577fe991d'
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
      return {
        data: nextData,
      };
    })
    .catch((error) => {
      console.error('Personal数据初始化失败', error);
    });
};

export default function usePersonalData() {
  const msg = useRequest(() => dataMerge());
  return {
    dataSource: msg.data,
    reload: msg.run,
    loading: msg.loading,
  };
}
