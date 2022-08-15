import { useState, useCallback } from 'react'
import keys from 'lodash/keys'
import { SafeAppWeb3Modal } from '@gnosis.pm/safe-apps-web3modal'
import { Web3Provider } from '@ethersproject/providers'
import { WALLETS } from '@/constants/wallet'

const createWeb3Modal = () => {
  let providerOptions = {}
  keys(WALLETS).forEach(name => {
    providerOptions = {
      ...providerOptions,
      ...WALLETS[name].getProviderOption()
    }
  })
  return new SafeAppWeb3Modal({
    // network: "mainnet", // optional
    cacheProvider: true, // optional
    providerOptions
  })
}

export default () => {
  const [web3Modal, setWeb3Modal] = useState(createWeb3Modal())
  const [provider, setProvider] = useState()
  const [userProvider, setUserProvider] = useState()

  const setCurrentProvider = useCallback(provider => {
    setProvider(provider)
    setUserProvider(provider ? new Web3Provider(provider) : undefined)
  }, [])

  return {
    web3Modal,
    setWeb3Modal,
    provider,
    setCurrentProvider,
    userProvider,
    createWeb3Modal
  }
}
