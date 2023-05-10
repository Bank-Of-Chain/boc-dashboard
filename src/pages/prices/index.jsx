import React from 'react'

// === Jotai === //
import { useAtom } from 'jotai'
import { initialStateAtom } from '@/jotai'

import ETHi from './ethi'
import USDi from './usdi'

// === Constants === //
import { VAULT_TYPE } from '@/constants/vault'
import { useMemo } from 'react'

const Prices = () => {
  const [initialState] = useAtom(initialStateAtom)

  const { vault } = initialState

  const Comp = useMemo(() => {
    return vault === VAULT_TYPE.USDi ? USDi : ETHi
  }, [vault])

  return <Comp />
}

export default Prices
