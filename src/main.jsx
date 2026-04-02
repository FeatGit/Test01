import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

try {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <App />
    </StrictMode>
  )
} catch (e) {
  document.getElementById('root').innerHTML =
    `<div style="font-family:Arial;padding:2rem;color:red"><b>Errore di configurazione:</b><br>${e.message}</div>`
}
