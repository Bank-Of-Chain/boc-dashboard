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
  getTransations
} from '@/services/dashboard-service';

const dataMerge = () => {
  return Promise.all([getVaultDetails(), getTransations()]).then((rs) => {
    const [vaultDetail, transations] = rs
    const nextData = {
      vaultDetail: vaultDetail.data,
      transations: transations.data
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
