import map from 'lodash/map'
import WalletConnectProvider from '@walletconnect/web3-provider'

// === Constants === //
import { RPC_URL } from '@/config/config'

export const WALLETS = {
  MetaMask: {
    info: {
      name: 'MetaMask',
      value: 'injected', // param connectTo
      symbol: 'metamask',
      logo: 'https://bankofchain.io/images/wallets/MetaMask.png'
    },
    getProviderOption: () => {}
  },
  WalletConnect: {
    info: {
      name: 'WalletConnect',
      value: 'walletconnect',
      symbol: 'walletconnect',
      logo: 'https://bankofchain.io/images/wallets/WalletConnect.png'
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

export const WALLET_OPTIONS = map(WALLETS, wallet => wallet.info)
