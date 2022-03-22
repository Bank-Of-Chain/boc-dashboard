import React from 'react'
import { LogoutOutlined, AreaChartOutlined } from '@ant-design/icons'
import { Avatar, Menu, Spin, Button } from 'antd'
import { useModel, history } from 'umi'

// === Components === //
import HeaderDropdown from '../HeaderDropdown'
import Address from './../Address'

import styles from './index.less'

const AvatarDropdown = ({ logoutOfWeb3Modal, address }) => {
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
      <Menu.Item key='logout' onClick={logoutOfWeb3Modal}>
        <LogoutOutlined />
        Disconnect
      </Menu.Item>
    </Menu>
  )
  return (
    <HeaderDropdown overlay={menuHeaderDropdown}>
      <span className={`${styles.action} ${styles.account}`}>
        <Button icon={<AreaChartOutlined />} type="primary" onClick={() => history.push(`/mine?chain=${initialState.chain}`)}>
          My Dashboard
        </Button>
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
