
import { Navigate, replace, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import { useAuth } from './context/Auth.context';
import Group from './pages/Group';
import NotFound from './pages/NotFound';
import UpdateGroup from './pages/UpdateGroup';
import AddMembers from './pages/AddMembers';

// const ProcetiveRoute = ({ children }: { children: React.ReactNode }) => {
//   const user = useAuth()
//   if (!user) {

//     return <Navigate to={"/login"} />
//   }
// }

const App = () => {

  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />
      <Route path='/create-group' element={<Group />} />
      <Route path='/update-group/:groupId' element={<UpdateGroup />} />
      <Route path='/update-group/:groupId/add-members' element={<AddMembers />} />
      <Route path='*' element={<NotFound />} />
    </Routes>
  )
}

export default App