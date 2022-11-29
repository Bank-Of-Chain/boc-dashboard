import React from 'react'
import { DefaultFooter } from '@ant-design/pro-layout'

// === Hooks === //
// import useABTest from '@/hooks/useABTest'

// === Utils === //
import { isMarketingHost } from '@/utils/location'

// === Constants === //
// import { MAIL_HIDDEN } from '@/constants/abtest'

const Footer = () => {
  const currentYear = new Date().getFullYear()
  const isMarketing = isMarketingHost()
  // const { [MAIL_HIDDEN]: mailHidden } = useABTest()
  return (
    <DefaultFooter
      copyright={`Produced by Bank Of Chain ${currentYear}`}
      links={[
        {
          key: 'BoC Homepage',
          title: 'BoC Homepage',
          href: isMarketing ? 'https://bankofchain.io/' : IMAGE_ROOT,
          blankTarget: true
        },
        {
          key: 'BoC Dashboard',
          title: 'BoC Dashboard',
          href: isMarketing ? 'https://dashboard.bankofchain.io/' : DASHBOARD_ROOT,
          blankTarget: true
        }
      ]}
    />
  )
}

export default Footer
