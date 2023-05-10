import React, { useState, useRef, useEffect } from 'react'
import classNames from 'classnames'
import copy from 'copy-to-clipboard'

// === Components === //
import { Space, Button, message } from 'antd'
import Avatar from './AvatarDropdown'
import WalletModal from '../WalletModal'
import { LoadingOutlined } from '@ant-design/icons'

// === Hooks === //
import useUserAddress from '@/hooks/useUserAddress'
import useWallet from '@/hooks/useWallet'
import { useHistory } from 'react-router-dom'

// === Utils === //
import isEmpty from 'lodash/isEmpty'
import { isInMobileWalletApp, isInMobileH5 } from '@/utils/device'

// === Jotai === //
import { useAtom } from 'jotai'
import { initialStateAtom } from '@/jotai'

// === Contansts === //
import { WALLET_OPTIONS } from '@/constants/wallet'

// === Styles === //
import styles from './index.less'

const GlobalHeaderRight = () => {
  const history = useHistory()
  const [isLoading, setIsLoading] = useState(false)
  const [initialState, setInitialState] = useAtom(initialStateAtom)
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
  }, [userProvider, address, history?.location?.pathname])

  return (
    <div>
      <Space
        size={20}
        className={classNames(styles.right, styles.dark, {
          [styles.hidden]: isInMobileH5() || isInMobileWalletApp()
        })}
      >
        <Button className="colorful" type="text" href="https://docs.bankofchain.io/" target="_blank">
          Docs
        </Button>
        {history.location.pathname === '/reports' &&
          (isLoading ? (
            <LoadingOutlined style={{ fontSize: 24 }} spin />
          ) : isEmpty(address) ? (
            <Button className="connectBtn" onClick={handleClickConnect}>
              Connect Wallet
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
              />
            ]
          ))}
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
