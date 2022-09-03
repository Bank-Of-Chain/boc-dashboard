import map from 'lodash/map'
import WalletConnectProvider from '@walletconnect/web3-provider'

export const WALLETS = {
  MetaMask: {
    info: {
      name: 'MetaMask',
      value: 'injected', // param connectTo
      symbol: 'metamask',
      logo: `${IMAGE_ROOT}/images/wallets/MetaMask.png`
    },
    getProviderOption: () => {}
  },
  WalletConnect: {
    info: {
      name: 'WalletConnect',
      value: 'walletconnect',
      symbol: 'walletconnect',
      logo: `${IMAGE_ROOT}/images/wallets/WalletConnect.png`
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
