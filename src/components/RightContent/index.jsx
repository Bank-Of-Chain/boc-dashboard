import { Space, Button, Menu, message } from 'antd'
import { useModel, history } from 'umi'
import React, { useState, useEffect, useRef } from 'react'
import classNames from 'classnames'
import copy from 'copy-to-clipboard'

// === Components === //
import Avatar from './AvatarDropdown'
import WalletModal from '../WalletModal'
import { LoadingOutlined, AreaChartOutlined } from '@ant-design/icons'

// === Utils === //
import isEmpty from 'lodash/isEmpty'
import { getVaultConfig } from '@/utils/vault'
import { isInMobileWalletApp, isInMobileH5 } from '@/utils/device'
import { changeNetwork } from '@/utils/network'

// === Contansts === //
import { ETH } from '@/constants/chain'
import { VAULT_TYPE } from '@/constants/vault'
import { WALLET_OPTIONS } from '@/constants/wallet'

// === Hooks === //
import useUserAddress from '@/hooks/useUserAddress'
import useWallet from '@/hooks/useWallet'

// === Styles === //
import styles from './index.less'

// routes which do not show the vault select
const disabledChangeVaultRoute = ['/strategy']

const GlobalHeaderRight = () => {
  const [isLoading, setIsLoading] = useState(false)
  const { initialState, setInitialState } = useModel('@@initialState')
  const [current, setCurrent] = useState(initialState.vault)
  const [walletModalVisible, setWalletModalVisible] = useState(false)
  const connectTimer = useRef(null)

  const { userProvider, connect, disconnect, getWalletName } = useWallet()
  const address = useUserAddress(userProvider)

  const handleClickConnect = () => {
    if (isInMobileWalletApp()) {
      connect()
    } else {
      setWalletModalVisible(true)
    }
  }

  const handleCancel = () => {
    setWalletModalVisible(false)
  }

  const connectTo = async name => {
    if (!connectTimer.current) {
      connectTimer.current = setTimeout(() => {
        message.warning('Please check you wallet info or confirm you have install the wallet')
        connectTimer.current = null
      }, 5000)
    }
    const provider = await connect(name).catch(error => {
      const msg = error?.message
      if (msg === 'No Web3 Provider found') {
        message.warning('Please install the wallet first. If you have installed, reload page')
      }
      console.error(error)
    })
    clearTimeout(connectTimer.current)
    connectTimer.current = null
    if (provider) {
      handleCancel()
    }
  }

  const handleMenuClick = e => {
    const vault = e.key
    let promise = Promise.resolve()
    if (history.location.pathname === '/reports' && vault === 'ethi') {
      promise = changeNetwork('1', userProvider, getWalletName(), {
        resolveWhenUnsupport: true
      })
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

  const copyAddress = () => {
    copy(address)
    message.success('Copied')
  }

  useEffect(() => {
    if (isEmpty(userProvider)) return
    setIsLoading(true)
    userProvider._networkPromise.then(v => {
      setTimeout(() => {
        setIsLoading(false)
        setInitialState({
          ...initialState,
          address,
          walletChainId: `${v.chainId}`
        })
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
          items={[
            { label: 'ETHi', key: 'ethi' },
            { label: 'USDi', key: 'usdi' }
          ]}
        />
      ) : (
        <span />
      )}
      <Space
        size={20}
        className={classNames(styles.right, styles.dark, {
          [styles.hidden]: isInMobileH5() || isInMobileWalletApp()
        })}
      >
        {isLoading ? (
          <LoadingOutlined style={{ fontSize: 24 }} spin />
        ) : isEmpty(address) ? (
          <Button type="primary" onClick={handleClickConnect}>
            Connect
          </Button>
        ) : (
          [
            <Avatar
              key="avatar"
              menu
              showChangeWallet={!isInMobileWalletApp()}
              onChangeWallet={handleClickConnect}
              address={address}
              logoutOfWeb3Modal={disconnect}
              onCopy={copyAddress}
            />,
            <Button className={styles.myDasboardBtn} key="mine" icon={<AreaChartOutlined />} type="primary" onClick={goToMine}>
              My Dashboard
            </Button>
          ]
        )}
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
