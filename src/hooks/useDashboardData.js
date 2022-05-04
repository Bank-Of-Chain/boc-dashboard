import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import moment from 'moment'
import { getDashboardDetail } from '@/services/dashboard-service';
import { getValutAPYByDate } from '@/services/api-service';
import { APY_DURATION } from '@/constants/api'

// === Utils === //
import isEmpty from 'lodash/isEmpty';
import { getVaultConfig } from "@/utils/vault";

const dataMerge = (vault, chain) => {
  const { vaultAddress, tokenAddress } = getVaultConfig(vault, chain)
  if(isEmpty(tokenAddress) || isEmpty(vaultAddress))
    return Promise.reject(new Error('usdi地址或vault地址获取失败'))
  return Promise.all([
    getDashboardDetail(tokenAddress, vaultAddress),
    getValutAPYByDate({
      date: moment().subtract(1, 'days').utcOffset(0).format('YYYY-MM-DD'),
      duration: APY_DURATION.monthly,
      chainId: chain
    }).catch((error) => {
      console.log(error)
    })
  ])
    .then((rs) => {
      const [dashboardDetail = {}, valutApy = {}] = rs;
      return {
        ...dashboardDetail,
        apy30: valutApy.apy
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
      dataMerge(initialState.vault, initialState.chain)
        .then(setData)
        .finally(() => {
          setLoading(false)
        })
    }
  }, [initialState?.chain, initialState?.vault])

  return {
    dataSource: data,
    loading,
  };
}
