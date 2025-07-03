import React from 'react'
import { io } from 'socket.io-client'
const socket = io('http://localhost:3000')

const App = () => {
  socket.on("connect", () => {
    console.log(socket.id);
  });
  return (
    <div className='bg-amber-600 h-screen '>App</div>
  )
}

export default App