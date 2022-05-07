import React from 'react';

// === Components === //
import { Image } from 'antd';

// === Utils === //
import isString from 'lodash/isString';
import isArray from 'lodash/isArray';
import map from 'lodash/map';

const USDT_IMAGE = `${IMAGE_ROOT}/images/0xdAC17F958D2ee523a2206206994597C13D831ec7.png`;
const DAI_IMAGE = `${IMAGE_ROOT}/images/0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3.png`;
const USDC_IMAGE = `${IMAGE_ROOT}/images/0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174.png`;
const TUSD_IMAGE = `${IMAGE_ROOT}/images/0x14016E85a25aeb13065688cAFB43044C2ef86784.png`;
const USDP_IMAGE = `${IMAGE_ROOT}/images/0x8E870D67F660D95d5be530380D0eC0bd388289E1.png`;
const BUSD_IMAGE = `${IMAGE_ROOT}/images/0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56.png`;
const MIM_IMAGE = `${IMAGE_ROOT}/images/0x99D8a9C45b2ecA8864373A26D1459e3Dff1e17F3.png`;
const LUSD_IMAGE = `${IMAGE_ROOT}/images/0x5f98805A4E8be255a32880FDeC7F6728C6568bA0.png`;
const ETH_IMAGE = `${IMAGE_ROOT}/images/0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE.png`;
const STETH_IMAGE = `${IMAGE_ROOT}/images/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84.png`;
const RETH_IMAGE = `${IMAGE_ROOT}/images/0xae78736Cd615f374D3085123A210448E74Fc6393.png`;
const WSTETH_IMAGE = `${IMAGE_ROOT}/images/0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0.png`;
const WETH_IMAGE = `${IMAGE_ROOT}/images/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2.png`;

const addressMap = {
  '0x55d398326f99059ff775485246999027b3197955': USDT_IMAGE,
  '0xdac17f958d2ee523a2206206994597c13d831ec7': USDT_IMAGE,
  '0xc2132D05D31c914a87C6611C10748AEb04B58e8F': USDT_IMAGE,
  '0xc2132d05d31c914a87c6611c10748aeb04b58e8f': USDT_IMAGE,

  '0x1af3f329e8be154074d8769d1ffa4ee058b1dbc3': DAI_IMAGE,
  '0x6b175474e89094c44da98b954eedeac495271d0f': DAI_IMAGE,
  '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063': DAI_IMAGE,
  '0x8f3cf7ad23cd3cadbd9735aff958023239c6a063': DAI_IMAGE,

  '0x8e870d67f660d95d5be530380d0ec0bd388289e1': USDP_IMAGE,

  '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d': USDC_IMAGE,
  '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174': USDC_IMAGE,
  '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48': USDC_IMAGE,
  '0x2791bca1f2de4661ed88a30c99a7a9449aa84174': USDC_IMAGE,

  '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56': BUSD_IMAGE,
  '0x4fabb145d64652a948d72533023f6e7a623c7c53': BUSD_IMAGE,
  '0xe9e7cea3dedca5984780bafc599bd69add087d56': BUSD_IMAGE,

  '0x0000000000085d4780b73119b644ae5ecd22b376': TUSD_IMAGE,
  '0x14016e85a25aeb13065688cafb43044c2ef86784': TUSD_IMAGE,
  '0x2e1ad108ff1d8c782fcbbb89aad783ac49586756': TUSD_IMAGE,
  '0x5f98805a4e8be255a32880fdec7f6728c6568ba0': TUSD_IMAGE,

  '0x99d8a9c45b2eca8864373a26d1459e3dff1e17f3': MIM_IMAGE,

  '0x5f98805a4e8be255a32880fdec7f6728c6568ba0': LUSD_IMAGE,

  '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee': ETH_IMAGE,
  '0xae7ab96520de3a18e5e111b5eaab095312d7fe84': STETH_IMAGE,
  '0xae78736cd615f374d3085123a210448e74fc6393': RETH_IMAGE,
  '0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0': WSTETH_IMAGE,
  '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2': WETH_IMAGE,
};
const DEFAULT = '/default.png';

const CoinSuperPosition = ({ array, size = 24 }) => {
  const imageRender = (address, i) => (
    <Image
      preview={false}
      key={`${address + i}`}
      width={size}
      style={{ borderRadius: '50%'  }}
      wrapperStyle={{ marginLeft: -6, zIndex: array.length - i, }}
      src={addressMap[address] || DEFAULT}
      fallback={DEFAULT}
    />
  );

  if (isString(array)) {
    return imageRender(array, 0);
  } else if (isArray(array)) {
    return <div>{map(array, (address, i) => imageRender(address, i))}</div>;
  }
  return <span />;
};

export default CoinSuperPosition;
