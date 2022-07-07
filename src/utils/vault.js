import { VAULT_TYPE } from "@/constants/vault";

export const getVaultConfig = (chain, vault) => {
  return {
    [VAULT_TYPE.USDi]: {
      vaultAddress: USDI.VAULT_ADDRESS[chain],
      tokenAddress: USDI.USDI_ADDRESS[chain],
      vaultBufferAddress: USDI.VAULT_BUFFER_ADDRESS[chain],
    },
    [VAULT_TYPE.ETHi]: {
      vaultAddress: ETHI.VAULT_ADDRESS[chain],
      tokenAddress: ETHI.ETHI_ADDRESS[chain],
      vaultBufferAddress: ETHI.VAULT_BUFFER_ADDRESS[chain],
    },
  }[vault];
};
