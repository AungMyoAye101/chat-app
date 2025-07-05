import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import AuthContext from './context/Auth.context.tsx'
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>

      <AuthContext>
        <div className='max-w-6xl mx-auto p-12'>

          <App />
        </div>
      </AuthContext>
    </BrowserRouter>
  </StrictMode>,
)
