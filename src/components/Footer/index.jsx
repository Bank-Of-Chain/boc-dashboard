import React from 'react'

// === Hooks === //
// import useABTest from '@/hooks/useABTest'

// === Utils === //
import { isMarketingHost } from '@/utils/location'

// === Constants === //
import { IMAGE_ROOT, DASHBOARD_ROOT } from '@/config/config'

const Footer = () => {
  const currentYear = new Date().getFullYear()
  const isMarketing = isMarketingHost()
  return (
    <div className="text-center">
      <p className="flex justify-center">
        <a className="text-zinc-500 hover:text-white" href={isMarketing ? 'https://bankofchain.io/' : IMAGE_ROOT}>
          BoC Homepage
        </a>
        <a className="ml-4 text-zinc-500 hover:text-white" href={isMarketing ? 'https://dashboard.bankofchain.io/' : DASHBOARD_ROOT}>
          BoC Dashboard
        </a>
      </p>
      <p className="text-zinc-500">@Produced by Bank Of Chain ${currentYear}</p>
    </div>
  )
}

export default Footer
