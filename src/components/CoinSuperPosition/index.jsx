import React from 'react'
import PropTypes from 'prop-types'

// === Components === //
import { Image } from 'antd'

// === Utils === //
import isString from 'lodash/isString'
import { isArray } from 'lodash'
import map from 'lodash/map'

// === Constants === //
import { IMAGE_ROOT } from '@/config/config'

const DEFAULT = `${IMAGE_ROOT}/default.png`

const CoinSuperPosition = ({ className, array = [], size = 24 }) => {
  const imageRender = (address, i) => (
    <Image
      title={address}
      preview={false}
      key={`${address + i}`}
      width={size}
      style={{ borderRadius: '50%', verticalAlign: 'sub' }}
      wrapperStyle={{
        marginLeft: i === 0 ? 0 : -10,
        zIndex: array.length - i
      }}
      src={`${IMAGE_ROOT}/images/${address}.png`}
      fallback={DEFAULT}
    />
  )

  if (isString(array)) {
    return <div className={className}>{imageRender(array, 0)}</div>
  } else if (isArray(array)) {
    return <div className={className}>{map(array, (address, i) => imageRender(address, i))}</div>
  }
  return <span />
}

CoinSuperPosition.propTypes = {
  array: PropTypes.array,
  size: PropTypes.any
}

export default CoinSuperPosition
