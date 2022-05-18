import map from 'lodash/map'
import WalletConnectProvider from "@walletconnect/web3-provider"

export const WALLETS = {
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
        package: WalletConnectProvider,
        options: {
          rpc: RPC_URL
        }
      }
    })
  }
}

export const WALLET_OPTIONS = map(WALLETS, (wallet) => wallet.info)
