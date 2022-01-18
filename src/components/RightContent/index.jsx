import { Space, Select } from 'antd'
import React from 'react'
import { SelectLang } from 'umi'
import styles from './index.less'

// === Utils === //
import map from 'lodash/map'

// === Contansts === //
import CHAINS, { ETH } from './../../constants/chain'

const { Option } = Select

const GlobalHeaderRight = () => {
  const className = `${styles.right}  ${styles.dark}`
  return (
    <Space className={className}>
      <SelectLang className={styles.action} />
      <Select value={ETH.id} style={{ width: 100 }}>
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
