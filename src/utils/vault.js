// === Constants === //
import { VAULT_TYPE } from '@/constants/vault'
import { ETHI_FOR_ETH, USDI_FOR_ETH, ETHI_VAULT, USDI_VAULT_FOR_ETH, VAULT_BUFFER_FOR_ETHI_ETH, VAULT_BUFFER_FOR_USDI_ETH } from '@/config/config'

export const getVaultConfig = vault => {
  return {
    [VAULT_TYPE.USDi]: {
      vaultAddress: USDI_VAULT_FOR_ETH,
      tokenAddress: USDI_FOR_ETH,
      vaultBufferAddress: VAULT_BUFFER_FOR_USDI_ETH
    },
    [VAULT_TYPE.ETHi]: {
      vaultAddress: ETHI_VAULT,
      tokenAddress: ETHI_FOR_ETH,
      vaultBufferAddress: VAULT_BUFFER_FOR_ETHI_ETH
    }
  }[vault]
}
