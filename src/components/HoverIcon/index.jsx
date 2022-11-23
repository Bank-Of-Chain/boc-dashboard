import React from 'react'
import styles from './style.less'

const HoverIcon = props => {
  const { defaultIcon, activeIcon, href } = props

  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      <span className={styles.logo}>
        <span className={styles.normal}>{defaultIcon}</span>
        <span className={styles.active}>{activeIcon}</span>
      </span>
    </a>
  )
}

export default HoverIcon
