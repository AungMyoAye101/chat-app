import Chat from '@/components/Chat'
import CurrentUser from '@/components/CurrentUser'
import GroupList from '@/components/GroupList'


import User from '@/components/User'
import type { GroupTypes, UserType } from '@/lib/types'

import { useState } from 'react'
import { Link, Outlet } from 'react-router-dom'




const Home = () => {


    const [selectedUser, setSelectedUser] = useState<UserType>({
        _id: '',
        name: '',
        email: '',
        lastSeen: ''
    })

    const [selectedGroup, setSelectedGroup] = useState<GroupTypes>()

    return (
        <section className='max-w-6xl mx-auto border border-red-400  h-screen w-full'>
            <CurrentUser />

            <div className='flex w-full'>
                <div className='max-w-xs w-full bg-white'>

                    <GroupList />
                    <User />
                </div>
                <div className='flex-1 h-[90vh]'>
                    <Outlet />
                </div>

                {/* <Chat selectedUser={selectedUser} /> */}
                {/* <GroupChat selected={selectedGroup!} /> */}
            </div>
        </section>
    )
}

export default Home