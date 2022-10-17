import React from 'react'
import PropTypes from 'prop-types'
import { useModel, history } from 'umi'

// === Components === //
import { Radio, Row, Col } from 'antd'

// === Constants === //
import CHAINS from '@/constants/chain'
import { POLYGON_HIDDEN } from '@/constants'

// === Utils === //
import map from 'lodash/map'
import filter from 'lodash/filter'
import { changeNetwork } from '@/utils/network'
import useWallet from '@/hooks/useWallet'

// === Styles === //
import styles from './index.less'

const options = map(
  filter(CHAINS, i => {
    return !(POLYGON_HIDDEN && i.id === '137')
  }),
  i => {
    return {
      label: i.name,
      value: i.id
    }
  }
)

const ChainChange = props => {
  const { shouldChangeChain } = props

  const { initialState } = useModel('@@initialState')
  const { userProvider, getWalletName } = useWallet()

  const changeChain = value => {
    const { vault } = history.location.query
    let promise = Promise.resolve()
    if (shouldChangeChain) {
      promise = changeNetwork(value, userProvider, getWalletName(), {
        resolveWhenUnsupport: true
      })
    }
    promise.then(() => {
      history.push({
        query: {
          chain: value,
          vault
        }
      })
      setTimeout(() => {
        location.reload()
      }, 100)
    })
  }

  return (
    <Row>
      <Col span={24} className={styles.container}>
        <Radio.Group size="large" onChange={v => changeChain(v.target.value)} value={initialState.chain} buttonStyle="solid">
          {map(options, (item, key) => (
            <Radio.Button style={{ padding: '1rem 5rem', height: 'auto', lineHeight: 1 }} value={item.value} key={key}>
              {item.label}
            </Radio.Button>
          ))}
        </Radio.Group>
      </Col>
    </Row>
  )
}

ChainChange.propTypes = {
  shouldChangeChain: PropTypes.bool
}

export default ChainChange
