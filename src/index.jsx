import React from 'react'
import ReactDOMClient from 'react-dom/client'
import { ConfigProvider, theme } from 'antd'

// === Components === //
import App from './app'
import { HashRouter } from 'react-router-dom'

// === Styles === //
import './index.less'
import 'uno.css'
// import 'animate.css'

const { darkAlgorithm } = theme

const dom = document.getElementById('root')

// Create a root.
const root = ReactDOMClient.createRoot(dom)

root.render(
  <ConfigProvider
    config={{
      theme: {
        colorPrimary: '#a78bfa',
        infoColor: '#a78bfa'
      }
    }}
    theme={{
      token: {
        colorPrimary: '#a78bfa'
      },
      components: { Modal: { wireframe: true } },

      algorithm: darkAlgorithm
    }}
  >
    <HashRouter>
      <App />
    </HashRouter>
  </ConfigProvider>
)
