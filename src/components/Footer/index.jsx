import React from 'react'
import { DefaultFooter } from '@ant-design/pro-layout'

const Footer = () => {
  const currentYear = new Date().getFullYear()
  return (
    <DefaultFooter
      copyright={`Produced by Bank Of Chain ${currentYear}`}
      links={[
        {
          key: 'BOC Homepage',
          title: 'BOC Homepage',
          href: 'https://bankofchain.io/',
          blankTarget: true
        },
        {
          key: 'BOC Dashboard',
          title: 'BOC Dashboard',
          href: 'https://dashboard.bankofchain.io/',
          blankTarget: true
        }
      ]}
    />
  )
}

export default Footer
