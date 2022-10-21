import React from 'react'
import PropTypes from 'prop-types'
import { useModel, history } from 'umi'

// === Components === //
import { Radio, Row, Col } from 'antd'

// === Constants === //

// === Utils === //
import map from 'lodash/map'
import { getVaultConfig } from '@/utils/vault'

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

  const changeChain = vault => {
    const { chain } = history.location.query
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
