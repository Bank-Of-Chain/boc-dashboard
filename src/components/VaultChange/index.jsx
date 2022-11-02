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
  { label: 'USDi', value: 'usdi' },
  { label: 'ETHi', value: 'ethi' },
  { label: 'USDr', value: 'usdr' },
  { label: 'ETHr', value: 'ethr' }
]

const VaultChange = () => {
  const { initialState, setInitialState } = useModel('@@initialState')
  const location = useLocation()

  const deviceType = useDeviceType()
  const chartResponsiveConfig = {
    [DEVICE_TYPE.Desktop]: {
      text: {
        height: 'auto',
        padding: '1rem 5rem',
        lineHeight: '1'
      }
    },
    [DEVICE_TYPE.Tablet]: {
      text: {
        height: 'auto',
        padding: '0.8rem 4rem',
        lineHeight: '1'
      }
    },
    [DEVICE_TYPE.Mobile]: {
      text: {
        height: 'auto',
        padding: '0.5rem 1.5rem',
        lineHeight: '1'
      }
    }
  }[deviceType]

  const changeChain = vault => {
    let { chain } = location.query
    let promise = Promise.resolve()
    if (vault === VAULT_TYPE.USDr || vault === VAULT_TYPE.ETHr) {
      chain = MATIC.id
    } else if (vault === VAULT_TYPE.ETHi || vault === VAULT_TYPE.USDi) {
      chain = ETH.id
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
