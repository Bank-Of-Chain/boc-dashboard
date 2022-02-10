import React from 'react'
import { LogoutOutlined } from '@ant-design/icons'
import { Avatar, Menu, Spin } from 'antd'
import { useModel } from 'umi'

// === Components === //
import HeaderDropdown from '../HeaderDropdown'
import Address from './../Address'

import styles from './index.less'

const AvatarDropdown = ({ menu }) => {
  const { initialState, setInitialState } = useModel('@@initialState')
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
    <Menu className={styles.menu} selectedKeys={[]} onClick={console.log}>
      <Menu.Item key='logout'>
        <LogoutOutlined />
        退出登录
      </Menu.Item>
    </Menu>
  )
  return (
    <HeaderDropdown overlay={menuHeaderDropdown}>
      <span className={`${styles.action} ${styles.account}`}>
        <Address
          size='short'
          wrapClassName={`${styles.name} anticon`}
          address='0x741aa7cfb2c7bf2a1e7d4da2e3df6a56ca4131f3'
        />
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
