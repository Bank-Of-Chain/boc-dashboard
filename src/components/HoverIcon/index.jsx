import React from 'react'
import styles from './style.less'

const HoverIcon = props => {
  const { defaultIcon, activeIcon } = props

  return (
    <span className={styles.logo}>
      <span className={styles.normal}>{defaultIcon}</span>
      <span className={styles.active}>{activeIcon}</span>
    </span>
  )
}

export default HoverIcon
