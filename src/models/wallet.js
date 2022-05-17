import { useState, useCallback } from "react"
import { SafeAppWeb3Modal } from "@gnosis.pm/safe-apps-web3modal"
import WalletConnectProvider from "@walletconnect/web3-provider"
import { Web3Provider } from "@ethersproject/providers"

const SUPPORT_WALLETS = ['MetaMask', 'WalletConnect']
const WALLETS = {
  MetaMask: {
    info: {
      name: "MetaMask",
      value: "injected", // connectTo 参数
      symbol: "metamask", // 是否为当前连接判断, 统一全小写
      logo: "./images/wallets/MetaMask.png"
    },
    getProviderOption: () => {}
  },
  WalletConnect: {
    info: {
      name: "WalletConnect",
      value: "walletconnect",
      symbol: "walletconnect",
      logo: "./images/wallets/WalletConnect.png",
    },
    getProviderOption: () => ({
      walletconnect: {
        package: WalletConnectProvider, // required
        options: {
          rpc: {
            1: "https://eth-mainnet.alchemyapi.io/v2/cDrbyA3BIcXQcF3EYjsf_PX8qC6YBlhV",
            56: "https://bsc-dataseed.binance.org/",
            137: "https://rpc-mainnet.maticvigil.com"
          }
        }
      }
    })
  }
}

const displayWalletList = []
SUPPORT_WALLETS.forEach((name) => {
  displayWalletList.push(WALLETS[name].info)
})
export {
  displayWalletList
}

const createWeb3Modal = () => {
  let providerOptions = {}
  SUPPORT_WALLETS.forEach((name) => {
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

  const setCurrentProvider = useCallback((provider) => {
    setProvider(provider)
    setUserProvider(provider ? new Web3Provider(provider) : undefined)
  }, [])

  return {
    web3Modal,
    setWeb3Modal,
    provider,
    setCurrentProvider,
    userProvider,
    createWeb3Modal,
    displayWalletList
  }
}
