import React, { useMemo } from 'react'

// === Components === //
import ETHi from './ethi'
import USDi from './usdi'

// === Jotai === //
import { useAtom } from 'jotai'
import { initialStateAtom } from '@/jotai'

// === Constants === //
import { VAULT_TYPE } from '@/constants/vault'

export default function Home() {
  const [initialState] = useAtom(initialStateAtom)

  const { vault = VAULT_TYPE.ETHi } = initialState
  const Comp = useMemo(() => {
    return vault === VAULT_TYPE.USDi ? USDi : ETHi
  }, [vault])

  return <Comp />
}
