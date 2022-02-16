import { useRequest } from 'umi';
import {
    getAccountDetail,
    getDaysAgoTimestamp,
    getPastLatestAccountDailyData,
    getPastLatestVaultDailyData,
    getVaultDailyData,
    getVaultSummaryData,
} from '@/services/dashboard-service';

const dataMerge = () => {
  const account = '0x2346c6b1024e97c50370c783a66d80f577fe991d'
  const thirtyDaysAgoTimestamp = getDaysAgoTimestamp(30)
  return Promise.all([
    getVaultSummaryData(),
    getAccountDetail(account),
    getPastLatestAccountDailyData(account, thirtyDaysAgoTimestamp),
    getVaultDailyData(30),
    getPastLatestVaultDailyData(thirtyDaysAgoTimestamp)
  ])
    .then((rs) => {
      const [
          vaultSummary = {},
          accountDetail = {},
          pastLatestAccountDailyData = {}, 
          vaultDailyDatas = [],
          pastLatestVaultDailyData = {},
        ] = rs;
      const nextData = {
        vaultSummary: vaultSummary?.data,
        accountDetail: accountDetail?.data?.account,
        pastLatestAccountDailyData: pastLatestAccountDailyData?.data?.accountDailyDatas[0],
        vaultDailyDatas,
        pastLatestVaultDailyData: pastLatestVaultDailyData?.data?.vaultDailyDatas[0],
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