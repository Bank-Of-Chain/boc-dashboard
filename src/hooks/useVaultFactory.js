import { useCallback, useEffect, useState } from 'react'

// === Utils === //
import * as ethers from 'ethers'
import map from 'lodash/map'
import isEmpty from 'lodash/isEmpty'
import flatten from 'lodash/flatten'

// === Hooks === //
import useUserAddress from '@/hooks/useUserAddress'

// === Constants === //
import { USDC_ADDRESS_MATIC, WETH_ADDRESS_MATIC, ZERO_ADDRESS } from '@/constants/tokens'
import { UNISWAPV3_RISK_ON_HELPER, UNISWAPV3_RISK_ON_VAULT, IERC20_ABI } from '@/constants/abis'

const { Contract, BigNumber } = ethers

const tokens = [WETH_ADDRESS_MATIC, USDC_ADDRESS_MATIC]

const useVaultFactory = (vaultFactoryAddress, VAULT_FACTORY_ABI, userProvider) => {
  const [loading, setLoading] = useState(false)
  const [vaultImplList, setVaultImplList] = useState([])
  const [personalVault, setPersonalVault] = useState([])
  const [adding, setAdding] = useState(false)

  const userAddress = useUserAddress(userProvider)

  const getDetails = useCallback(
    (helperAddress, personalVaultAddress) => {
      const vaultFactoryContract = new Contract(vaultFactoryAddress, VAULT_FACTORY_ABI, userProvider)
      const contract = new Contract(personalVaultAddress, UNISWAPV3_RISK_ON_VAULT, userProvider)
      const helperContract = new Contract(helperAddress, UNISWAPV3_RISK_ON_HELPER, userProvider)
      return Promise.all([
        vaultFactoryContract.getTwoInvestorlistLen(),
        contract.borrowToken().then(async i => {
          const tokenContract = new Contract(i, IERC20_ABI, userProvider)
          return { borrowToken: i, name: await tokenContract.symbol(), borrowTokenDecimals: BigNumber.from(10).pow(await tokenContract.decimals()) }
        }),
        contract.wantToken().then(async i => {
          const tokenContract = new Contract(i, IERC20_ABI, userProvider)
          return { wantToken: i, name: await tokenContract.symbol(), wantTokenDecimals: BigNumber.from(10).pow(await tokenContract.decimals()) }
        })
      ])
        .then(([{ _wethInvestorSetLen, _stablecoinInvestorSetLen }, borrowInfo, wantInfo]) => {
          const { borrowToken } = borrowInfo
          const { wantToken } = wantInfo
          return Promise.all([
            contract.netMarketMakingAmount(),
            helperContract.getCurrentBorrow(borrowToken, 2, personalVaultAddress),
            helperContract.getTotalCollateralTokenAmount(personalVaultAddress, wantToken),
            contract.depositTo3rdPoolTotalAssets(),
            contract.estimatedTotalAssets()
          ]).then(([netMarketMakingAmount, currentBorrow, totalCollateralTokenAmount, depositTo3rdPoolTotalAssets, estimatedTotalAssets]) => {
            return helperContract.calcCanonicalAssetValue(borrowToken, currentBorrow, wantToken).then(currentBorrowWithCanonical => {
              const nextBaseInfo = {
                netMarketMakingAmount,
                currentBorrow,
                currentBorrowWithCanonical,
                depositTo3rdPoolTotalAssets,
                totalCollateralTokenAmount,
                estimatedTotalAssets,
                wantInfo,
                borrowInfo,
                _wethInvestorSetLen,
                _stablecoinInvestorSetLen,
                profit: depositTo3rdPoolTotalAssets.add(totalCollateralTokenAmount).sub(netMarketMakingAmount).sub(currentBorrowWithCanonical)
              }
              return nextBaseInfo
            })
          })
        })
        .finally(() => {
          setTimeout(() => {
            setLoading(false)
          }, 300)
        })
    },
    [userProvider]
  )

  const getVaultImplList = useCallback(() => {
    if (isEmpty(vaultFactoryAddress) || isEmpty(userProvider)) return
    const vaultFactoryContract = new Contract(vaultFactoryAddress, VAULT_FACTORY_ABI, userProvider)
    vaultFactoryContract.getVaultImplList().then(setVaultImplList)
  }, [vaultFactoryAddress, userProvider, VAULT_FACTORY_ABI])

  const getVaultImplListByUser = useCallback(async () => {
    if (isEmpty(vaultFactoryAddress) || isEmpty(userProvider) || isEmpty(vaultImplList) || isEmpty(userAddress)) return
    const vaultFactoryContract = new Contract(vaultFactoryAddress, VAULT_FACTORY_ABI, userProvider)
    const helperAddress = await vaultFactoryContract.uniswapV3RiskOnHelper()
    const requestArray = map(vaultImplList, implAddress => {
      return Promise.all(
        map(tokens, (arrayItem, index) => {
          return vaultFactoryContract.vaultAddressMap(userAddress, implAddress, index).then(rs => {
            if (rs === ZERO_ADDRESS) return { hasCreate: false, type: implAddress, token: arrayItem }

            return getDetails(helperAddress, rs).then(result => {
              return {
                ...result,
                address: rs,
                type: implAddress,
                hasCreate: true,
                token: arrayItem
              }
            })
          })
        })
      )
    })
    Promise.all(requestArray).then(resp => {
      setPersonalVault(flatten(resp))
    })
  }, [userAddress, vaultFactoryAddress, userProvider, vaultImplList, VAULT_FACTORY_ABI])

  const addVault = useCallback(
    async (token, type) => {
      setAdding(true)
      const vaultFactoryContract = new Contract(vaultFactoryAddress, VAULT_FACTORY_ABI, userProvider)
      await vaultFactoryContract
        .connect(userProvider.getSigner())
        .createNewVault(token, type)
        .then(tx => tx.wait())
        .then(getVaultImplListByUser)
        .finally(() => {
          setAdding(false)
        })
    },
    [vaultFactoryAddress, userProvider, getVaultImplListByUser, VAULT_FACTORY_ABI]
  )

  const deleteVault = useCallback(
    async (type, index) => {
      setAdding(true)
      const vaultFactoryContract = new Contract(vaultFactoryAddress, VAULT_FACTORY_ABI, userProvider)
      vaultFactoryContract
        .connect(userProvider.getSigner())
        .deleteVaultAddressMapForDebug(userAddress, type, index)
        .then(tx => tx.wait())
        .then(getVaultImplListByUser)
        .finally(() => {
          setAdding(false)
        })
    },
    [vaultFactoryAddress, getVaultImplListByUser, userAddress, userProvider, VAULT_FACTORY_ABI]
  )

  useEffect(getVaultImplList, [getVaultImplList])

  useEffect(getVaultImplListByUser, [getVaultImplListByUser])

  return {
    vaultFactoryAddress,
    vaultImplList,
    personalVault,
    adding,
    loading,
    // functions
    addVault,
    deleteVault
  }
}

export default useVaultFactory
