import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import './index.css'
import App from './App'
import { AppStoreProvider } from './store/AppStore'
import ErrorBoundary from './components/ErrorBoundary'

// Chrome/Firefox trên iPhone không hỗ trợ service worker -> bỏ qua êm
try {
  if ('serviceWorker' in navigator) registerSW({ immediate: true })
} catch {
  /* ignore */
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <AppStoreProvider>
        <App />
      </AppStoreProvider>
    </ErrorBoundary>
  </StrictMode>,
)
