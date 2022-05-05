import { PageLoading } from '@ant-design/pro-layout';
import { history } from 'umi';
import RightContent from '@/components/RightContent';
import Footer from '@/components/Footer';

// === Constants === //
import { ETH, MATIC } from './constants/chain';
import { VAULT_TYPE } from '@/constants/vault';

import { getVaultConfig } from '@/utils/vault';

/** 获取用户信息比较慢的时候会展示一个 loading */
export const initialStateConfig = {
  loading: <PageLoading />,
};
/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */

export async function getInitialState() {
  return {
    chain: '',
  };
} // ProLayout 支持的api https://procomponents.ant.design/components/layout

export const layout = ({ initialState, setInitialState }) => {
  return {
    logo: <img src="/logo256.png" alt="logo" onClick={() => history.push('/')} />,
    rightContentRender: () => <RightContent />,
    disableContentMargin: false,
    waterMarkProps: {
      content: initialState?.chain,
    },
    footerRender: () => <Footer />,
    onPageChange: () => {
      const {
        location: {
          query: { chain, vault },
        },
      } = history // 如果没有登录，重定向到 login
      let nextChainId = !!initialState.chain ? initialState.chain : (!!chain ? chain : MATIC.id)
      let nextVault = !!initialState.vault ? initialState.vault : (!!vault ? vault : VAULT_TYPE.USDi)
      if (vault === VAULT_TYPE.ETHi) {
        nextChainId = ETH.id
      }
      setInitialState({ chain: nextChainId, vault: nextVault, ...getVaultConfig(nextChainId, nextVault) })
    },
    links: [],
    menuHeaderRender: undefined,
    collapsedButtonRender: () => null,
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    ...initialState?.settings,
  };
};
