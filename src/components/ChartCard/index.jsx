import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

// === Components === //
import { Card } from 'antd'

// === Styles === //
import styles from './index.less'

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
        <div className={styles.total}>
          <span>{total()}</span>
          {unit && <span className={styles.unit}>{unit}</span>}
        </div>
      )
      break

    default:
      totalDom = (
        <div className={styles.total}>
          <span>{total}</span>
          {unit && <span className={styles.unit}>{unit}</span>}
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
      <div className={styles.chartCard}>
        <div className={classNames(styles.chartTop)}>
          <div className={styles.metaWrap}>
            <div className={styles.meta}>
              <span className={styles.title}>{title}</span>
              <span className={styles.action}>{action}</span>
            </div>
            {renderTotal(total, props.unit)}
          </div>
        </div>
        {children && (
          <div
            className={styles.content}
            style={{
              height: contentHeight || 'auto'
            }}
          >
            <div className={contentHeight && styles.contentFixed}>{children}</div>
          </div>
        )}
        <div className={styles.footer}>{footer}</div>
      </div>
    )
  }

  return (
    <Card loading={loading} className={styles.card} {...rrest}>
      {renderContent()}
    </Card>
  )
}

ChartCard.propTypes = {
  loading: PropTypes.bool.isRequired,
  unit: PropTypes.string
}

export default ChartCard
