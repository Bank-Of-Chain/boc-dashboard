import React from 'react'
import { LogoutOutlined, WalletOutlined } from '@ant-design/icons'
import { Avatar, Menu, Spin } from 'antd'
import { useModel } from 'umi'

// === Components === //
import HeaderDropdown from '../HeaderDropdown'
import Address from './../Address'

import styles from './index.less'

const AvatarDropdown = ({ logoutOfWeb3Modal, address, showChangeWallet, onChangeWallet }) => {
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
    <Menu className={styles.menu}>
      {showChangeWallet && (
        <Menu.Item key='change' onClick={onChangeWallet}>
          <WalletOutlined />
          Change Wallet
        </Menu.Item>
      )}
      <Menu.Item key='logout' onClick={logoutOfWeb3Modal}>
        <LogoutOutlined />
        Disconnect
      </Menu.Item>
    </Menu>
  )
  return (
    <HeaderDropdown overlay={menuHeaderDropdown}>
      <span className={`${styles.action} ${styles.account}`}>
        <Address size='short' wrapClassName={`${styles.name} anticon`} address={address} />
        <Avatar
          size='small'
          className={styles.avatar}
          src='https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png'
          alt='avatar'
        />
      </span>
    </HeaderDropdown>
  )
}

export default AvatarDropdown
