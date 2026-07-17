import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { useAuthStore } from '@/entities/session/model/store'
import App from './App'
import './index.css'

// Hydrate auth state on app start
useAuthStore.getState().hydrate()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
