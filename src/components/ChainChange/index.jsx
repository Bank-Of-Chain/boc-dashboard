import React from 'react'
import PropTypes from 'prop-types'
import { useModel, history } from 'umi'

// === Components === //
import { Menu } from 'antd'

// === Constants === //
import CHAINS from '@/constants/chain'
import { POLYGON_HIDDEN } from '@/constants'

// === Utils === //
import map from 'lodash/map'
import filter from 'lodash/filter'
import { changeNetwork } from '@/utils/network'
import useWallet from '@/hooks/useWallet'

// === Styles === //
import styles from './index.less'

const options = map(
  filter(CHAINS, i => {
    return !(POLYGON_HIDDEN && i.id === '137')
  }),
  i => {
    return {
      label: i.name,
      value: i.id
    }
  }
)

const ChainChange = props => {
  const { chains = options, shouldChangeChain } = props

  if (chains.length <= 1) {
    return null
  }

  const { initialState } = useModel('@@initialState')
  const { userProvider, getWalletName } = useWallet()

  const changeChain = ({ key }) => {
    const { vault } = history.location.query
    let promise = Promise.resolve()
    if (shouldChangeChain) {
      promise = changeNetwork(key, userProvider, getWalletName(), {
        resolveWhenUnsupport: true
      })
    }
    promise.then(() => {
      history.push({
        query: {
          chain: key,
          vault
        }
      })
      setTimeout(() => {
        location.reload()
      }, 100)
    })
  }

  const style = {
    borderBottom: 'none',
    justifyContent: 'center',
    backgroundColor: 'transparent'
  }

  return (
    <div className={styles.container}>
      <Menu mode="horizontal" style={style} items={chains} selectedKeys={[initialState.chain]} onClick={changeChain} />
    </div>
  )
}

ChainChange.propTypes = {
  shouldChangeChain: PropTypes.bool
}

export default ChainChange
