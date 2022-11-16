import React from 'react'
import { useModel } from 'umi'

// === Components === //
import ETHi from './ethi'
import USDi from './usdi'
import NoFoundPage from './../404'

// === Constants === //
import { VAULT_TYPE } from '@/constants/vault'

// === Utils === //
import isUndefined from 'lodash/isUndefined'

const Prices = () => {
  const { initialState } = useModel('@@initialState')
  const Comp = {
    [VAULT_TYPE.USDi]: USDi,
    [VAULT_TYPE.ETHi]: ETHi
  }[initialState.vault]

  if (isUndefined(Comp)) return <NoFoundPage />

  return <Comp />
}

export default Prices
