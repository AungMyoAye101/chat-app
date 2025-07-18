import Chat from '@/components/Chat'
import CurrentUser from '@/components/CurrentUser'
import Group from '@/components/Group'
import GroupChat from '@/components/GroupChat'
import User from '@/components/User'
import type { GroupTypes, UserType } from '@/lib/types'

import { useState } from 'react'
import { Link } from 'react-router-dom'




const Home = () => {


    // const [selectedUser, setSelectedUser] = useState<UserType>({
    //     _id: '',
    //     name: '',
    //     email: '',
    //     lastSeen: ''
    // })

    const [selectedGroup, setSelectedGroup] = useState<GroupTypes>()

    return (
        <section className='bg-white p-4 h-screen w-full'>
            <CurrentUser />

            <div className='flex w-full'>
                <div>

                    <Group setSelectedGroup={setSelectedGroup} />
                    {/* <User setSelectedUser={setSelectedUser} /> */}
                </div>
                {/* <Chat selectedUser={selectedUser} /> */}
                <GroupChat selected={selectedGroup!} />
            </div>
        </section>
    )
}

export default Home