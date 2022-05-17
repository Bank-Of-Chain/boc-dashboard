import React, { useEffect, useState } from 'react'
import { useModel } from 'umi'
import { Modal, Result } from 'antd'
import { GridContent } from '@ant-design/pro-layout'
import isEmpty from 'lodash/isEmpty'
import isEqual from 'lodash/isEqual'
import find from 'lodash/find'
import { isProEnv } from "@/services/env-service"
import useAdminRole from '@/hooks/useAdminRole'
import useWallet from '@/hooks/useWallet'
import { VAULT_TYPE } from '@/constants/vault'
import CHAINS, { CHIANS_NAME } from '@/constants/chain'
import ETHi from './ethi'
import USDi from './usdi'

export default function Mine() {
  const { initialState } = useModel('@@initialState')
  const [showWarningModal, setShowWarningModal] = useState(false)
  const { error: roleError } = useAdminRole(initialState.address)
  const { userProvider } = useWallet()

  useEffect(() => {
    const { chain, walletChainId } = initialState
    // 链id不相同，如果是开发环境，且walletChainId=31337，则不展示
    if (!isEmpty(chain) && !isEmpty(walletChainId) && !isEqual(chain, walletChainId)) {
      if (!isProEnv(ENV_INDEX) && isEqual(walletChainId, '31337')) {
        setShowWarningModal(false)
        return
      }
      setShowWarningModal(true)
    } else {
      setShowWarningModal(false)
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
    if (!userProvider) {
      return
    }
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
      switchTx = await userProvider.send("wallet_switchEthereumChain", [{ chainId: data[0].chainId }])
    } catch (switchError) {
      try {
        switchTx = await userProvider.send("wallet_addEthereumChain", data)
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
        title={!!userProvider ? '' : 'No Connect!'}
        subTitle="Please connect wallet first."
      />
    )
  }

  const Comp = {
    [VAULT_TYPE.USDi]: USDi,
    [VAULT_TYPE.ETHi]: ETHi,
  }[initialState.vault]

  return (
    <GridContent>
      <Comp />
      <Modal
        title="Set wallet's network to current?"
        visible={showWarningModal}
        onOk={() => changeNetwork(initialState.chain)}
        onCancel={hideModal}
        okText='ok'
        cancelText='close'
      >
        <p>
           Wallet Chain:{' '}
          <span style={{ color: 'red', fontWeight: 'bold' }}>{CHIANS_NAME[initialState.walletChainId] || initialState.walletChainId}</span>
        </p>
        <p>
          Current Chain:{' '}
          <span style={{ color: 'red', fontWeight: 'bold' }}>{CHIANS_NAME[initialState.chain] || initialState.chain}</span>
        </p>
        {!isEmpty(roleError) && (
          <p>
            Message：<span style={{ color: 'red', fontWeight: 'bold' }}>Error Vault address!</span>
          </p>
        )}
      </Modal>
    </GridContent>
  )
}
