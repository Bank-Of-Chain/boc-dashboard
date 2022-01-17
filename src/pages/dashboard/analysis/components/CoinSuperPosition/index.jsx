import React from 'react'

// === Components === //
import { Image } from 'antd'

// === Utils === //
import isString from 'lodash/isString'
import isArray from 'lodash/isArray'
import map from 'lodash/map'

const USDT_IMAGE = 'https://bankofchain.io/images/0xdAC17F958D2ee523a2206206994597C13D831ec7.webp'
const DAI_IMAGE = 'https://bankofchain.io/images/0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3.webp'
const USDC_IMAGE = 'https://bankofchain.io/images/0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174.webp'
const TUSD_IMAGE = 'https://bankofchain.io/images/0x14016E85a25aeb13065688cAFB43044C2ef86784.webp'
const USDP_IMAGE = 'https://bankofchain.io/images/0x8E870D67F660D95d5be530380D0eC0bd388289E1.webp'
const BUSD_IMAGE = 'https://bankofchain.io/images/0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56.webp'

const addressMap = {
  '0x55d398326f99059fF775485246999027B3197955': USDT_IMAGE,
  '0xdAC17F958D2ee523a2206206994597C13D831ec7': USDT_IMAGE,
  '0xc2132D05D31c914a87C6611C10748AEb04B58e8F': USDT_IMAGE,

  '0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3': DAI_IMAGE,
  '0x6B175474E89094C44Da98b954EedeAC495271d0F': DAI_IMAGE,
  '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063': DAI_IMAGE,

  '0x8E870D67F660D95d5be530380D0eC0bd388289E1': USDP_IMAGE,

  '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d': USDC_IMAGE,
  '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174': USDC_IMAGE,
  '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48': USDC_IMAGE,

  '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56': BUSD_IMAGE,
  '0x4Fabb145d64652a948d72533023f6E7A623C7C53': BUSD_IMAGE,

  '0x0000000000085d4780B73119b644AE5ecd22b376': TUSD_IMAGE,
  '0x14016E85a25aeb13065688cAFB43044C2ef86784': TUSD_IMAGE,
}
const DEFAULT = '/images/default.webp';

const CoinSuperPosition = ({ array, size = 24 }) => {
  const imageRender = (address, i) => (
    <Image
      preview={false}
      key={`${address + i}`}
      width={size}
      src={addressMap[address] || DEFAULT}
      fallback={DEFAULT}
    />
  )

  if (isString(array)) {
    return imageRender(array, 0)
  } else if (isArray(array)) {
    return <div>{map(array, (address, i) => imageRender(address, i))}</div>
  }
  return <span />
}

export default CoinSuperPosition
