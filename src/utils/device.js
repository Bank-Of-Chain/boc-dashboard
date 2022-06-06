import isEmpty from 'lodash/isEmpty'

export const isMobile = () => /Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(window.navigator.userAgent)

export const isInMobileWalletApp = () => isMobile() && !isEmpty(window.ethereum)

export const isInMobileH5 = () => isMobile() && isEmpty(window.ethereum)
