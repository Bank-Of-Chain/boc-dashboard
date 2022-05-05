import { useEffect, useState } from 'react'
import * as ethers from "ethers";
import useUserProvider from './useUserProvider'

const {
  Contract
} = ethers

const VAULT_ABI = [{
  "inputs": [],
  "name": "priceProvider",
  "outputs": [
    {
      "internalType": "address",
      "name": "",
      "type": "address"
    }
  ],
  "stateMutability": "view",
  "type": "function"
}]

const PRICE_PROVIDER_ABI = [{
  "inputs": [],
  "name": "ethPriceInUsd",
  "outputs": [
    {
      "internalType": "uint256",
      "name": "",
      "type": "uint256"
    }
  ],
  "stateMutability": "view",
  "type": "function"
}]

export default function useEthPrice() {
  const [value, setValue] = useState()
  const [error, setError] = useState()
  const [loading, setLoading] = useState(false)
  const {
    userProvider,
  } = useUserProvider()

  useEffect(() => {
    if (!userProvider) {
      return
    }
    setLoading(true)
    const vaultContract = new Contract(ETHI.VAULT_ADDRESS[1], VAULT_ABI, userProvider)
    vaultContract.priceProvider()
      .then((priceProviderAddress) => {
        const priceProviderContract = new Contract(priceProviderAddress, PRICE_PROVIDER_ABI, userProvider)
        return priceProviderContract.ethPriceInUsd()
      })
      .then((result) => {
        setValue(result.div(1e8))
      })
      .catch(setError)
      .finally(() => setLoading(false))
  }, [userProvider])

  return {
    value,
    error,
    loading
  }
}
