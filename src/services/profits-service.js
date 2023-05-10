// === Utils === //
import { request } from 'umi'
import isEmpty from 'lodash/isEmpty'

// === Constants === //
import { API_SERVER } from '@/config/config'

/**
 * get segment profits in DAY/WEEK/MONTH
 * @param {*} address user address
 * @param {*} chainId
 * @param {*} tokenType USDI or ETHI
 * @param {*} segmentType DAY OR WEEK OR MONTH
 * @returns
 */
export const getSegmentProfit = (address, chainId, tokenType, segmentType) => {
  if (isEmpty(address) || isEmpty(chainId) || isEmpty(tokenType) || isEmpty(segmentType))
    return Promise.reject('address & chainId & tokenType & segmentType must not be null')

  return request(`${API_SERVER}/account_profit_history/segment_profit/account/${address}`, {
    params: {
      chainId,
      tokenType,
      segmentType
    }
  })
}

/**
 * get latest profits
 * @param {*} address user address
 * @param {*} chainId
 * @param {*} tokenType USDI or ETHI
 * @returns
 */
export const getLatestProfit = (address, chainId, tokenType) => {
  if (isEmpty(address) || isEmpty(chainId) || isEmpty(tokenType)) return Promise.reject('address & chainId & tokenType must not be null')

  return request(`${API_SERVER}/account_profit_history/last_time_profit/account/${address}`, {
    params: {
      chainId,
      tokenType
    }
  })
}
