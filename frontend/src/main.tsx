import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import AuthContext from './context/Auth.context.tsx'
import { BrowserRouter } from 'react-router-dom'
import Navbar from './components/Navbar.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>

      <AuthContext>
        <div className='max-w-7xl mx-auto'>
          <Navbar />
          <App />
        </div>
      </AuthContext>
    </BrowserRouter>
  </StrictMode>,
)
