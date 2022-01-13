import {
  useRequest
} from 'umi';
import {
  fetchData,
  getVaultDetails,
  getVaultDailyData,
  getVaultHourlyData,
  getProtocols,
  getStrategyById
} from '@/services/dashboard-service';

const dataMerge = () => {
  return Promise.all([getVaultDetails()]).then((rs) => {
    const [vaultDetail] = rs
    const nextData = {
      vaultDetail: vaultDetail.data
    }
    return {
      data: nextData
    }
  })
}

export default function useDashboardData() {
  const msg = useRequest(() => dataMerge());
  return {
    dataSource: msg.data,
    reload: msg.run,
    loading: msg.loading,
  };
}
