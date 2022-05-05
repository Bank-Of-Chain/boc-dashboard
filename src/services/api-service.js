import {
  request
} from 'umi'
import {
  isNil,
} from 'lodash';

export const getStrategyApysOffChain = (params, offset = 0, limit = 20) => {
  try {
    const nextParams = {
      offset,
      limit,
      ...params,
    }
    return request(`${API_SERVER}/officialApy`, {
      params: nextParams,
    });
  } catch (error) {
    return {
      content: []
    }
  }
}

/**
 * 分页获取调仓报告
 * @param {*} params
 * @param {*} offset
 * @param {*} limit
 * @returns
 */
export const getReports = (params, offset = 0, limit = 20) => {
  const { chainId, vaultAddress } = params
  const nextParams = {
    sort: 'gene_time desc',
    offset,
    limit,
  }
  return request(`${API_SERVER}/chains/${chainId}/vaults/${vaultAddress}/allocation`, {
    params: nextParams,
  });
}

/**
 * 按分页查询策略详情
 * @param {String} chainId 链ID
 * @param {number} offset
 * @param {number} limit
 * @returns
 */
export const getStrategyDetails = (chainId, vaultAddress, offset = 0, limit = 20) => {
  const nextParams = {
    offset,
    limit,
  }
  return request(`${API_SERVER}/chains/${chainId}/vaults/${vaultAddress}/strategy/detail/list`, {
    params: nextParams,
  });
}

/**
 * 获取币本位的apy数据
 * @param {*} params
 * @param {*} offset
 * @param {*} limit
 * @returns
 */
export const getBaseApyByPage = (params, offset = 0, limit = 20) => {
  const { chainId, vaultAddress, ...restParams } = params
  return request(`${API_SERVER}/chains/${chainId}/vaults/${vaultAddress}/weeklyApy`, {
    params: {
      offset,
      limit,
      restParams
    },
  });
}

/**
 * 更新调仓报告的状态
 * @param {*} reportId
 * @returns
 */
export const updateReportStatus = (chainId, vaultAddress, reportId, isReject, headers) => {
  if (isNil(reportId)) return
  return request(`${API_SERVER}/chains/${chainId}/vaults/${vaultAddress}/allocation/${reportId}/${isReject}`, {
    method: 'patch',
    headers
  });
}

export const getStrategyDetailsReports = ({
  strategyName,
  vaultAddress,
  chainId,
  limit = 10,
  offset = 0,
  sort = 'fetch_timestamp desc'
}) => {
  return request(`${API_SERVER}/chains/${chainId}/vaults/${vaultAddress}/strategy/assets`, {
    params: {
      strategyName,
      limit,
      offset,
      sort
    }
  })
}

/**
 * 获取用户apy
 * @param {*} chainId
 * @param {*} account
 * @param {*} date
 * @param {*} duration
 * @returns
 */
export const getAccountApyByAddress = (chainId, account, date, duration) => {
  if (isNil(chainId) || isNil(account)) return
  const params = {
    duration,
    chainId
  }
  return request(`${API_SERVER}/apy/account_apy/accountAddress/${account}/date/${date}`, {
    params
  })
}

/**
 * 获取用户的收益，包括已实现首页和未实现收益
 * @param {*} chainId
 * @param {*} account
 * @returns
 */
export const getProfits = (chainId, account) => {
  if (isNil(chainId) || isNil(account)) return
  const params = {
    chainId
  }
  return request(`${API_SERVER}/profit/account/${account}`, {
    params
  })
}

/**
 * 获取总锁仓量数组，默认取1年
 * @param {*} chainId
 * @param {*} account
 * @param {*} limit
 * @returns
 */
export const getPersonTvlArray = (chainId, account, limit = 365) => {
  if (isNil(chainId) || isNil(account)) return []
  const params = {
    chainId,
    limit,
  }
  return request(`${API_SERVER}/USDi/balance/account/${account}`, {
    params
  })
}

/**
 * 获取用户月盈利
 * @param {*} chainId
 * @param {*} account
 * @returns
 */
export const getMonthProfits = (chainId, account) => {
  const params = {
    chainId
  }
  return request(`${API_SERVER}/month_profit/account/${account}`, {
    params
  })
}

export const getValutAPYByDate = ({
  date,
  chainId,
  duration
}) => {
  return request(`${API_SERVER}/apy/vault_apy/date/${date}`, {
    params: {
      chainId,
      duration
    }
  })
}

let apyListCache = {}
export const getValutAPYList = ({
  chainId,
  duration,
  offset = 0,
  limit,
  useCache = true
}) => {
  const cacheKey = `${chainId}-${duration}-${offset}-${limit}`
  if (useCache && apyListCache[cacheKey]) {
    return Promise.resolve(apyListCache[cacheKey])
  }
  return request(`${API_SERVER}/apy/vault_apy`, {
    params: {
      chainId,
      duration,
      offset,
      limit
    }
  }).then((data) => {
    apyListCache[cacheKey] = data
    return data
  })
}

let usdiTotalSupplyCache = {}
export const getUsdiTotalSupplyList = ({
  chainId,
  offset = 0,
  limit,
  useCache = true
}) => {
  const cacheKey = `${chainId}-${offset}-${limit}`
  if (useCache && usdiTotalSupplyCache[cacheKey]) {
    return Promise.resolve(usdiTotalSupplyCache[cacheKey])
  }
  return request(`${API_SERVER}/USDi/totalSupply`, {
    params: {
      chainId,
      offset,
      limit
    }
  }).then((data) => {
    usdiTotalSupplyCache[cacheKey] = data
    return data
  })
}

export const clearAPICache = () => {
  apyListCache = {}
  usdiTotalSupplyCache = {}
}
