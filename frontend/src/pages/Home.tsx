import Chat from '@/components/Chat'
import User from '@/components/User'
import type { UserType } from '@/lib/types'

import { useState } from 'react'




const Home = () => {


    const [selectedUser, setSelectedUser] = useState<UserType>({
        _id: "",
        name: '',
        email: ''
    })



    console.log(selectedUser)


    return (
        <section className='bg-white p-4 h-screen w-full'>
            <div className='flex w-full'>
                <User setSelectedUser={setSelectedUser} />
                <Chat selectedUser={selectedUser} />
            </div>
        </section>
    )
}

export default Home