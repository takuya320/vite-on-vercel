import { ChakraProvider, extendTheme, type ThemeConfig } from '@chakra-ui/react'
import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import { OrgProvider } from './orgContext'
import './dashboard.css'

const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
}

const theme = extendTheme({
  config,
  fonts: {
    body: "'Plus Jakarta Sans', 'Hiragino Sans', 'Yu Gothic', system-ui, sans-serif",
    heading: "'Plus Jakarta Sans', 'Hiragino Sans', 'Yu Gothic', system-ui, sans-serif",
    mono: "'JetBrains Mono', Menlo, monospace",
  },
  styles: {
    global: {
      body: {
        bg: 'transparent',
      },
    },
  },
})

export default function Dashboard() {
  useEffect(() => {
    document.body.classList.add('dash-active')
    return () => {
      document.body.classList.remove('dash-active')
    }
  }, [])

  return (
    <ChakraProvider theme={theme} resetCSS={false}>
      <OrgProvider>
        <div className="dash-root">
          <Sidebar />
          <Header />
          <main className="dash-main">
            <Outlet />
          </main>
        </div>
      </OrgProvider>
    </ChakraProvider>
  )
}
