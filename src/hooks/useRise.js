import React, { useCallback, useEffect, useState } from 'react'

// === Components === //
import CountTo from 'react-count-to'

// === Utils === //
import isEqual from 'lodash/isEqual'

const useRise = (promiseCall, interval = 3000) => {
  const [oldValue, setOldValue] = useState(0)
  const [newValue, setNewValue] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      return promiseCall().then(rs => {
        if (!isEqual(rs, newValue)) {
          setNewValue(rs)
          setOldValue(newValue)
        }
      })
    }, interval)
    return () => clearInterval(timer)
  }, [promiseCall, interval, newValue])

  const element = useCallback(() => {
    const fn = value => {
      return <span>{Number(value / 100)?.toFixed(2)}</span>
    }
    return (
      <CountTo key={newValue} from={100 * oldValue} to={100 * newValue} speed={interval}>
        {fn}
      </CountTo>
    )
  }, [oldValue, newValue, interval])

  return { oldValue, newValue, element }
}

export default useRise
