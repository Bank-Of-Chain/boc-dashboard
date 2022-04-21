import { Space, Select, Button } from 'antd'
import { useModel, history } from 'umi'
import React, { useState, useEffect } from 'react'

// === Components === //
import Avatar from './AvatarDropdown'
import WalletModal from "../WalletModal"
import { LoadingOutlined, AreaChartOutlined } from '@ant-design/icons'

// === Utils === //
import map from 'lodash/map'
import find from 'lodash/find'
import isEmpty from 'lodash/isEmpty'
import { isInMobileWalletApp } from "@/utils/device"

// === Contansts === //
import CHAINS, { ETH } from '@/constants/chain'

// === Hooks === //
import useUserAddress from '@/hooks/useUserAddress'
import useWallet from '@/hooks/useWallet'

// === Styles === //
import styles from './index.less'

const { Option } = Select

// 以下路由时，不展示头部的切链下拉框
const enabledChangeChainRoute = ['/strategy']

const GlobalHeaderRight = () => {
  const className = `${styles.right}  ${styles.dark}`

  const [isLoading, setIsLoading] = useState(false)
  const { initialState, setInitialState } = useModel('@@initialState')
  const [walletModalVisible, setWalletModalVisible] = useState(false)

  const { userProvider, connect, disconnect, getWalletName, displayWalletList } = useWallet()
  const address = useUserAddress(userProvider)

  const handleClickConnect = () => {
    if (isInMobileWalletApp) {
      connect()
    } else {
      setWalletModalVisible(true)
    }
  }

  const handleCancel = () => {
    setWalletModalVisible(false)
  }

  const connectTo = async (name) => {
    const provider = await connect(name)
    if (provider) {
      handleCancel()
    }
  }

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
      if (!userProvider) {
        return
      }
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
        switchTx = await userProvider.send("wallet_switchEthereumChain", [{ chainId: data[0].chainId }])
      } catch (switchError) {
        try {
          switchTx = await userProvider.send("wallet_addEthereumChain", data)
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
    <>
      <Space className={className}>
        {!enabledChangeChainRoute.includes(history.location.pathname) && (
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
        {isLoading ? (
          <LoadingOutlined style={{ fontSize: 24 }} spin />
        ) : isEmpty(address) ? (
          <Button type='primary' onClick={handleClickConnect}>
            Connect
          </Button>
        ) : ([
          <Avatar
            key="avatar"
            menu
            showChangeWallet={!isInMobileWalletApp}
            onChangeWallet={handleClickConnect}
            address={address}
            logoutOfWeb3Modal={disconnect}
          />,
          <Button key="mine" icon={<AreaChartOutlined />} type="primary" onClick={() => history.push(`/mine?chain=${initialState.chain}`)}>
            My Dashboard
          </Button>
        ])}
      </Space>
      <WalletModal
        visible={walletModalVisible}
        onCancel={handleCancel}
        connectTo={connectTo}
        selected={getWalletName()}
        displayWalletList={displayWalletList}
      />
    </>
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
