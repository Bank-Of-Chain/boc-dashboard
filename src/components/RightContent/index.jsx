import { Space, Select, Button } from 'antd'
import { useModel, history } from 'umi'
import React, { useState, useEffect } from 'react'

// === Components === //
import Avatar from './AvatarDropdown'
import { LoadingOutlined } from '@ant-design/icons'

// === Utils === //
import map from 'lodash/map'
import isEmpty from 'lodash/isEmpty'

// === Contansts === //
import CHAINS, { ETH } from '@/constants/chain'

// === Hooks === //
import useUserAddress from '@/hooks/useUserAddress'
import useUserProvider from '@/hooks/useUserProvider'

// === Styles === //
import styles from './index.less'

const { Option } = Select

const GlobalHeaderRight = () => {
  const className = `${styles.right}  ${styles.dark}`

  const [isLoading, setIsLoading] = useState(false)
  const { initialState, setInitialState } = useModel('@@initialState')

  const { userProvider, loadWeb3Modal, logoutOfWeb3Modal } = useUserProvider()
  const address = useUserAddress(userProvider)

  const changeChain = value => {
    history.push(`/?chain=${value}`)
    location.reload()
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

  return (
    <Space className={className}>
      <Select
        value={initialState.chain}
        defaultValue={ETH.id}
        style={{ width: 100 }}
        onChange={changeChain}
      >
        {map(CHAINS, i => (
          <Option key={i.id} value={i.id}>
            {i.name}
          </Option>
        ))}
      </Select>
      {isLoading ? (
        <LoadingOutlined style={{ fontSize: 24 }} spin />
      ) : !isEmpty(address) ? (
        <Avatar
          menu
          address={address}
          logoutOfWeb3Modal={() =>
            logoutOfWeb3Modal().then(() => {
              setTimeout(() => {
                window.location.reload()
              }, 1)
            })
          }
        />
      ) : window.ethereum ? (
        <Button type='primary' onClick={loadWeb3Modal}>
          Connect
        </Button>
      ) : null}
    </Space>
  )
}
window.ethereum &&
  (() => {
    function reload () {
      setTimeout(() => {
        window.location.reload()
      }, 1)
    }
    window.ethereum.on('chainChanged', reload)
    window.ethereum.on('accountsChanged', reload)
  })()

export default GlobalHeaderRight
