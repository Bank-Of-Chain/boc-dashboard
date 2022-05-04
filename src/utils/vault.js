import { VAULT_TYPE } from '@/constants/vault'

export const getVaultConfig = (vault, chain) => {
  return {
    [VAULT_TYPE.USDi]: {
      vaultAddress: USDI_VAULT_ADDRESS[chain],
      tokenAddress: USDI_ADDRESS[chain]
    },
    [VAULT_TYPE.ETHi]: {
      vaultAddress: ETHI_VAULT_ADDRESS[chain],
      tokenAddress: EHI_ADDRESS[chain]
    }
  }[vault]
}
