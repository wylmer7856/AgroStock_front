import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Verificar que el root existe
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('No se encontró el elemento root');
}

// Renderizar la app
createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// Log para debug
console.log('✅ AgroStock Frontend iniciado correctamente');
console.log('🌐 Backend esperado en: http://localhost:8000');
