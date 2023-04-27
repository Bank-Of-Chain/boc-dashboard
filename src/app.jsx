import React from 'react'
import { PageLoading } from '@ant-design/pro-layout'
import { history } from 'umi'
import RightContent from '@/components/RightContent'
import Footer from '@/components/Footer'
import HoverIcon from '@/components/HoverIcon'

// === Constants === //
import { ETH } from './constants/chain'
import { VAULT_TYPE } from '@/constants/vault'

import { getVaultConfig } from '@/utils/vault'

// loading
export const initialStateConfig = {
  loading: <PageLoading />
}
/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */

export async function getInitialState() {
  return {
    chain: ''
  }
}

// ProLayout https://procomponents.ant.design/components/layout
export const layout = ({ initialState, setInitialState }) => {
  return {
    logo: (
      <HoverIcon
        defaultIcon={
          <>
            <img src={`${IMAGE_ROOT}/logo-v2.svg`} alt="logo" />
            <span
              style={{
                color: '#a78bfa',
                border: '1px solid #a78bfa',
                padding: '0.05rem 0.125rem',
                float: 'right',
                lineHeight: 1,
                marginTop: '1rem',
                borderRadius: '0.25rem',
                fontSize: '0.5rem'
              }}
            >
              Beta
            </span>
          </>
        }
        activeIcon={
          <>
            <img src={`${IMAGE_ROOT}/logo-active.svg`} alt="logo" />
            <span
              style={{
                color: '#a78bfa',
                border: '1px solid #a78bfa',
                padding: '0.05rem 0.125rem',
                float: 'right',
                lineHeight: 1,
                marginTop: '1rem',
                borderRadius: '0.25rem',
                fontSize: '0.5rem'
              }}
            >
              Beta
            </span>
          </>
        }
      />
    ),
    rightContentRender: () => <RightContent />,
    disableContentMargin: false,
    waterMarkProps: {
      content: initialState?.chain
    },
    headerHeight: '5rem',
    footerRender: () => <Footer />,
    onPageChange: () => {
      const {
        location: {
          query: { chain, vault }
        }
      } = history
      let nextChainId = initialState.chain ? initialState.chain : chain ? chain : ETH.id
      let nextVault = initialState.vault ? initialState.vault : vault ? vault : VAULT_TYPE.ETHi
      if (vault === VAULT_TYPE.ETHi) {
        nextChainId = ETH.id
      }
      setInitialState({
        chain: nextChainId,
        vault: nextVault,
        ...getVaultConfig(nextChainId, nextVault)
      })
    },
    links: [],
    menuHeaderRender: undefined,
    collapsedButtonRender: () => null,
    ...initialState?.settings
  }
}
