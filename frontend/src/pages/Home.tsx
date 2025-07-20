import Chat from '@/components/Chat'
import CurrentUser from '@/components/CurrentUser'
import GroupList from '@/components/GroupList'


import User from '@/components/User'
import { useAuth } from '@/context/Auth.context'
import { socket } from '@/lib/socket'
import type { GroupTypes, UserType } from '@/lib/types'

import { use, useEffect, useState } from 'react'
import { Link, Outlet } from 'react-router-dom'




const Home = () => {


    const user = useAuth()

    useEffect(() => {
        if (!user?._id) return
        socket.emit("setup", user?._id)
    }, [user?._id])

    return (
        <section className='max-w-6xl mx-auto border border-red-400 min-h-screen w-full'>

            <div className='flex w-full'>
                <div className='max-w-xs w-full bg-white'>

                    <GroupList />
                    <User />
                </div>
                <div className='flex-1 h-screen'>
                    <Outlet />
                </div>

                {/* <Chat selectedUser={selectedUser} /> */}
                {/* <GroupChat selected={selectedGroup!} /> */}
            </div>
        </section>
    )
}

export default Home