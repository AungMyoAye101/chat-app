
import GroupList from '@/components/GroupList'
import Search from '@/components/Search'


import UserList from '@/components/UserList'

import { useLayout } from '@/context/Layout.contex'
import type { RootState } from '@/lib/auth/store'
import { socket } from '@/lib/socket'


import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Outlet, useLocation, } from 'react-router-dom'




const Home = () => {


    const { user } = useSelector((state: RootState) => state.auth)

    const path = useLocation()

    const { isMobile } = useLayout()
    useEffect(() => {
        if (user?._id) {

            socket.emit("setup", user?._id)
        }
    }, [user?._id])



    const isChatRoute = path.pathname.startsWith('/chat')




    return (
        <section className='relative bg-neutral-100'>

            <div className='flex h-[calc(100vh-80px)]'>
                {
                    (!isMobile || !isChatRoute) && <div className='min-w-xs w-full max-w-sm mx-auto bg-white shadow-lg h-full overflow-hidden  overflow-y-scroll py-4 px-4'>
                        <Search />
                        <GroupList />
                        <UserList />

                    </div>
                }


                {
                    (!isMobile || isChatRoute) && <div className='flex-1 p-4 rounded-lg overflow-hidden'>
                        <Outlet />
                    </div>
                }

            </div>
        </section>
    )
}

export default Home