import {
  request
} from 'umi'

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
    return request(`${API_SERVER}/v1/apy-off-chain`, {
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
