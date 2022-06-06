import React from 'react'
import { useModel } from 'umi'
import { Result } from 'antd'
import { GridContent } from '@ant-design/pro-layout'
import isEmpty from 'lodash/isEmpty'
import { VAULT_TYPE } from '@/constants/vault'
import useWallet from '@/hooks/useWallet'
import ETHi from './ethi'
import USDi from './usdi'

export default function Mine() {
  const { initialState } = useModel('@@initialState')
  const { userProvider } = useWallet()

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
    </GridContent>
  )
}
