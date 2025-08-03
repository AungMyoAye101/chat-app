
import GroupList from '@/components/GroupList'


import User from '@/components/User'
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
        <section className='max-w-7xl mx-auto border border-red-400 min-h-screen w-full'>

            <div className='flex w-full'>
                <div className='w-xs bg-white border-r '>

                    <GroupList />
                    <User />
                </div>
                <div className='flex-1 h-screen bg-purple-100'>
                    <Outlet />
                </div>
            </div>
        </section>
    )
}

export default Home