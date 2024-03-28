import React from 'react'
import { useModel, history } from 'umi'

// === Components === //
import { Radio } from 'antd'

// === Utils === //
import map from 'lodash/map'
import { getVaultConfig } from '@/utils/vault'

// === Contansts === //
import { ETH } from '@/constants/chain'
import { VAULT_TYPE } from '@/constants/vault'

// === Styles === //
import styles from './index.less'

const options = [
  { key: 'ethi', label: 'APTi', value: 'ethi' },
  { key: 'usdi', label: 'USDi', value: 'usdi' }
]

const VaultChange = () => {
  const { initialState, setInitialState } = useModel('@@initialState')

  const changeVault = vault => {
    const { pathname, query } = history.location
    let chain = query.chain || ETH.id
    if (vault === VAULT_TYPE.ETHi) {
      chain = ETH.id
      // TODO: After open Polygon network, we need change network here if current network is not Ethereum
    }
    setInitialState({
      ...initialState,
      chain,
      vault,
      ...getVaultConfig(chain, vault)
    })
    history.push({
      pathname,
      query: {
        chain,
        vault
      }
    })
  }

  return (
    <div className={styles.container}>
      <Radio.Group onChange={e => changeVault(e.target.value)} value={initialState.vault} buttonStyle="solid" size="large">
        {map(options, (item, key) => (
          <Radio.Button value={item.value} key={key}>
            {item.label}
          </Radio.Button>
        ))}
      </Radio.Group>
    </div>
  )
}

export default VaultChange
