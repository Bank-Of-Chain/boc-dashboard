import React from 'react'
import { useModel, history } from 'umi'

// === Components === //
import { Tabs } from 'antd'

// === Constants === //
import CHAINS from '@/constants/chain'

// === Utils === //
import map from 'lodash/map'
import { changeNetwork } from "@/utils/network"

import useWallet from '@/hooks/useWallet'
// === Styles === //
import styles from './index.less'

const { TabPane } = Tabs

export default function ChainChange (props) {
  const { shouldChangeChain } = props

  const { initialState } = useModel('@@initialState')
  const { userProvider, getWalletName } = useWallet()

  const changeChain = value => {
    const { vault } = history.location.query
    let promise = Promise.resolve()
    if (shouldChangeChain){
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
    <Tabs activeKey={initialState.chain} className={styles.tabs} centered onChange={changeChain}>
      {map(CHAINS, i => (
        <TabPane tab={<span style={{ fontSize: '1rem' }}>{i.name}</span>} key={i.id} />
      ))}
    </Tabs>
  )
}
