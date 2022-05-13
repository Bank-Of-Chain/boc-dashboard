import React, { useEffect, useState } from 'react'
import { useModel } from 'umi'
import { Modal, Result } from 'antd'
import { GridContent } from '@ant-design/pro-layout'
import isUndefined from 'lodash/isUndefined'
import isEmpty from 'lodash/isEmpty'
import isEqual from 'lodash/isEqual'
import find from 'lodash/find'
import { isProEnv } from "@/services/env-service"
import useAdminRole from '@/hooks/useAdminRole'
import { VAULT_TYPE } from '@/constants/vault'
import CHAINS, { CHIANS_NAME } from '@/constants/chain'
import ETHi from './ethi'
import USDi from './usdi'
// === Components === //
import ChainChange from "@/components/ChainChange"

export default function Mine() {
  const { initialState } = useModel('@@initialState')
  const [showWarningModal, setShowWarningModal] = useState(false)
  const { error: roleError } = useAdminRole(initialState.address)

  useEffect(() => {
    const { chain, walletChainId } = initialState
    // 链id不相同，如果是开发环境，且walletChainId=31337，则不展示
    if (!isEmpty(chain) && !isEmpty(walletChainId) && !isEqual(chain, walletChainId)) {
      if (!isProEnv(ENV_INDEX) && isEqual(walletChainId, '31337')) {
        setShowWarningModal(false)
        return
      }
      setShowWarningModal(true)
    }
  }, [initialState])

  useEffect(() => {
    // 加载异常，一定弹窗
    if (roleError) {
      setShowWarningModal(true)
    }
  }, [roleError])

  const changeNetwork = async id => {
    const targetNetwork = find(CHAINS, { id })
    console.log('targetNetwork=', targetNetwork)
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
    console.log('data', data)

    let switchTx
    try {
      switchTx = await ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: data[0].chainId }],
      })
    } catch (switchError) {
      try {
        switchTx = await ethereum.request({
          method: 'wallet_addEthereumChain',
          params: data,
        })
      } catch (addError) {
        console.log('addError=', addError)
      }
    }

    if (switchTx) {
      console.log(switchTx)
    }
  }
  const hideModal = () => {
    setShowWarningModal(false)
  }
  if (isEmpty(initialState.address)) {
    return (
      <Result
        status='500'
        title={isUndefined(window.ethereum) ? '' : 'No Connect!'}
        subTitle={
          isUndefined(window.ethereum) ? 'Please install Metamask first.' : 'Please connect metamask first.'
        }
      />
    )
  }

  const Comp = {
    [VAULT_TYPE.USDi]: USDi,
    [VAULT_TYPE.ETHi]: ETHi,
  }[initialState.vault]

  return (
    <GridContent>
      <ChainChange />
      <Comp />
    </GridContent>
  )
}
