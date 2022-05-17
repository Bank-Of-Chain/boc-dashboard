import {
  request
} from 'umi'
import {
  isEmpty,
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
  const {
    chainId,
    vaultAddress
  } = params
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
  const {
    chainId,
    vaultAddress,
    ...restParams
  } = params
  return request(`${API_SERVER}/chains/${chainId}/vaults/${vaultAddress}/weeklyApy`, {
    params: {
      offset,
      limit,
      ...restParams
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
 * @param {*} account
 * @param {*} date
 * @param {*} params
 * @returns
 */
export const getAccountApyByAddress = (account, date, params) => {
  return request(`${API_SERVER}/apy/account_apy/accountAddress/${account}/date/${date}`, {
    params
  })
}

/**
 * 获取用户的收益，包括已实现首页和未实现收益
 * @param {*} account
 * @param {*} params
 * @returns
 */
export const getProfits = (account, params) => {
  return request(`${API_SERVER}/profit/account/${account}`, {
    params
  })
}

/**
 * 获取总锁仓量数组，默认取1年
 * @param {*} account
 * @param {*} params
 * @returns
 */
export const getPersonTvlArray = (account, params) => {

  return request(`${API_SERVER}/token/balance/account/${account}`, {
    params: {
      limit: 365,
      ...params
    }
  })
}

/**
 * 获取用户月盈利
 * @param {*} account
 * @param {*} params
 * @returns
 */
export const getMonthProfits = (account, params) => {
  return request(`${API_SERVER}/month_profit/account/${account}`, {
    params
  })
}

let apyListCache = {}
export const getValutAPYList = ({
  chainId,
  tokenType,
  duration,
  offset = 0,
  limit,
  useCache = true
}) => {
  const cacheKey = `${chainId}-${duration}-${tokenType}-${offset}-${limit}`
  if (useCache && apyListCache[cacheKey]) {
    return Promise.resolve(apyListCache[cacheKey])
  }
  return request(`${API_SERVER}/apy/vault_apy`, {
    params: {
      chainId,
      duration,
      offset,
      limit,
      tokenType
    }
  }).then((data) => {
    apyListCache[cacheKey] = data
    return data
  })
}

let tokenTotalSupplyCache = {}
export const getTokenTotalSupplyList = ({
  chainId,
  offset = 0,
  limit,
  tokenType,
  useCache = true
}) => {
  const cacheKey = `${chainId}-${offset}-${tokenType}-${limit}`
  if (useCache && tokenTotalSupplyCache[cacheKey]) {
    return Promise.resolve(tokenTotalSupplyCache[cacheKey])
  }
  return request(`${API_SERVER}/token/totalSupply`, {
    params: {
      chainId,
      offset,
      limit,
      tokenType
    }
  }).then((data) => {
    tokenTotalSupplyCache[cacheKey] = data
    return data
  })
}

export const clearAPICache = () => {
  apyListCache = {}
  tokenTotalSupplyCache = {}
}

/**
 * 获取vault的预估apy
 * @param {string} vaultAddress vault地址
 */
export const getEstimateApys = (vaultAddress) => {
  if (isEmpty(vaultAddress))
    return Promise.reject("vaultAddress不可为空")

  // return request(`${API_SERVER}/apy/vault_estimate_apy`)
  return request(`/apy/vault_estimate_apy`)
}

/**
 * 获取策略的apy
 * @param {string} chainId
 * @param {string} vaultAddress
 * @param {string} strategyAddress
 * @returns
 */
export const getStrategyEstimateApys = (chainId, vaultAddress, strategyAddress) => {
  if (isEmpty(chainId))
    return Promise.reject("chainId不可为空")

  if (isEmpty(vaultAddress))
    return Promise.reject("vaultAddress不可为空")

  if (isEmpty(strategyAddress))
    return Promise.reject("strategyAddress不可为空")

  // return request(`${API_SERVER}/chains/${chainId}/vaults/${vaultAddress}/strategy_apy`)
  return request(`/chains/${chainId}/vaults/${vaultAddress}/strategy_apy`)
}
