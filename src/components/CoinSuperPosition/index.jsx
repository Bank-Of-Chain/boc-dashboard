import React from 'react'
import PropTypes from 'prop-types'

// === Components === //
import { Image } from 'antd'

// === Utils === //
import isString from 'lodash/isString'
import { isArray } from 'lodash'
import map from 'lodash/map'

const DEFAULT = `${IMAGE_ROOT}/default.png`

const CoinSuperPosition = ({ array = [], size = 24 }) => {
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
      src={`http://localhost:3000/images/${address}.png`}
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

CoinSuperPosition.propTypes = {
  array: PropTypes.array,
  size: PropTypes.any
}

export default CoinSuperPosition
