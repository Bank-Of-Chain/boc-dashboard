import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import moment from 'moment'
import { getDashboardDetail } from '@/services/dashboard-service';
import { getValutAPYByDate } from '@/services/api-service';
import { APY_DURATION } from '@/constants/api'

// === Utils === //
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';

const dataMerge = (chain) => {
  const usdiAddress = get(USDI_ADDRESS, chain, '')
  const vaultAddress = get(VAULT_ADDRESS, chain, '')
  if(isEmpty(usdiAddress) || isEmpty(vaultAddress))
    return Promise.reject(new Error('usdi地址或vault地址获取失败'))
  return Promise.all([
    getDashboardDetail(usdiAddress, vaultAddress),
  ])
    .then((rs) => {
      const [dashboardDetail = {}] = rs;
      return {
        ...dashboardDetail,
      };
    })
    .catch((error) => {
      console.error('DashBoard数据初始化失败', error);
      return {}
    });
};

export default function useDashboardData() {
  const [data, setData] = useState({})
  const [loading, setLoading] = useState(false)
  const {
    initialState
  } = useModel('@@initialState')

  useEffect(() => {
    if (initialState?.chain) {
      setLoading(true)
      dataMerge(initialState.chain)
        .then(setData)
        .finally(() => {
          setLoading(false)
        })
    }
  }, [initialState?.chain])

  return {
    dataSource: data,
    loading,
  };
}
