import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Clear localStorage on every app start in development
if (import.meta.env.DEV) {
  localStorage.removeItem('nxq_intro_seen')
  console.log('🧹 Cleared intro flag for development')
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
