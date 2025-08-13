import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import AuthContext from './context/Auth.context.tsx'
import { BrowserRouter } from 'react-router-dom'
import Navbar from './components/Navbar.tsx'
import LayoutProvider from './context/Layout.contex.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>

      <AuthContext>
        <LayoutProvider>

          <div className='max-w-7xl mx-auto rounded-lg overflow-hidden p-1'>
            <Navbar />
            <App />
          </div>
        </LayoutProvider>
      </AuthContext>
    </BrowserRouter>
  </StrictMode>,
)
