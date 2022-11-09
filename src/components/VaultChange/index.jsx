import React from 'react'
import PropTypes from 'prop-types'
import { useModel, history, useLocation } from 'umi'

// === Components === //
import { Radio, Row, Col } from 'antd'

// === Hooks === //
import { useDeviceType, DEVICE_TYPE } from '@/components/Container/Container'

// === Utils === //
import map from 'lodash/map'
import { getVaultConfig } from '@/utils/vault'

// === Constants === //
import { ETH, MATIC } from '@/constants/chain'
import { VAULT_TYPE } from '@/constants/vault'

// === Styles === //
import styles from './index.less'

const options = [
  { label: 'USD Stable', value: 'usdi' },
  { label: 'ETH Stable', value: 'ethi' },
  { label: 'USD Plus', value: 'usdr' },
  { label: 'ETH Plus', value: 'ethr' }
]

const VaultChange = () => {
  const { initialState, setInitialState } = useModel('@@initialState')
  const location = useLocation()

  const deviceType = useDeviceType()
  const chartResponsiveConfig = {
    [DEVICE_TYPE.Desktop]: {
      text: {
        width: '14rem',
        height: 'auto',
        padding: '1rem 0',
        lineHeight: '1'
      }
    },
    [DEVICE_TYPE.Tablet]: {
      text: {
        width: '11rem',
        height: 'auto',
        padding: '0.8rem 0',
        lineHeight: '1'
      }
    },
    [DEVICE_TYPE.Mobile]: {
      text: {
        width: '10rem',
        height: 'auto',
        padding: '0.5rem 0',
        lineHeight: '1'
      }
    }
  }[deviceType]

  const changeChain = vault => {
    let { chain } = location.query
    let promise = Promise.resolve()
    if (vault === VAULT_TYPE.USDr || vault === VAULT_TYPE.ETHr) {
      chain = MATIC.id
      // if (initialState.walletChainId !== MATIC.id && isProEnv(ENV_INDEX)) {
      //   promise = changeNetwork(chain, userProvider, getWalletName())
      // }
    } else if (vault === VAULT_TYPE.ETHi || vault === VAULT_TYPE.USDi) {
      chain = ETH.id
    }
    promise.then(() => {
      setInitialState({
        ...initialState,
        vault,
        chain,
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
            <Radio.Button style={chartResponsiveConfig.text} value={item.value} key={key}>
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
