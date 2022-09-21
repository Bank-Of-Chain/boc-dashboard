import React from 'react'
import { DefaultFooter } from '@ant-design/pro-layout'

// === Utils === //
import { isMarketingHost } from '@/utils/location'

const Footer = () => {
  const currentYear = new Date().getFullYear()
  const isMarketing = isMarketingHost()
  return (
    <DefaultFooter
      copyright={`Produced by Bank Of Chain ${currentYear}`}
      links={[
        {
          key: 'BoC Homepage',
          title: 'BoC Homepage',
          href: isMarketing ? 'https://bankofchain.io/' : 'https://v2.bankofchain.io/',
          blankTarget: true
        },
        {
          key: 'BoC Dashboard',
          title: 'BoC Dashboard',
          href: isMarketing ? 'https://dashboard.bankofchain.io/' : 'https://dashboard-v2.bankofchain.io/',
          blankTarget: true
        }
      ]}
    />
  )
}

export default Footer
