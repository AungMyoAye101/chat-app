
import GroupList from '@/components/GroupList'
import Navbar from '@/components/Navbar'
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
        <section className='relative '>

            <div className='flex gap-4 h-[calc(100vh-2rem)]'>
                {
                    (!isMobile || !isChatRoute) && <div className='min-w-xs w-full max-w-sm mx-auto bg-white  rounded-xl  shadow-md h-full  px-4  flex flex-col'>
                        <div className='space-y-2 py-4'>

                            <Navbar />
                            <Search />
                        </div>
                        <div className=' flex-1  overflow-hidden  overflow-y-scroll no-scrollbar'>

                            <GroupList />
                            <UserList />
                        </div>

                    </div>
                }


                {
                    (!isMobile || isChatRoute) && <div className='flex-1  rounded-xl  shadow-md overflow-hidden'>
                        <Outlet />
                    </div>
                }

            </div>
        </section >
    )
}

export default Home