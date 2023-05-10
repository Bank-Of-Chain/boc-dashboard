import React from 'react'
import Icon from '@ant-design/icons'
import { Menu, Spin, Space } from 'antd'
import { DownOutlined } from '@ant-design/icons'

// === Components === //
import HeaderDropdown from '../HeaderDropdown'
import Address from '../Address'
import { CopyIcon, ChangeIcon, ExitIcon } from '@/components/SvgIcons'

// === Jotai === //
import { useAtom } from 'jotai'
import { initialStateAtom } from '@/jotai'

// === Styles === //
import styles from './index.less'

const AvatarDropdown = ({ logoutOfWeb3Modal, address, showChangeWallet, onChangeWallet, onCopy }) => {
  const [initialState] = useAtom(initialStateAtom)
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
    <HeaderDropdown overlay={menuHeaderDropdown} trigger="click">
      <span className={`${styles.action} ${styles.account}`}>
        <div className={styles.dot}></div>
        <Address size="short" wrapClassName={`${styles.name} anticon`} address={address} />
        <DownOutlined style={{ marginLeft: 10, fontSize: 10 }} />
      </span>
    </HeaderDropdown>
  )
}

export default AvatarDropdown
