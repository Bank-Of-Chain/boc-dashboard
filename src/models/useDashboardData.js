import {
  useRequest
} from 'umi';
import {
  fetchData
} from '@/services/dashboard-service';

export default function useDashboardData() {
  const msg = useRequest(() => fetchData());
  return {
    dataSource: msg.data,
    reload: msg.run,
    loading: msg.loading,
  };
}
