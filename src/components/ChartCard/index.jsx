import React from "react";
import classNames from "classnames";

// === Components === //
import { Card } from "antd";

// === Styles === //
import styles from "./index.less";

const renderTotal = (total, unit) => {
  if (!total && total !== 0) {
    return null;
  }

  let totalDom;

  switch (typeof total) {
    case "undefined":
      totalDom = null;
      break;

    case "function":
      totalDom = (
        <div className={styles.total}>
          <span>{total()}</span>
          {unit && <span className={styles.unit}>{unit}</span>}
        </div>
      );
      break;

    default:
      totalDom = (
        <div className={styles.total}>
          <span>{total}</span>
          {unit && <span className={styles.unit}>{unit}</span>}
        </div>
      );
  }

  return totalDom;
};

const ChartCard = () => {
  const renderContent = () => {
    const {
      contentHeight,
      title,
      avatar,
      action,
      total,
      footer,
      children,
      loading,
      unit,
    } = this.props;

    if (loading) {
      return false;
    }

    return (
      <div className={styles.chartCard}>
        <div className={classNames(styles.chartTop)}>
          <div className={styles.avatar}>{avatar}</div>
          <div className={styles.metaWrap}>
            <div className={styles.meta}>
              <span className={styles.title}>{title}</span>
              <span className={styles.action}>{action}</span>
            </div>
            {renderTotal(total, unit)}
          </div>
        </div>
        {children && (
          <div
            className={styles.content}
            style={{
              height: contentHeight || "auto",
            }}
          >
            <div className={contentHeight && styles.contentFixed}>
              {children}
            </div>
          </div>
        )}
        {footer && (
          <div
            className={classNames(styles.footer, {
              [styles.footerMargin]: !children,
            })}
          >
            {footer}
          </div>
        )}
      </div>
    );
  };

  const { loading = false, ...rest } = this.props;
  return (
    <Card loading={loading} className={styles.card} {...rest}>
      {renderContent()}
    </Card>
  );
};

export default ChartCard;
