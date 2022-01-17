import {
  useRequest
} from 'umi';
import {
  fetchData,
  getVaultDetails,
  getVaultDailyData,
  getVaultHourlyData,
  getProtocols,
  getStrategyById,
  getTransations,
  getVaultTodayData,
} from '@/services/dashboard-service';

const dataMerge = () => {
  return Promise.all([getVaultDetails(), getVaultTodayData()]).then((rs) => {
    const [vaultDetail = {}, vaultTodayData = {}] = rs;
    const nextData = {
      vaultDetail: vaultDetail?.data,
      vaultTodayData: vaultTodayData?.data,
    };
    return {
      data: nextData,
    };
  }).catch(error => {
    console.error('DashBoard数据初始化失败', error)
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
