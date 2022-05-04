import { Space, Select, Button } from 'antd'
import { useModel, history } from 'umi'
import React, { useState, useEffect } from 'react'

// === Components === //
import Avatar from './AvatarDropdown'
import { LoadingOutlined, AreaChartOutlined } from '@ant-design/icons'

// === Utils === //
import map from 'lodash/map'
import find from 'lodash/find'
import isEmpty from 'lodash/isEmpty'

// === Contansts === //
import CHAINS, { ETH } from '@/constants/chain'
import { VAULT_TYPE } from '@/constants/vault'

// === Hooks === //
import useUserAddress from '@/hooks/useUserAddress'
import useUserProvider from '@/hooks/useUserProvider'

// === Styles === //
import styles from './index.less'

const { Option } = Select

// 以下路由时，不展示头部的切链下拉框
const disabledChangeChainRoute = ['/strategy']

// 以下路由时，不展示头部的切 vault 下拉框
const disabledChangeVaultRoute = ['/strategy']

const GlobalHeaderRight = () => {
  const className = `${styles.right}  ${styles.dark}`

  const [isLoading, setIsLoading] = useState(false)
  const { initialState, setInitialState } = useModel('@@initialState')

  const { userProvider, loadWeb3Modal, logoutOfWeb3Modal } = useUserProvider()
  const address = useUserAddress(userProvider)
  const { vault: curVault } = initialState

  const changeChain = value => {
    changeNetwork(value).then(() => {
      history.push({
        query: {
          chain: value,
        },
      })
      setTimeout(() => {
        location.reload()
      }, 1)
    })
  }
  const changeNetwork = id => {
    return new Promise(async resolve => {
      const targetNetwork = find(CHAINS, { id })
      console.log('targetNetwork=', targetNetwork)
      if (isEmpty(targetNetwork)) return
      const ethereum = window.ethereum
      const data = [
        {
          chainId: `0x${Number(targetNetwork.id).toString(16)}`,
          chainName: targetNetwork.name,
          nativeCurrency: targetNetwork.nativeCurrency,
          rpcUrls: [targetNetwork.rpcUrl],
          blockExplorerUrls: [targetNetwork.blockExplorer],
        },
      ]
      console.log('data', data)

      let switchTx
      try {
        switchTx = await ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: data[0].chainId }],
        })
      } catch (switchError) {
        try {
          switchTx = await ethereum.request({
            method: 'wallet_addEthereumChain',
            params: data,
          })
        } catch (addError) {
          console.log('addError=', addError)
        }
      }

      if (switchTx) {
        console.log(switchTx)
      }
      resolve()
    })
  }

  const changeVault = (value) => {
    const pathname = history.location.pathname
    const query = history.location.query
    query.chain = query.chain || ETH.id
    if (value === VAULT_TYPE.ETHi) {
      query.chain = ETH.id
    }
    setInitialState({ ...initialState, chain: query.chain, vault: value })
    history.push({
      pathname: pathname,
      query: {
        ...query,
        vault: value
      }
    })
  }

  const goToMine = () => {
    history.push(`/mine?chain=${initialState.chain}&vault=${initialState.vault}`)
  }

  useEffect(() => {
    if (isEmpty(userProvider)) return
    setIsLoading(true)
    userProvider._networkPromise.then(v => {
      setTimeout(() => {
        setIsLoading(false)
        setInitialState({ ...initialState, address, walletChainId: `${v.chainId}` })
      }, 200)
    })
  }, [userProvider, address, history.location.pathname])

  return (
    <Space className={className}>
      {!disabledChangeChainRoute.includes(history.location.pathname) && curVault === VAULT_TYPE.USDi && (
        <Select
          value={initialState.chain}
          defaultValue={ETH.id}
          style={{ width: '7.5rem' }}
          onChange={changeChain}
        >
          {map(CHAINS, i => (
            <Option key={i.id} value={i.id}>
              {i.name}
            </Option>
          ))}
        </Select>
      )}
      {!disabledChangeVaultRoute.includes(history.location.pathname) && (
        <Select
          value={curVault}
          onChange={changeVault}
          style={{ width: '5rem' }}
        >
          {map(VAULT_TYPE, (value, key) => (
            <Option key={key} value={value}>{key}</Option>
          ))}
        </Select>
      )}
      {isLoading ? (
        <LoadingOutlined style={{ fontSize: 24 }} spin />
      ) : !isEmpty(address) ? ([
        <Avatar
          key="avatar"
          menu
          address={address}
          logoutOfWeb3Modal={() =>
            logoutOfWeb3Modal().then(() => {
              setTimeout(() => {
                window.location.reload()
              }, 1)
            })
          }
        />,
        <Button key="mine" icon={<AreaChartOutlined />} type="primary" onClick={goToMine}>
          My Dashboard
        </Button>
      ]
      ) : window.ethereum ? (
        <Button type='primary' onClick={loadWeb3Modal}>
          Connect
        </Button>
      ) : null}
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
