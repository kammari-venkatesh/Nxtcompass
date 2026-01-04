import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/theme.css'
import './styles/glass.css'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './features/auth/context/AuthContext'
import { UserContextProvider } from './hooks/useUserContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserContextProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </UserContextProvider>
  </StrictMode>,
)
