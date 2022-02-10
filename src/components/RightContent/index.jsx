import { Space, Select, Button } from 'antd'
import { useModel, history } from 'umi'
import React from 'react'
// === Components === //
import Avatar from './AvatarDropdown'

// === Utils === //
import map from 'lodash/map'

// === Contansts === //
import CHAINS, { ETH } from './../../constants/chain'

import styles from './index.less'

const { Option } = Select

const GlobalHeaderRight = () => {
  const className = `${styles.right}  ${styles.dark}`

  const { initialState } = useModel('@@initialState')
  const changeChain = value => {
    history.push(`/?chain=${value}`)
    location.reload()
  }

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
      <Button type='primary' onClick={() => history.push('/mine')}>
        Connect
      </Button>
      <Avatar menu />
    </Space>
  )
}

export default GlobalHeaderRight
