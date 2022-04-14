import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import moment from 'moment'
import { getDashboardDetail } from '@/services/dashboard-service';
import { getValutAPYByDate } from '@/services/api-service';
import { APY_DURATION } from '@/constants/api'

const dataMerge = (chain) => {
  return Promise.all([
    getDashboardDetail(),
    getValutAPYByDate({
      date: moment().utcOffset(0).format('YYYY-MM-DD'),
      duration: APY_DURATION.monthly,
      chainId: chain
    }).catch(() => ({
      apy: '8.56'
    }))
  ])
    .then((rs) => {
      const [dashboardDetail = {}, valutApy] = rs;
      return {
        ...dashboardDetail,
        apy30: valutApy.apy
      };
    })
    .catch((error) => {
      console.error('DashBoard数据初始化失败', error);
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
