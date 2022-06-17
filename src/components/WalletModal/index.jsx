import React from "react"
import map from "lodash/map"
import classNames from "classnames"
import { Modal } from "antd"
import styles from './index.less'

export default function WalletModal({
  visible,
  onCancel,
  connectTo,
  selected,
  walletOptions = []
}) {

  const handleConnect = (name) => {
    connectTo(name)
  }

  return (
    <Modal
      className={styles.modal}
      visible={visible}
      onCancel={onCancel}
      footer={null}
      title="Select a wallet"
    >
      <div className={styles.content}>
        {map(walletOptions, (wallet) => (
          <div
            key={wallet.value}
            className={classNames(styles.walletItemWrapper, {
              [styles.walletItemWrapperSelected]: selected === wallet.symbol
            })}
          >
            <div className={styles.walletItem} onClick={() => handleConnect(wallet.value)}>
              <img className={styles.walletLogo} src={wallet.logo} alt="wallet logo" />
              <span className={styles.walletName}>{wallet.name}</span>
            </div>
          </div>
        ))}
      </div>
    </Modal>
  )
}
