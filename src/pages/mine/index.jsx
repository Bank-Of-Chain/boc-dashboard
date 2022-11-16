import React from 'react'

// === Constants === //
import { VAULT_TYPE } from '@/constants/vault'

// === Components === //
import { Result } from 'antd'
import ETHi from './ethi'
import USDi from './usdi'
import { GridContent } from '@ant-design/pro-layout'
import NoFoundPage from './../404'

// === Utils === //
import { useModel } from 'umi'
import isEmpty from 'lodash/isEmpty'
import isUndefined from 'lodash/isUndefined'
import useWallet from '@/hooks/useWallet'

export default function Mine() {
  const { initialState } = useModel('@@initialState')
  const { userProvider } = useWallet()

  if (isEmpty(initialState.address)) {
    return <Result status="500" title={userProvider ? '' : 'No Connect!'} subTitle="Please connect wallet first." />
  }

  const Comp = {
    [VAULT_TYPE.USDi]: USDi,
    [VAULT_TYPE.ETHi]: ETHi
  }[initialState.vault]

  if (isUndefined(Comp)) return <NoFoundPage />

  return (
    <GridContent>
      <Comp />
    </GridContent>
  )
}
