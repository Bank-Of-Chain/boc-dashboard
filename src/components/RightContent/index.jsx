import { Space, Button, Menu } from 'antd'
import { useModel, history } from 'umi'
import React, { useState, useEffect } from 'react'

// === Components === //
import Avatar from './AvatarDropdown'
import WalletModal from "../WalletModal"
import { LoadingOutlined, AreaChartOutlined } from '@ant-design/icons'

// === Utils === //
import find from 'lodash/find'
import isEmpty from 'lodash/isEmpty'
import { getVaultConfig } from '@/utils/vault';
import { isInMobileWalletApp } from "@/utils/device"

// === Contansts === //
import CHAINS, { ETH } from '@/constants/chain'
import { VAULT_TYPE } from '@/constants/vault'
import { WALLET_OPTIONS } from '@/constants/wallet'

// === Hooks === //
import useUserAddress from '@/hooks/useUserAddress'
import useWallet from '@/hooks/useWallet'

// === Styles === //
import styles from './index.less'

// 以下路由时，不展示头部的切 vault 下拉框
const disabledChangeVaultRoute = ['/strategy']

const GlobalHeaderRight = () => {
  const className = `${styles.right}  ${styles.dark}`

  const [isLoading, setIsLoading] = useState(false)
  const { initialState, setInitialState } = useModel('@@initialState')
  const [current, setCurrent] = useState(initialState.vault)
  const [walletModalVisible, setWalletModalVisible] = useState(false)

  const { userProvider, connect, disconnect, getWalletName } = useWallet()
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
    return new Promise(async (resolve, reject) => {
      const targetNetwork = find(CHAINS, { id })
      console.log('targetNetwork=', targetNetwork)
      if (isEmpty(targetNetwork)) return
      if (!userProvider) {
        rejcet()
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
        if (switchError.code === 4001) {
          reject()
        }
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

  const handleMenuClick = (e) => {
    const vault = e.key
    let promise = Promise.resolve()
    if ((history.location.pathname === '/mine' || history.location.pathname === '/reports') && vault === 'ethi') {
      promise = changeNetwork("1")
    }
    promise.then(() => {
      setCurrent(vault)
      const pathname = history.location.pathname
      const query = history.location.query
      query.chain = query.chain || ETH.id
      if (vault === VAULT_TYPE.ETHi) {
        query.chain = ETH.id
      }
      setInitialState({
        ...initialState,
        chain: query.chain,
        vault,
        ...getVaultConfig(query.chain, vault)
      })
      history.push({
        pathname: pathname,
        query: {
          ...query,
          vault
        }
      })
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

  useEffect(() => {
    setCurrent(initialState.vault)
  }, [initialState.vault])

  return (
    <div className={styles.header}>
      {!disabledChangeVaultRoute.includes(history.location.pathname) ? (
        <Menu
          className={styles.headerMenu}
          onClick={handleMenuClick}
          selectedKeys={[current]}
          mode="horizontal"
        >
          <Menu.Item key="ethi">ETHi</Menu.Item>
          <Menu.Item key="usdi">USDi</Menu.Item>
        </Menu>
      ) : <span/>}
      <Space className={className}>
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
          <Button className={styles.myDasboardBtn} key="mine" icon={<AreaChartOutlined />} type="primary" onClick={goToMine}>
            My Dashboard
          </Button>
        ])}
      </Space>
      <WalletModal
        visible={walletModalVisible}
        onCancel={handleCancel}
        connectTo={connectTo}
        selected={getWalletName()}
        walletOptions={WALLET_OPTIONS}
      />
    </div>
  )
}
export default GlobalHeaderRight
