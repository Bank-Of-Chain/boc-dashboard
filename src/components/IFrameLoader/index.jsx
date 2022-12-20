import { isEmpty } from 'lodash'
import React, { useRef } from 'react'
import { useEffect } from 'react'

const IFrameLoader = props => {
  const { className, frameBorder, src, onload } = props
  const gridIframe = useRef(null)
  const iframeDom = gridIframe.current

  useEffect(() => {
    if (isEmpty(iframeDom)) return
    const content = iframeDom.contentDocument
    iframeDom.addEventListener('load', () => onload(content))
    return () => iframeDom.removeEventListener('load', () => onload(content))
  }, [iframeDom])

  return <iframe ref={gridIframe} className={className} src={src} frameBorder={frameBorder} />
}

export default IFrameLoader
