import React from 'react'
import { useModel } from 'umi'

// === Components === //
import ETHi from './ethi'
import USDi from './usdi'

// === Constants === //
import { VAULT_TYPE } from '@/constants/vault'

export default function Home() {
  const { initialState } = useModel('@@initialState')
  const Comp = {
    [VAULT_TYPE.USDi]: USDi,
    [VAULT_TYPE.ETHi]: ETHi
  }[initialState.vault]

  return <Comp />
}
