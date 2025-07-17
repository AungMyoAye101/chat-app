import Chat from '@/components/Chat'
import CurrentUser from '@/components/CurrentUser'
import Group from '@/components/Group'
import User from '@/components/User'
import type { UserType } from '@/lib/types'

import { useState } from 'react'
import { Link } from 'react-router-dom'




const Home = () => {


    const [selectedUser, setSelectedUser] = useState<UserType>({
        _id: '',
        name: '',
        email: '',
        lastSeen: ''
    })



    return (
        <section className='bg-white p-4 h-screen w-full'>
            <CurrentUser />
            <div className='flex gap-4 '>
                <Link to={'/register'}>register</Link>
                <Link to={'/login'}>Login</Link>
                <Link to={"/create-group"}>Group</Link>
            </div>
            <div className='flex w-full'>
                <div>

                    <Group />
                    <User setSelectedUser={setSelectedUser} />
                </div>
                <Chat selectedUser={selectedUser} />
            </div>
        </section>
    )
}

export default Home