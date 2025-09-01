
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


        <div className='flex  h-[calc(100dvh-4rem)] mt-12  '>
            {
                (!isMobile || !isChatRoute) && <div className='w-full md:max-w-sm bg-white/90   shadow-md h-full   py-4 flex flex-col border-r border-neutral-300'>
                    <div className='space-y-2 py-4'>
                        <Search />
                    </div>
                    <div className=' flex-1  overflow-hidden  overflow-y-scroll no-scrollbar'>

                        <GroupList />
                        <UserList />

                    </div>

                </div>
            }


            {
                (!isMobile || isChatRoute) && <div className='flex-1  overflow-hidden'>
                    <Outlet />
                </div>
            }

        </div>

    )
}

export default Home