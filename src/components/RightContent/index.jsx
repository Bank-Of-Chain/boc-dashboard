import { Space, Select } from 'antd'
import { useModel, history } from 'umi'
import React from 'react'
// import { SelectLang } from 'umi'
import styles from './index.less'

// === Utils === //
import map from 'lodash/map'

// === Contansts === //
import CHAINS, { ETH } from './../../constants/chain'

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
      {/* <SelectLang className={styles.action} /> */}
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
    </Space>
  )
}

export default GlobalHeaderRight
