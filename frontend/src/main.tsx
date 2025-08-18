import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import Navbar from './components/Navbar.tsx'
import LayoutProvider from './context/Layout.contex.tsx'
import { Provider } from 'react-redux'
import { store } from './lib/auth/store.ts'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <LayoutProvider>
          <div className='max-w-7xl mx-auto rounded-lg overflow-hidden p-1'>
            <Navbar />
            <App />
          </div>
        </LayoutProvider>
      </BrowserRouter>
    </Provider>
  </StrictMode >,
)
