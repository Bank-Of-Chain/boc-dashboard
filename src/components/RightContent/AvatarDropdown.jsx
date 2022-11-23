import React from 'react'
import Icon from '@ant-design/icons'
import { Menu, Spin, Space } from 'antd'
import { useModel } from 'umi'

// === Components === //
import HeaderDropdown from '../HeaderDropdown'
import Address from '../Address'
import { CopyIcon, ChangeIcon, ExitIcon } from '@/components/SvgIcons'

// === Styles === //
import styles from './index.less'

const AvatarDropdown = ({ logoutOfWeb3Modal, address, showChangeWallet, onChangeWallet, onCopy }) => {
  const { initialState } = useModel('@@initialState')
  const loading = (
    <span className={`${styles.action} ${styles.account}`}>
      <Spin
        size="small"
        style={{
          marginLeft: 8,
          marginRight: 8
        }}
      />
    </span>
  )

  if (!initialState) {
    return loading
  }

  const menuHeaderDropdown = (
    <Menu className={styles.avatarMenu}>
      <Menu.Item key="copy" onClick={onCopy}>
        <Space>
          <Icon component={CopyIcon} />
          Copy Address
        </Space>
      </Menu.Item>
      {showChangeWallet && (
        <Menu.Item key="change" onClick={onChangeWallet}>
          <Space>
            <Icon component={ChangeIcon} />
            Change Wallet
          </Space>
        </Menu.Item>
      )}
      <Menu.Item key="logout" onClick={logoutOfWeb3Modal}>
        <Space>
          <Icon component={ExitIcon} />
          Disconnect
        </Space>
      </Menu.Item>
    </Menu>
  )
  return (
    <HeaderDropdown overlay={menuHeaderDropdown}>
      <span className={`${styles.action} ${styles.account}`}>
        <div className={styles.dot}></div>
        <Address size="short" wrapClassName={`${styles.name} anticon`} address={address} />
      </span>
    </HeaderDropdown>
  )
}

export default AvatarDropdown
