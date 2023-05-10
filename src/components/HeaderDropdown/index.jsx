import React from 'react'
import PropTypes from 'prop-types'
import { Dropdown } from 'antd'
import classNames from 'classnames'

const HeaderDropdown = ({ overlayClassName: cls, ...restProps }) => <Dropdown overlayClassName={classNames(cls)} {...restProps} />

HeaderDropdown.propTypes = {
  overlayClassName: PropTypes.string
}

export default HeaderDropdown
