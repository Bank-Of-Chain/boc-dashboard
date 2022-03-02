import {
  request
} from 'umi'
import isEmpty from 'lodash/isEmpty';
import isNil from 'lodash/isNil';

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
  return request(`${API_SERVER}/v1/strategy/apy/list/${chainId}`, {
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
  request
  return request(`${API_SERVER}/v1/allocation/report/${reportId}/${isReject}`, {
    method: 'patch',
    headers
  });
}
