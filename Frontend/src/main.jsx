import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthProvider.jsx'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { NotificationsProvider } from './context/NotificationsProvider.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <NotificationsProvider>
          <Routes>
            <Route path="/*" element={<App />} />
          </Routes>
        </NotificationsProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
