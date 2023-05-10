import React from 'react'
import PropTypes from 'prop-types'

// === Components === //
import { Card } from 'antd'

const renderTotal = (total, unit) => {
  if (!total && total !== 0) {
    return null
  }

  let totalDom

  switch (typeof total) {
    case 'undefined':
      totalDom = null
      break

    case 'function':
      totalDom = (
        <div className="h-13 mt-3 overflow-hidden font-bold text-10 line-height-13">
          <span>{total()}</span>
          {unit && (
            <span
              className="ml-2 text-10"
              style={{
                backgroundImage: 'linear-gradient(223.3deg,#a68efd 20.71%,#f4acf3 103.56%)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              {unit}
            </span>
          )}
        </div>
      )
      break

    default:
      totalDom = (
        <div className="h-13 mt-3 overflow-hidden font-bold text-10 line-height-13">
          <span>{total}</span>
          {unit && (
            <span
              className="ml-2 text-10"
              style={{
                backgroundImage: 'linear-gradient(223.3deg,#a68efd 20.71%,#f4acf3 103.56%)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              {unit}
            </span>
          )}
        </div>
      )
  }

  return totalDom
}

const ChartCard = props => {
  const { loading = false, ...rest } = props
  const { contentHeight, title, action, total, footer, children, ...rrest } = rest
  const renderContent = () => {
    if (loading) {
      return false
    }

    return (
      <div>
        <div className="w-full overflow-hidden">
          <div className="text-4 flex justify-between">
            <span className="text-5 text-white">{title}</span>
            <span className="cursor-pointer">{action}</span>
          </div>
          {renderTotal(total, props.unit)}
        </div>
        {children && (
          <div
            className="w-full relative"
            style={{
              height: contentHeight || 'auto'
            }}
          >
            <div className={contentHeight ? 'absolute bottom-0 left-0 w-full' : ''}>{children}</div>
          </div>
        )}
        <div className="text-3 h-4">{footer}</div>
      </div>
    )
  }

  return (
    <Card
      loading={loading}
      className="p-4 b-rd-5"
      style={{ background: 'linear-gradient(111.68deg,rgba(87,97,125,0.2) 7.59%,hsla(0,0%,100%,0.078) 102.04%)' }}
      {...rrest}
    >
      {renderContent()}
    </Card>
  )
}

ChartCard.propTypes = {
  loading: PropTypes.bool.isRequired,
  unit: PropTypes.string
}

export default ChartCard
