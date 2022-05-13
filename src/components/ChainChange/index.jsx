import React from 'react'
import { useModel, history } from 'umi'

// === Components === //
import { Tabs } from 'antd'

// === Constants === //
import CHAINS from '@/constants/chain'

// === Utils === //
import map from 'lodash/map'
import find from 'lodash/find'
import isEmpty from 'lodash/isEmpty'

const { TabPane } = Tabs

export default function ChainChange (props) {
  const { shouldChangeChain } = props

  const { initialState } = useModel('@@initialState')

  const changeChain = value => {
    const { vault } = history.location.query
    let promise = Promise.resolve()
    if (shouldChangeChain){
      promise = changeNetwork(value)
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

  const changeNetwork = id => {
    return new Promise(async (resolve, reject) => {
      const targetNetwork = find(CHAINS, { id })
      if (isEmpty(targetNetwork)) return
      const ethereum = window.ethereum
      const data = [
        {
          chainId: `0x${Number(targetNetwork.id).toString(16)}`,
          chainName: targetNetwork.name,
          nativeCurrency: targetNetwork.nativeCurrency,
          rpcUrls: [targetNetwork.rpcUrl],
          blockExplorerUrls: [targetNetwork.blockExplorer],
        },
      ]
      let switchTx
      try {
        switchTx = await ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: data[0].chainId }],
        })
      } catch (switchError) {
        console.log('switchError=', switchTx, switchError)
        if (switchError.code === 4001) {
          reject()
        }
        try {
          switchTx = await ethereum.request({
            method: 'wallet_addEthereumChain',
            params: data,
          })
        } catch (addError) {
          console.log('addError=', addError)
          reject()
        }
      }

      if (switchTx) {
        console.log(switchTx)
      }
      resolve()
    })
  }

  return (
    <Tabs activeKey={initialState.chain} centered onChange={changeChain}>
      {map(CHAINS, i => (
        <TabPane tab={<span style={{ fontSize: '1.125rem' }}>{i.name}</span>} key={i.id} />
      ))}
    </Tabs>
  )
}
