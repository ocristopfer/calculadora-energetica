import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App'
import 'bootstrap/dist/css/bootstrap.min.css'
import './index.css'

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    {/* HashRouter: as rotas funcionam no GitHub Pages sem configurar 404 */}
    <HashRouter>
      <App />
    </HashRouter>
  </StrictMode>,
)
