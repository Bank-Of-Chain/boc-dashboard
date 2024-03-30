import React, { useState, useRef } from 'react'
import { useModel } from 'umi'

// === Components === //
import ETHi from './ethi'
import USDi from './usdi'

// === Constants === //
import { VAULT_TYPE } from '@/constants/vault'
import s from './style.less'
import { Popover, Button } from 'antd'
import Typed from 'typed.js'

export default function Home() {
  const { initialState } = useModel('@@initialState')
  const Comp = {
    [VAULT_TYPE.USDi]: USDi,
    [VAULT_TYPE.ETHi]: ETHi
  }[initialState.vault]

  const [open, setOpen] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const ref = useRef(null)
  const handleOpenChange = newOpen => {
    console.log('newOpen', newOpen)
    setOpen(newOpen)
    if (newOpen) {
      setTimeout(() => {
        new Typed(ref.current, {
          strings: ['I wanna deposit 1 APT to the APT vault.'],
          typeSpeed: 50,
          onComplete: () => {
            setShowConfirm(true)
          }
        })
      }, 3000)
    }
  }

  const toDeposit = () => {
    window.location.href = 'http://localhost:3000'
  }

  return (
    <div>
      <Comp />
      <div className={s.robot}>
        <Popover
          placement="topRight"
          content={
            <div className={s.popover}>
              <span className={s.loader} />
              <span ref={ref} />
              {showConfirm && <Button size="large" onClick={toDeposit}>Confirm</Button>}
            </div>
          }
          title=""
          trigger="click"
          open={open}
          onOpenChange={handleOpenChange}
        >
          <img src="/robot.png" alt="" className={s.icon} />
        </Popover>
      </div>
    </div>
  )
}
