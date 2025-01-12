import React from 'react'
import PropTypes from 'prop-types'
import { Dropdown } from 'antd'
import classNames from 'classnames'
import styles from './index.less'

const HeaderDropdown = ({ overlayClassName: cls, ...restProps }) => <Dropdown overlayClassName={classNames(styles.container, cls)} {...restProps} />

HeaderDropdown.propTypes = {
  overlayClassName: PropTypes.string
}

export default HeaderDropdown
