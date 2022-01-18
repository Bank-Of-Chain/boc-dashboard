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
