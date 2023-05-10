import React from 'react'
import classNames from 'classnames'

// === Components === //
import { Modal } from 'antd'

// === Utils === //
import map from 'lodash/map'

// === Styles === //
import './index.less'

const WalletModal = props => {
  const { visible, onCancel, connectTo, selected, walletOptions = [] } = props

  const handleConnect = name => {
    connectTo(name)
  }

  return (
    <Modal className="modal" open={visible} onCancel={onCancel} footer={null} title="Select a wallet">
      <div className={'content'}>
        {map(walletOptions, wallet => (
          <div
            key={wallet.value}
            className={classNames('walletItemWrapper', {
              ['walletItemWrapperSelected']: selected === wallet.symbol
            })}
          >
            <div className={'walletItem'} onClick={() => handleConnect(wallet.value)}>
              <img className={'walletLogo'} src={wallet.logo} alt="wallet logo" />
              <span className={'walletName'}>{wallet.name}</span>
            </div>
          </div>
        ))}
      </div>
    </Modal>
  )
}

export default WalletModal
