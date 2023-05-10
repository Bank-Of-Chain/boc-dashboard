import React from 'react'

const HoverIcon = props => {
  const { defaultIcon, activeIcon } = props

  return (
    <span className="relative inline-block h-full">
      <span className="h-full flex cursor-pointer">{defaultIcon}</span>
      <span className="hidden absolute top-0 left-0 opacity-0">{activeIcon}</span>
    </span>
  )
}

export default HoverIcon
