import { useRequest } from 'umi';
import {
  getVaultDetails,
  getVaultDailyData,
  getVaultTodayData,
} from '@/services/dashboard-service';
import { arrayAppendOfDay, usedPreValue } from '@/utils/array-append';

const dataMerge = () => {
  return Promise.all([
    getVaultDetails(),
    getVaultTodayData(),
    getVaultDailyData(60)
      .then((array) => arrayAppendOfDay(array, 60))
      .then((array) => usedPreValue(array, 'holderCount', 0))
      .then((array) => usedPreValue(array, 'totalShares', undefined))
      .then((array) => usedPreValue(array, 'unlockedPricePerShare', undefined))
      .then((array) => array.slice(-31)),
  ])
    .then((rs) => {
      const [vaultDetail = {}, vaultTodayData = {}, vaultDailyData = []] = rs;
      const nextData = {
        vaultDetail: vaultDetail?.data,
        vaultTodayData: vaultTodayData?.data,
        vaultDailyData,
      };
      return {
        data: nextData,
      };
    })
    .catch((error) => {
      console.error('DashBoard数据初始化失败', error);
    });
};

export default function useDashboardData() {
  const msg = useRequest(() => dataMerge());
  return {
    dataSource: msg.data,
    reload: msg.run,
    loading: msg.loading,
  };
}
