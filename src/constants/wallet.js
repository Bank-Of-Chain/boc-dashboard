import WalletConnectProvider from '@walletconnect/web3-provider'

// === Utils === //
import map from 'lodash/map'
import omit from 'lodash/omit'

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

export const WALLET_OPTIONS = map(omit(WALLETS, 'WalletConnect'), wallet => wallet.info)
