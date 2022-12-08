import { Space, Button, message } from 'antd'
import { useModel, history } from 'umi'
import React, { useState, useEffect, useRef } from 'react'
import classNames from 'classnames'
import copy from 'copy-to-clipboard'

// === Components === //
import Avatar from './AvatarDropdown'
import WalletModal from '../WalletModal'
import { MyAccountIcon } from '@/components/SvgIcons'
import Icon, { LoadingOutlined } from '@ant-design/icons'

// === Utils === //
import isEmpty from 'lodash/isEmpty'
import { isInMobileWalletApp, isInMobileH5 } from '@/utils/device'
import { isMarketingHost } from '@/utils/location'

// === Contansts === //
import { WALLET_OPTIONS } from '@/constants/wallet'

// === Hooks === //
import useUserAddress from '@/hooks/useUserAddress'
import useWallet from '@/hooks/useWallet'

// === Styles === //
import styles from './index.less'

// const menu = (
//   <Menu>
//     <Menu.Item>Ethereum</Menu.Item>
//     {/* <Menu.Item>Polygon</Menu.Item> */}
//   </Menu>
// )

const GlobalHeaderRight = () => {
  const [isLoading, setIsLoading] = useState(false)
  const { initialState, setInitialState } = useModel('@@initialState')
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

  const goToMyAccount = () => {
    const isMarketing = isMarketingHost()
    const url = `${isMarketing ? 'https://bankofchain.io' : IMAGE_ROOT}/#/${initialState.vault}`
    window.open(url)
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

  return (
    <div className={styles.header}>
      <Space
        size={20}
        className={classNames(styles.right, styles.dark, {
          [styles.hidden]: isInMobileH5() || isInMobileWalletApp()
        })}
      >
        {/* <Dropdown overlay={menu}>
          <Space style={{ lineHeight: 2 }}>
            <a className={styles.chain}>Ethereum</a>
            <DownOutlined style={{ fontSize: 10 }} />
          </Space>
        </Dropdown> */}
        <Button type="text" href="https://docs.bankofchain.io/" target="_blank" className={styles.colorful}>
          Docs
        </Button>
        {isLoading ? (
          <LoadingOutlined style={{ fontSize: 24 }} spin />
        ) : isEmpty(address) ? (
          <Button className={styles.connectBtn} onClick={handleClickConnect}>
            Connect Wallet
          </Button>
        ) : (
          [
            <Button className={styles.myDasboardBtn} key="mine" icon={<Icon component={MyAccountIcon} />} type="primary" onClick={goToMyAccount}>
              My Account
            </Button>,
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
