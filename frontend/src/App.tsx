
import { Navigate, replace, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import { useAuth } from './context/Auth.context';

const ProcetiveRoute = ({ children }: { children: React.ReactNode }) => {
  const user = useAuth()
  if (!user) {

    return <Navigate to={"/login"} />
  }
}

const App = () => {

  return (
    <Routes>
      <Route path='/' element={<ProcetiveRoute><Home /></ProcetiveRoute>} />
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />
    </Routes>
  )
}

export default App