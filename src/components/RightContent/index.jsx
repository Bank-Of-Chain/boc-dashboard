import { Space, Select, Button } from 'antd'
import { useModel, history } from 'umi'
import React, { useCallback, useState, useEffect } from 'react'

// === Components === //
import Avatar from './AvatarDropdown'

// === Utils === //
import map from 'lodash/map'
import { SafeAppWeb3Modal } from '@gnosis.pm/safe-apps-web3modal'
import { Web3Provider } from '@ethersproject/providers'

// === Contansts === //
import CHAINS, { ETH } from './../../constants/chain'

// === Hooks === //
import useUserAddress from './../../hooks/useUserAddress'

// === Styles === //
import styles from './index.less'

const { Option } = Select

const web3Modal = new SafeAppWeb3Modal({
  // network: "mainnet", // optional
  cacheProvider: true, // optional
  providerOptions: {},
})

const GlobalHeaderRight = () => {
  const className = `${styles.right}  ${styles.dark}`

  const { initialState, setInitialState } = useModel('@@initialState')

  const [userProvider, setUserProvider] = useState()
  const address = useUserAddress(userProvider)

  const changeChain = () => {}

  const loadWeb3Modal = useCallback(async () => {
    const provider = await web3Modal.requestProvider()

    const updateProvider = p => {
      setUserProvider(p)
    }

    updateProvider(new Web3Provider(provider))
    provider.on('chainChanged', chainId => {
      console.log(`chain changed to ${chainId}! updating providers`)
      localStorage.REACT_APP_NETWORK_TYPE = parseInt(chainId)
      updateProvider(new Web3Provider(provider))
    })

    provider.on('accountsChanged', () => {
      console.log(`account changed!`)
      updateProvider(new Web3Provider(provider))
    })

    // Subscribe to session disconnection
    provider.on('disconnect', (code, reason) => {
      console.log('disconnect', code, reason)
      localStorage.REACT_APP_NETWORK_TYPE = ''
    })
  }, [setUserProvider])

  const logoutOfWeb3Modal = async () => {
    await web3Modal.clearCachedProvider()
    setTimeout(() => {
      window.location.reload()
    }, 1)
  }

  useEffect(() => {
    if (web3Modal.cachedProvider) {
      loadWeb3Modal()
    }
  }, [loadWeb3Modal])

  useEffect(() => {
    userProvider &&
      userProvider._networkPromise &&
      userProvider._networkPromise.then(v => {
        setTimeout(() => {
          setInitialState({ ...initialState, address, walletChainId: `${v.chainId}` })
        }, 200)
      })
  }, [userProvider, address])

  return (
    <Space className={className}>
      <Select
        value={initialState.chain}
        defaultValue={ETH.id}
        style={{ width: 100 }}
        onChange={changeChain}
      >
        {map(CHAINS, i => (
          <Option key={i.id} value={i.id}>
            {i.name}
          </Option>
        ))}
      </Select>
      {initialState.address ? (
        <Avatar menu logoutOfWeb3Modal={logoutOfWeb3Modal} />
      ) : (
        <Button type='primary' onClick={loadWeb3Modal}>
          Connect
        </Button>
      )}
    </Space>
  )
}
window.ethereum &&
  (() => {
    function reload () {
      setTimeout(() => {
        window.location.reload()
      }, 1)
    }
    window.ethereum.on('chainChanged', reload)
    window.ethereum.on('accountsChanged', reload)
  })()

export default GlobalHeaderRight
