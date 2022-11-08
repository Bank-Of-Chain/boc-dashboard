import React from 'react'
import { useModel } from 'umi'

// === Components === //
import ETHi from './ethi'
import USDi from './usdi'
import ETHr from './ethr'
import USDr from './usdr'
import USDrV2 from './usdrV2'
import ETHrV2 from './ethrV2'
import NoFoundPage from './../404'

// === Constants === //
import { VAULT_TYPE } from '@/constants/vault'

// === Utils === //
import isUndefined from 'lodash/isUndefined'

export default function Home(props) {
  const { initialState } = useModel('@@initialState')
  const Comp = {
    [VAULT_TYPE.USDi]: USDi,
    [VAULT_TYPE.ETHi]: ETHi,
    [VAULT_TYPE.ETHr]: ETHr,
    [VAULT_TYPE.USDr]: USDr,
    [VAULT_TYPE.ETHrV2]: ETHrV2,
    [VAULT_TYPE.USDrV2]: USDrV2
  }[initialState.vault]

  if (isUndefined(Comp)) return <NoFoundPage />

  return <Comp {...props} />
}
