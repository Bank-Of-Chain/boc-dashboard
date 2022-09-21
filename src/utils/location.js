/**
 * is host for Marketing
 * @returns
 */
export const isMarketingHost = () => {
  return location.host === 'dashboard.bankofchain.io' || location.host === 'dashboard-qa03-sg.bankofchain.io'
}
