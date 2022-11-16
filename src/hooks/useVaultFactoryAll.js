import { useCallback, useEffect, useState } from 'react'

// === Utils === //
import * as ethers from 'ethers'
import map from 'lodash/map'
import isEmpty from 'lodash/isEmpty'

// === Constants === //
import { UNISWAPV3_RISK_ON_HELPER, UNISWAPV3_RISK_ON_VAULT, IERC20_ABI, VAULT_FACTORY_ABI } from '@/constants/abis'

const { Contract, BigNumber } = ethers

const useVaultFactoryAll = (vaultFactoryAddress, jsonProvider) => {
  const [loading, setLoading] = useState(false)
  const [vaults, setVaults] = useState([])
  const [holderInfo, setHolderInfo] = useState({
    _wethInvestorSetLen: 0,
    _stablecoinInvestorSetLen: 0
  })

  const getDetails = useCallback(
    (helperAddress, personalVaultAddress) => {
      const contract = new Contract(personalVaultAddress, UNISWAPV3_RISK_ON_VAULT, jsonProvider)
      const helperContract = new Contract(helperAddress, UNISWAPV3_RISK_ON_HELPER, jsonProvider)
      return Promise.all([
        contract.borrowToken().then(async i => {
          const tokenContract = new Contract(i, IERC20_ABI, jsonProvider)
          return { borrowToken: i, name: await tokenContract.symbol(), borrowTokenDecimals: BigNumber.from(10).pow(await tokenContract.decimals()) }
        }),
        contract.wantToken().then(async i => {
          const tokenContract = new Contract(i, IERC20_ABI, jsonProvider)
          return { wantToken: i, name: await tokenContract.symbol(), wantTokenDecimals: BigNumber.from(10).pow(await tokenContract.decimals()) }
        })
      ])
        .then(([borrowInfo, wantInfo]) => {
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
    [jsonProvider]
  )

  const getVaultImplList = useCallback(() => {
    if (isEmpty(vaultFactoryAddress) || isEmpty(jsonProvider)) return
    setLoading(true)
    const vaultFactoryContract = new Contract(vaultFactoryAddress, VAULT_FACTORY_ABI, jsonProvider)
    Promise.all([
      vaultFactoryContract.uniswapV3RiskOnHelper(),
      vaultFactoryContract.getTotalVaultAddrList(),
      vaultFactoryContract.getTwoInvestorlistLen()
    ])
      .then(([helperAddress, vaultAddrList, { _wethInvestorSetLen, _stablecoinInvestorSetLen }]) => {
        setHolderInfo({
          _wethInvestorSetLen,
          _stablecoinInvestorSetLen
        })
        const requestArray = map(vaultAddrList, async vaultAddrListItem => {
          return getDetails(helperAddress, vaultAddrListItem)
        })
        return Promise.all(requestArray)
      })
      .then(setVaults)
      .finally(() => {
        setLoading(false)
      })
  }, [vaultFactoryAddress, jsonProvider, VAULT_FACTORY_ABI])

  useEffect(getVaultImplList, [getVaultImplList])

  return {
    vaultFactoryAddress,
    loading,
    vaults,
    holderInfo
  }
}

export default useVaultFactoryAll
