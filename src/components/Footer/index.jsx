import React from 'react'
import { DefaultFooter } from '@ant-design/pro-layout'

const Footer = () => {
  const currentYear = new Date().getFullYear()
  return (
    <DefaultFooter
      copyright={`Produced by Bank Of Chain ${currentYear}`}
      links={[
        {
          key: 'BoC Homepage',
          title: 'BoC Homepage',
          href: 'https://v2.bankofchain.io/',
          blankTarget: true
        },
        {
          key: 'BoC Dashboard',
          title: 'BoC Dashboard',
          href: 'https://dashboard-v2.bankofchain.io/',
          blankTarget: true
        }
      ]}
    />
  )
}

export default Footer
