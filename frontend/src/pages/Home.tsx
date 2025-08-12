
import GroupList from '@/components/GroupList'


import UserList from '@/components/UserList'
import { useAuth } from '@/context/Auth.context'
import { socket } from '@/lib/socket'


import { useEffect, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'




const Home = () => {

    const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 768)

    const path = useLocation()
    const user = useAuth()

    useEffect(() => {
        if (user?._id) {

            socket.emit("setup", user?._id)
        } else {
            socket.emit("disconnect")
        }
    }, [user?._id])

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768)
        window.addEventListener("resize", handleResize)

        return () => {
            window.removeEventListener("resize", handleResize)
        }
    }, [])

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
                    (isMobile && isChatRoute) && <button onClick={() => navigate(-1)}>Back</button>
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