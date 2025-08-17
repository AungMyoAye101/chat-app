
import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Group from './pages/Group';
import NotFound from './pages/NotFound';
import UpdateGroup from './pages/UpdateGroup';
import AddMembers from './pages/AddMembers';
import GroupDeatil from './pages/GroupDeatil';
import UserDeatil from './pages/UserDeatil';
import UserChat from './pages/UserChat';
import GroupChat from './pages/GroupChat';

import DefaultChat from './pages/DefaultChat';
import { useAuth } from './context/Auth.context';
import UpdateUser from './pages/UpdateUser';
import ImageUpload from './components/ImageUpload';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from './lib/auth/store';
import { useEffect } from 'react';
import { fetchUser } from './lib/auth/authSlice';
interface ProtectedType {
  userId: string,

}

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user } = useSelector((state: RootState) => state.auth);
  console.log(user)

  if (!user) {
    // if not logged in, redirect to login
    return <Navigate to="/login" replace />;
  }

  // if logged in, render the page
  return <>{children}</>;
};


const App = () => {
  const dispatch: AppDispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchUser())
  }, [])

  return (
    <Routes>



      <Route path='/' element={<ProtectedRoute><Home /> </ProtectedRoute>} >
        <Route index element={<DefaultChat />} />
        <Route path='/chat/user/:userId' element={<UserChat />} />
        <Route path='/chat/group/:groupId' element={<GroupChat />} />

        \
      </Route>

      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />
      <Route path='/user/:userId' element={<UserDeatil />} />
      <Route path='/user/update/:userId' element={<UpdateUser />} />
      <Route path='/create-group' element={<Group />} />
      <Route path='/group/:groupId' element={<GroupDeatil />} />
      <Route path='/group/update/:groupId' element={<UpdateGroup />} />
      <Route path='/group/update/:groupId/add-members' element={<AddMembers />} />
      <Route path='*' element={<NotFound />} />
    </Routes>
  )
}

export default App