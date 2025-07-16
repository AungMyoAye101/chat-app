
import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';

import Group from './pages/Group';
import NotFound from './pages/NotFound';
import UpdateGroup from './pages/UpdateGroup';
import AddMembers from './pages/AddMembers';
import { useAuth } from './context/Auth.context';
import GroupDeatil from './pages/GroupDeatil';

const ProctedRoute = () => {
  const user = useAuth()
  console.log(user)
  return user?._id ? <Outlet /> : <Navigate to="/login" replace />

}

const App = () => {

  return (
    <Routes>

      <Route index element={<Home />} />
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />
      <Route path='/create-group' element={<Group />} />
      <Route path='/group/:groupId' element={<GroupDeatil />} />
      <Route path='/update-group/:groupId' element={<UpdateGroup />} />
      <Route path='/update-group/:groupId/add-members' element={<AddMembers />} />
      <Route path='*' element={<NotFound />} />
    </Routes>
  )
}

export default App