import { useRequest } from 'umi';
import {
    getAccountDetail,
    getVaultSummaryData,
} from '@/services/dashboard-service';

const dataMerge = () => {
  return Promise.all([
    getVaultSummaryData(),
    getAccountDetail('0x2346c6b1024e97c50370c783a66d80f577fe991d'),
  ])
    .then((rs) => {
      const [vaultSummary = {}, accountDetail = {}] = rs;
      const nextData = {
        vaultSummary: vaultSummary?.data,
        accountDetail: accountDetail?.data?.account,
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