import {
  request
} from 'umi'
import {
  isNil,
} from 'lodash';

export const getStrategyApysInChain = (address, offset = 0, limit = 20) => {
  try {
    const params = {
      strategyAddress: address,
      offset,
      limit
    }
    return request(`${API_SERVER}/v1/apy-in-chain`, {
      params,
    });
  } catch (error) {
    return {
      content: []
    }
  }
}

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
  const nextParams = {
    sort: 'gene_time desc',
    offset,
    limit,
    ...params,
  }
  return request(`${API_SERVER}/allocation`, {
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
export const getStrategyDetails = (chainId, offset = 0, limit = 20) => {
  const nextParams = {
    offset,
    limit,
  }
  return request(`${API_SERVER}/strategy/detail/list/${chainId}`, {
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
  const nextParams = {
    offset,
    limit,
    ...params
  }
  return request(`${API_SERVER}/weeklyApy`, {
    params: nextParams,
  });
}

/**
 * 更新调仓报告的状态
 * @param {*} reportId
 * @returns
 */
export const updateReportStatus = (reportId, isReject, headers) => {
  if (isNil(reportId)) return
  return request(`${API_SERVER}/allocation/${reportId}/${isReject}`, {
    method: 'patch',
    headers
  });
}

export const getStrategyDetailsReports = ({
  strategyName,
  chainId,
  limit = 10,
  offset = 0,
  sort = 'fetch_timestamp desc'
}) => {
  return request(`${API_SERVER}/strategy/assets`, {
    params: {
      strategyName,
      chainId,
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

export const getValutAPYList = ({
  chainId,
  duration,
  offset = 0,
  limit
}) => {
  return request(`${API_SERVER}/apy/vault_apy`, {
    params: {
      chainId,
      duration,
      offset,
      limit
    }
  })
}

export const getUsdiTotalSupplyList = ({
  chainId,
  offset = 0,
  limit
}) => {
  return request(`${API_SERVER}/USDi/totalSupply`, {
    params: {
      chainId,
      offset,
      limit
    }
  })
}
