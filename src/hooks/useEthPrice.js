import { useEffect, useState } from 'react'

// === Utils === //
import * as ethers from 'ethers'
import { getJsonRpcProvider } from '@/utils/json-provider'

// === Constants === //
import { ETH } from '@/constants/chain'

const { Contract } = ethers

const VAULT_ABI = [
  {
    inputs: [],
    name: 'priceProvider',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  }
]

const PRICE_PROVIDER_ABI = [
  {
    inputs: [],
    name: 'ethPriceInUsd',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  }
]

export default function useEthPrice() {
  const [value, setValue] = useState()
  const [error, setError] = useState()
  const [loading, setLoading] = useState(false)
  const jsonRpcProvider = getJsonRpcProvider(ETH.id)

  useEffect(() => {
    if (!jsonRpcProvider) {
      console.error('JSON RPC is empty')
      return
    }
    setLoading(true)
    const vaultContract = new Contract(ETHI.VAULT_ADDRESS[1], VAULT_ABI, jsonRpcProvider)
    vaultContract
      .priceProvider()
      .then(priceProviderAddress => {
        const priceProviderContract = new Contract(priceProviderAddress, PRICE_PROVIDER_ABI, jsonRpcProvider)
        return priceProviderContract.ethPriceInUsd()
      })
      .then(result => {
        setValue(result.div(1e8))
      })
      .catch(setError)
      .finally(() => setLoading(false))
  }, [])

  return {
    value,
    error,
    loading
  }
}
