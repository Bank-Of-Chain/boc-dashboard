import { request } from 'umi'

// === Services === //
import { isEmpty } from 'lodash'

export const getPrices = (chainId, vaultAddress) => {
  if (isEmpty(`${chainId}`) || isEmpty(vaultAddress)) return Promise.reject('chainId and vaultAddress should not be empty')
  return request(`${API_SERVER}/chains/${chainId}/vaults/${vaultAddress}/rate_history`, {})
}
