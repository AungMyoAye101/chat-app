
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
import UpdateUser from './pages/UpdateUser';
import { useDispatch, } from 'react-redux';
import type { AppDispatch, } from './lib/auth/store';
import { useEffect } from 'react';
import { fetchUser } from './lib/auth/authSlice';
import { useAuth } from './lib/hooks/useAuth';



const ProtectedRoute = () => {
  const { user, isLoading } = useAuth()


  if (isLoading) {
    return <div className=''>Loading....</div>
  }

  if (user?._id) {
    return <Outlet />;
  }

  // if logged in, render the page
  return <Navigate to="/login" replace />;
};


const App = () => {
  const dispatch: AppDispatch = useDispatch()
  const { user, isLoading } = useAuth()
  useEffect(() => {
    if (!user?._id) {

      dispatch(fetchUser())
    }
  }, [])

  return (
    <Routes>

      <Route element={<ProtectedRoute />}>

        <Route path='/' element={<Home />} >
          <Route index element={<DefaultChat />} />
          <Route path='/chat/user/:userId' element={<UserChat />} />
          <Route path='/chat/group/:groupId' element={<GroupChat />} />
        </Route>
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