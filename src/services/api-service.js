import { request } from 'umi'
import { isNil } from 'lodash'

export const getStrategyApysOffChain = (params, offset = 0, limit = 20) => {
  try {
    const nextParams = {
      offset,
      limit,
      ...params
    }
    return request(`${API_SERVER}/officialApy`, {
      params: nextParams
    })
  } catch (error) {
    return {
      content: []
    }
  }
}

/**
 * get allocation report
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
    limit
  }
  return request(`${API_SERVER}/chains/${chainId}/vaults/${vaultAddress}/allocation`, {
    params: nextParams
  })
}

/**
 * get strategy detail
 * @param {String} chainId
 * @param {number} offset
 * @param {number} limit
 * @returns
 */
export const getStrategyDetails = (chainId, vaultAddress, offset = 0, limit = 20) => {
  const nextParams = {
    offset,
    limit
  }
  return request(`${API_SERVER}/chains/${chainId}/vaults/${vaultAddress}/strategy/detail/list`, {
    params: nextParams
  })
}

/**
 * get verified apy
 * @param {*} params
 * @param {*} offset
 * @param {*} limit
 * @returns
 */
export const getBaseApyByPage = (params, offset = 0, limit = 20) => {
  const { chainId, vaultAddress, ...restParams } = params
  return request(`${API_SERVER}/chains/${chainId}/vaults/${vaultAddress}/verifiedApy`, {
    params: {
      offset,
      limit,
      ...restParams
    }
  })
}

/**
 * update report status
 * @param {*} reportId
 * @returns
 */
export const updateReportStatus = (chainId, vaultAddress, reportId, isReject, headers) => {
  if (isNil(reportId)) return
  return request(`${API_SERVER}/chains/${chainId}/vaults/${vaultAddress}/allocation/${reportId}/${isReject}`, {
    method: 'patch',
    headers
  })
}

export const getStrategyDetailsReports = ({ strategyName, vaultAddress, chainId, limit = 10, offset = 0, sort = 'fetch_timestamp desc' }) => {
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
 * get account apy
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
 * get account profit, include unrealized and realized
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
 * get account tvl, default recent 1 year
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
 * get account monthly profit
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
export const getValutAPYList = ({ chainId, tokenType, duration, offset = 0, limit, useCache = true }) => {
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
  }).then(data => {
    apyListCache[cacheKey] = data
    return data
  })
}

let tokenTotalSupplyCache = {}
export const getTokenTotalSupplyList = ({ chainId, offset = 0, limit, tokenType, useCache = true }) => {
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
  }).then(data => {
    tokenTotalSupplyCache[cacheKey] = data
    return data
  })
}

export const clearAPICache = () => {
  apyListCache = {}
  tokenTotalSupplyCache = {}
}

/**
 * get daily verified apy
 * @param {String} chainId
 * @param {number} offset
 * @param {number} limit
 * @returns
 */
export const getStrategyApyDetails = (chainId, vaultAddress, strategyAddress, offset = 0, limit = 20) => {
  const nextParams = {
    strategyAddress,
    offset,
    limit
  }
  const url = `${API_SERVER}/chains/${chainId}/vaults/${vaultAddress}/verifiedApy/daily`
  return request(url, {
    params: nextParams
  })
}

/**
 * fetch mystatement data by type
 * @param {*} chainId
 * @param {*} vaultAddress
 * @param {*} type
 * @param {*} params
 * @returns
 */
export const getDataByType = (chainId, vaultAddress, type, params = { limit: 30 }) => {
  const url = `${API_SERVER}/chains/${chainId}/vaults/${vaultAddress}/data_collects/types/${type}`
  return request(url, {
    params
  })
}

/**
 *
 * @param {*} type
 * @param {*} params
 * @returns
 */
export const getVerifiedApyInRiskOn = params => {
  return request(`${API_SERVER}/verifiedApy/riskon`, {
    params: {
      offset: 0,
      limit: 30,
      ...params
    }
  })
}

/**
 *
 * @param {*} type
 * @param {*} params
 * @returns
 */
export const getOffcialApyInRiskOn = params => {
  return request(`${API_SERVER}/officialApy/riskon`, {
    params: {
      offset: 0,
      limit: 30,
      ...params
    }
  })
}

/**
 *
 * @param {*} type
 * @param {*} params
 * @returns
 */
export const getApyInRiskOn = params => {
  return request(`${API_SERVER}/riskon/getSampleApy`, {
    params
  })
}

/**
 *
 * @param {*} chain
 * @param {*} type
 * @returns
 */
export const getProfitsByType = (chain, type) => {
  const params = {
    type
  }
  return request(`${API_SERVER}/chains/${chain}/data_collects/profit`, {
    params
  })
}
