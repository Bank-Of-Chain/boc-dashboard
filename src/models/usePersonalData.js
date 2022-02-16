import { useRequest } from 'umi';
import {
    getAccountDetail,
    getDaysAgoTimestamp,
    getPastLatestAccountDailyData,
    getVaultSummaryData,
} from '@/services/dashboard-service';
import { noop } from 'lodash';

const dataMerge = () => {
  const account = '0x2346c6b1024e97c50370c783a66d80f577fe991d'
  return Promise.all([
    getVaultSummaryData(),
    getAccountDetail(account),
    getPastLatestAccountDailyData(account, getDaysAgoTimestamp(30))
      .then(data => {
        return data?.accountDailyDatas[0]
      })
      .catch(noop)
  ])
    .then((rs) => {
      const [vaultSummary = {}, accountDetail = {}, pastLatestAccountDailyData = {}] = rs;
      const nextData = {
        vaultSummary: vaultSummary?.data,
        accountDetail: accountDetail?.data?.account,
        pastLatestAccountDailyData,
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