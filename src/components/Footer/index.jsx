import React from 'react'
import { DefaultFooter } from '@ant-design/pro-layout'

// === Services === //
import { isProEnv } from '@/services/env-service'

// === Utils === //
import { isMarketingHost } from '@/utils/location'

const Footer = () => {
  const currentYear = new Date().getFullYear()
  const isMarketing = isMarketingHost()
  const publishDetails = isProEnv(ENV_INDEX) ? '' : `Branch: ${PUBLISH_BRANCH} Date: ${PUBLISH_TIME} Env: ${ENV_INDEX}`
  return (
    <DefaultFooter
      copyright={
        <React.Fragment>
          <span>Produced by Bank Of Chain {currentYear}</span>
          <p style={{ marginTop: '8px' }}>{publishDetails}</p>
        </React.Fragment>
      }
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
