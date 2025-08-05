
import GroupList from '@/components/GroupList'


import UserList from '@/components/UserList'
import { useAuth } from '@/context/Auth.context'
import { socket } from '@/lib/socket'


import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'




const Home = () => {


    const user = useAuth()

    useEffect(() => {
        if (user?._id) {

            socket.emit("setup", user?._id)
        } else {
            socket.emit("dissconnect")
        }
    }, [user?._id])

    return (
        <section className='relative '>

            <div className='flex '>
                <div className='w-xs bg-white shadow-lg h-screen overflow-hidden  overflow-y-scroll py-4'>

                    <GroupList />
                    <UserList />
                    {
                        [1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => <div key={n} className='w-10 h-10 bg-orange-600'>{n}</div>)
                    }
                </div>
                <div className='flex-1  '>
                    <Outlet />
                </div>
            </div>
        </section>
    )
}

export default Home