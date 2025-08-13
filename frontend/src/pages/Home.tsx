
import GroupList from '@/components/GroupList'


import UserList from '@/components/UserList'
import { useAuth } from '@/context/Auth.context'
import { useLayout } from '@/context/Layout.contex'
import { socket } from '@/lib/socket'


import { useEffect, useState } from 'react'
import { Outlet, useLocation, useNavigate, useSearchParams } from 'react-router-dom'




const Home = () => {




    const path = useLocation()
    const user = useAuth()
    const { isMobile } = useLayout()
    useEffect(() => {
        if (user?._id) {

            socket.emit("setup", user?._id)
        } else {
            socket.emit("disconnect")
        }
    }, [user?._id])



    const isChatRoute = path.pathname.startsWith('/chat')

    const navigate = useNavigate()


    return (
        <section className='relative bg-neutral-100'>

            <div className='flex h-[calc(100vh-80px)]'>
                {
                    (!isMobile || !isChatRoute) && <div className='min-w-xs w-full max-w-sm mx-auto bg-white shadow-lg h-full overflow-hidden  overflow-y-scroll py-4'>

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