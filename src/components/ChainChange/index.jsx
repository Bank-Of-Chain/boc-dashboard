import React from 'react'
import classNames from 'classnames'
import { useModel, history } from 'umi'

// === Components === //
import { Tabs, Radio, Row, Col } from 'antd'

// === Constants === //
import CHAINS from '@/constants/chain'

// === Utils === //
import map from 'lodash/map'
import { changeNetwork } from '@/utils/network'

import useWallet from '@/hooks/useWallet'

// === Styles === //
import styles from './index.less'

const options = map(CHAINS, i => {
  return {
    label: i.name,
    value: i.id,
  }
})

export default function ChainChange (props) {
  const { shouldChangeChain } = props

  const { initialState } = useModel('@@initialState')
  const { userProvider, getWalletName } = useWallet()

  const changeChain = value => {
    const { vault } = history.location.query
    let promise = Promise.resolve()
    if (shouldChangeChain) {
      promise = changeNetwork(value, userProvider, getWalletName(), { resolveWhenUnsupport: true })
    }
    promise.then(() => {
      history.push({
        query: {
          chain: value,
          vault,
        },
      })
      setTimeout(() => {
        location.reload()
      }, 1)
    })
  }

  return (
    <Row>
      <Col span={24} className={styles.container}>
        <Radio.Group
          options={options}
          onChange={v => changeChain(v.value)}
          value={initialState.chain}
          optionType='button'
          buttonStyle='solid'
        />
      </Col>
    </Row>
  )
}
