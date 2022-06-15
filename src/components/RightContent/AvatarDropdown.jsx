import React from 'react'
import { LogoutOutlined, WalletOutlined, CopyOutlined } from '@ant-design/icons'
import { Avatar, Menu, Spin } from 'antd'
import { useModel } from 'umi'

// === Components === //
import HeaderDropdown from '../HeaderDropdown'
import Address from './../Address'

import styles from './index.less'

const AvatarDropdown = ({ logoutOfWeb3Modal, address, showChangeWallet, onChangeWallet, onCopy }) => {
  const { initialState } = useModel('@@initialState')
  const loading = (
    <span className={`${styles.action} ${styles.account}`}>
      <Spin
        size='small'
        style={{
          marginLeft: 8,
          marginRight: 8,
        }}
      />
    </span>
  )

  if (!initialState) {
    return loading
  }

  const menuHeaderDropdown = (
    <Menu className={styles.avatarMenu}>
      {showChangeWallet && (
        <Menu.Item key='change' onClick={onChangeWallet}>
          <WalletOutlined />
          Change Wallet
        </Menu.Item>
      )}
      <Menu.Item key='copy' onClick={onCopy}>
        <CopyOutlined />
        Copy Address
      </Menu.Item>
      <Menu.Item key='logout' onClick={logoutOfWeb3Modal}>
        <LogoutOutlined />
        Disconnect
      </Menu.Item>
    </Menu>
  )
  return (
    <HeaderDropdown overlay={menuHeaderDropdown}>
      <span className={`${styles.action} ${styles.account}`}>
        <div className={styles.dot}></div>
        <Address size='short' wrapClassName={`${styles.name} anticon`} address={address} />
      </span>
    </HeaderDropdown>
  )
}

export default AvatarDropdown
