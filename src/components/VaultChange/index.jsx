import React from 'react'
import PropTypes from 'prop-types'
import { useModel, history, useLocation } from 'umi'

// === Components === //
import { Radio, Row, Col } from 'antd'

// === Hooks === //
import useWallet from '@/hooks/useWallet'

// === Utils === //
import map from 'lodash/map'
import { getVaultConfig } from '@/utils/vault'
import { changeNetwork } from '@/utils/network'
import { isProEnv } from '@/services/env-service'

// === Constants === //
import { ETH, MATIC } from '@/constants/chain'
import { VAULT_TYPE } from '@/constants/vault'

// === Styles === //
import styles from './index.less'

const options = [
  { label: 'USDi', value: 'usdi' },
  { label: 'ETHi', value: 'ethi' },
  { label: 'USDr', value: 'usdr' },
  { label: 'ETHr', value: 'ethr' }
]

const VaultChange = () => {
  const { userProvider, getWalletName } = useWallet()
  const { initialState, setInitialState } = useModel('@@initialState')
  const location = useLocation()

  const changeChain = vault => {
    let { chain } = location.query
    let promise = Promise.resolve()
    if (isProEnv(ENV_INDEX)) {
      if (vault === VAULT_TYPE.USDr || vault === VAULT_TYPE.ETHr) {
        chain = MATIC.id
        if (initialState.walletChainId !== MATIC.id) {
          promise = changeNetwork(chain, userProvider, getWalletName())
        }
      } else if (vault === VAULT_TYPE.ETHi || vault === VAULT_TYPE.USDi) {
        chain = ETH.id
      }
    }
    promise.then(() => {
      setInitialState({
        ...initialState,
        vault,
        ...getVaultConfig(chain, vault)
      })
      history.push({
        query: {
          chain: chain || initialState.chain,
          vault
        }
      })
    })
  }

  return (
    <Row>
      <Col span={24} className={styles.container}>
        <Radio.Group size="large" onChange={v => changeChain(v.target.value)} value={initialState.vault} buttonStyle="solid">
          {map(options, (item, key) => (
            <Radio.Button value={item.value} key={key}>
              {item.label}
            </Radio.Button>
          ))}
        </Radio.Group>
      </Col>
    </Row>
  )
}

VaultChange.propTypes = {
  shouldChangeChain: PropTypes.bool
}

export default VaultChange
