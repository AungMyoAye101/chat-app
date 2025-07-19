
import { Route, Routes } from 'react-router-dom';
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




const App = () => {

  return (
    <Routes>
      <Route path='/' element={<Home />} >
        <Route path='/' element={<DefaultChat />} />
        <Route path='/chat/user/:userId' element={<UserChat />} />
        <Route path='/chat/group/:groupId' element={<GroupChat />} />
      </Route>
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />
      <Route path='/user/:userId' element={<UserDeatil />} />
      <Route path='/create-group' element={<Group />} />
      <Route path='/group/:groupId' element={<GroupDeatil />} />
      <Route path='/group/update/:groupId' element={<UpdateGroup />} />
      <Route path='/group/update/:groupId/add-members' element={<AddMembers />} />
      <Route path='*' element={<NotFound />} />
    </Routes>
  )
}

export default App