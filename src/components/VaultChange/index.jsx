import React, { useMemo } from 'react'

// === Components === //
import { Radio } from 'antd'

// === Hooks === //
import { useHistory, useLocation } from 'react-router-dom'

// === Utils === //
import map from 'lodash/map'

// === Jotai === //
import { useAtom } from 'jotai'
import { initialStateAtom } from '@/jotai'

// === Contansts === //
import { ETH } from '@/constants/chain'

const options = [
  { key: 'ethi', label: 'ETHi', value: 'ethi' },
  { key: 'usdi', label: 'USDi', value: 'usdi' }
]

const VaultChange = () => {
  const [initialState] = useAtom(initialStateAtom)

  const { vault } = initialState

  const history = useHistory()

  const location = useLocation()

  const { search, pathname } = location

  const query = useMemo(() => new URLSearchParams(search), [search])

  const changeVault = vault => {
    let chain = query.get('chain') || ETH.id
    history.push(`${pathname}?chain=${chain}&vault=${vault}`)
  }

  return (
    <div className="px-8 py-0 text-center">
      <Radio.Group
        className="b-2 b-solid b-color-violet-400 border-rd"
        onChange={e => changeVault(e.target.value)}
        value={vault}
        optionType="button"
        buttonStyle="solid"
        size="large"
      >
        {map(options, (item, key) => (
          <Radio.Button className="px-20 !b-rd-0 text-violet-400 bg-transparent" value={item.value} key={key}>
            {item.label}
          </Radio.Button>
        ))}
      </Radio.Group>
    </div>
  )
}

export default VaultChange
