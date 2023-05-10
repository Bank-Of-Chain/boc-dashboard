import { useEffect, useCallback } from 'react'
import { useAtom } from 'jotai'
import { isInMobileWalletApp, isInMobileH5 } from '@/utils/device'
import { Web3Provider } from '@ethersproject/providers'
import keys from 'lodash/keys'
import { SafeAppWeb3Modal } from '@gnosis.pm/safe-apps-web3modal'
import { WALLETS } from '@/constants/wallet'

// === jotai === //
import { walletAtom } from '@/jotai'

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

function useWallet() {
  const [walletData, setWalletData] = useAtom(walletAtom)
  const { web3Modal, provider, userProvider } = walletData

  const setCurrentProvider = useCallback(
    provider => {
      const userProvider = provider ? new Web3Provider(provider) : undefined
      setWalletData({
        provider,
        userProvider
      })
    },
    [setWalletData]
  )

  useEffect(() => {
    setWalletData({
      web3Modal: createWeb3Modal()
    })
  }, [createWeb3Modal])

  const connectTo = useCallback(
    async name => {
      const provider = await web3Modal.connectTo(name)
      setCurrentProvider(provider)
      return provider
    },
    [web3Modal, setCurrentProvider]
  )

  const requestProvider = useCallback(async () => {
    const provider = await web3Modal.requestProvider()
    setCurrentProvider(provider)
    return provider
  }, [web3Modal, setCurrentProvider])

  const connect = useCallback(
    async name => {
      return name ? connectTo(name) : requestProvider()
    },
    [connectTo, requestProvider]
  )

  const disconnectPassive = useCallback(async () => {
    // walletconnect close by exception, remove localStorage
    localStorage.removeItem('walletconnect')
    await web3Modal.clearCachedProvider()
    setTimeout(() => {
      window.location.reload()
    }, 1)
  }, [web3Modal])

  const disconnect = useCallback(async () => {
    if (provider?.disconnect) {
      await provider.disconnect()
    }
    await disconnectPassive()
  }, [provider, disconnectPassive])

  const getChainId = userProvider => {
    return userProvider && userProvider._network && userProvider._network.chainId
  }

  const getWalletName = () => {
    if (!userProvider) {
      return ''
    }
    const cacheProvider = web3Modal?.providerController?.cachedProvider
    if (!cacheProvider) {
      return ''
    }
    if (cacheProvider === 'injected') {
      return web3Modal?.providerController?.injectedProvider?.name?.toLowerCase()
    }
    return cacheProvider.toLowerCase()
  }

  const getProviderType = useCallback(() => {
    const providers = web3Modal?.providerController?.providers
    const id = web3Modal?.providerController?.cachedProvider
    return providers.find(item => item.id === id)?.type
  }, [web3Modal])

  useEffect(() => {
    if (!provider) {
      return
    }
    const chainChanged = async chainId => {
      console.log(`chain changed to ${chainId}! updating providers`)
      const provider = await web3Modal.requestProvider()
      setCurrentProvider(provider)
    }
    const accountsChanged = async accounts => {
      console.log(`account changed!`, accounts)
      const provider = await web3Modal.requestProvider()
      setCurrentProvider(provider)
    }

    const disconnect = async (code, reason) => {
      console.log('disconnect', code, reason)
      if (getProviderType() !== 'injected') {
        await disconnectPassive()
      }
    }
    provider.on('chainChanged', chainChanged)
    provider.on('accountsChanged', accountsChanged)
    provider.on('disconnect', disconnect)

    return () => {
      provider.removeListener('chainChanged', chainChanged)
      provider.removeListener('accountsChanged', accountsChanged)
      provider.removeListener('disconnect', disconnect)
    }
  }, [provider, disconnectPassive, getProviderType])

  useEffect(() => {
    if (web3Modal && web3Modal.cachedProvider && !isInMobileWalletApp() && !isInMobileH5()) {
      connect()
    }
  }, [web3Modal])

  return {
    web3Modal,
    provider,
    userProvider,
    connect,
    connectTo,
    requestProvider,
    disconnect,
    disconnectPassive,
    getChainId,
    getWalletName
  }
}

export default useWallet
