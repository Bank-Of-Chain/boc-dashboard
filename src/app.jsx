import React, { lazy, useEffect, useMemo, Suspense } from 'react'
import { Switch, Route, Redirect, useLocation, useHistory } from 'react-router-dom'

// === Components === //
import { Layout } from 'antd'
import HoverIcon from '@/components/HoverIcon'
import RightContent from '@/components/RightContent'
import FooterComponent from '@/components/Footer'

// === Jotai === //
import { useAtom } from 'jotai'
import { initialStateAtom } from '@/jotai'

// === Constants === //
import { IMAGE_ROOT } from '@/config/config'
import { ETHI_VAULT, ETHI_FOR_ETH, USDI_FOR_ETH, USDI_VAULT_FOR_ETH, VAULT_BUFFER_FOR_ETHI_ETH, VAULT_BUFFER_FOR_USDI_ETH } from '@/config/config'

// === Routers === //
const Home = lazy(() => import('./pages/home/index'))
const Prices = lazy(() => import('./pages/prices/index'))
const Reports = lazy(() => import('./pages/reports/index'))
const StrategyDetail = lazy(() => import('./pages/strategyDetail/index'))

const { Header, Footer, Content } = Layout

const App = () => {
  const [initialState, setInitialState] = useAtom(initialStateAtom)

  const history = useHistory()

  const location = useLocation()

  const { search } = location
  const query = useMemo(() => new URLSearchParams(search), [search])
  console.log('initialState=', initialState, search, query.get('vault'))

  useEffect(() => {
    const nextChain = query.get('chain') || initialState.chain || '1'
    const nextVault = query.get('vault') || initialState.vault || 'ethi'
    let nextVaultAddress = '',
      nextTokenAddress = '',
      nextVaultBufferAddress = ''

    if (nextVault === 'ethi') {
      nextVaultAddress = ETHI_VAULT
      nextTokenAddress = ETHI_FOR_ETH
      nextVaultBufferAddress = VAULT_BUFFER_FOR_ETHI_ETH
    } else if (nextVault === 'usdi') {
      nextVaultAddress = USDI_VAULT_FOR_ETH
      nextTokenAddress = USDI_FOR_ETH
      nextVaultBufferAddress = VAULT_BUFFER_FOR_USDI_ETH
    }

    setInitialState({
      chain: nextChain,
      vault: nextVault,
      vaultAddress: nextVaultAddress,
      tokenAddress: nextTokenAddress,
      vaultBufferAddress: nextVaultBufferAddress
    })
  }, [setInitialState, query])

  const nextProps = {}
  return (
    <Layout className="h-full bg-[#1e1e1f]">
      <Header
        className="h-16 line-height-16 bg-[#1e1e1e] flex justify-between m-auto"
        style={{ width: '100%', maxWidth: '1200px', position: 'sticky', top: 0, zIndex: 99 }}
      >
        <HoverIcon
          defaultIcon={<img onClick={() => history.push('/')} src={`${IMAGE_ROOT}/logo-v2.svg`} alt="logo" />}
          activeIcon={<img onClick={() => history.push('/')} src={`${IMAGE_ROOT}/logo-active.svg`} alt="logo" />}
        />
        <RightContent />
      </Header>
      <Content className="min-h-screen p-8 m-auto" style={{ width: '100%', maxWidth: '1200px' }}>
        <Switch>
          <Route exact path="/">
            <Suspense>
              <Home {...nextProps} />
            </Suspense>
          </Route>
          <Route exact path="/prices">
            <Suspense>
              <Prices {...nextProps} />
            </Suspense>
          </Route>
          <Route exact path="/reports">
            <Suspense>
              <Reports {...nextProps} />
            </Suspense>
          </Route>
          <Route exact path="/strategy">
            <Suspense>
              <StrategyDetail {...nextProps} />
            </Suspense>
          </Route>
          <Route path="*">
            <Redirect
              to={{
                pathname: '/'
              }}
            />
          </Route>
        </Switch>
      </Content>
      <Footer
        className="bg-transparent"
        style={{
          textAlign: 'center'
        }}
      >
        <FooterComponent />
      </Footer>
    </Layout>
  )
}

export default App
