import axios from 'axios'

// === Services === //
import { isEmpty } from 'lodash'

// === Constants === //
import { API_SERVER } from '@/config/config'

export const getPrices = (chainId, vaultAddress) => {
  if (isEmpty(chainId) || isEmpty(vaultAddress)) return Promise.reject('chainId and vaultAddress should not be empty')
  return axios.get(`${API_SERVER}/chains/${chainId}/vaults/${vaultAddress}/rate_history`, {})
}
