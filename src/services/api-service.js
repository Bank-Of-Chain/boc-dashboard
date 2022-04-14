import {
  request
} from 'umi'
import {
  isNil
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

export const getStrategyApysOffChain = (address, offset = 0, limit = 20) => {
  try {
    const params = {
      strategyAddress: address,
      offset,
      limit
    }
    return request(`${API_SERVER}/officialApy`, {
      params,
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
  return request(`${API_SERVER}/v1/allocation/report`, {
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
  return request(`${API_SERVER}/v1/apy/currentBaseApy`, {
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
  return request(`${API_SERVER}/v1/allocation/report/${reportId}/${isReject}`, {
    method: 'patch',
    headers
  });
}

export const getStrategyDetailsReports = ({
  strategyAddress,
  chainId,
  limit = 10,
  offset = 0,
  sort = 'fetch_timestamp desc'
}) => {
  return request(`${API_SERVER}/v1/strategy/assets`, {
    params: {
      strategyAddress,
      chainId,
      limit,
      offset,
      sort
    }
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
  return request(`${API_SERVER}}/USDi/totalSupply`, {
    params: {
      chainId,
      offset,
      limit
    }
  })
}
