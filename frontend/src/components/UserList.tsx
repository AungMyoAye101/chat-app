
import { axiosInstance } from "@/lib/axios.config"
import type { UserType } from "@/lib/types"
import { useEffect, useState } from "react"
import { formatLastSeen } from "@/lib/helper"
import { Link } from "react-router-dom"
import { socket } from "@/lib/socket"
import ImageBox from "./ImageBox"
import UserLoadingUi from "./UI/UserLoadingUi"




const UserList = () => {
    const [users, setUsers] = useState<UserType[]>([])
    const [onlineUsers, setOnlineUsers] = useState<string[]>([])

    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        const fetchUser = async () => {
            setIsLoading(true)
            try {
                const res = await axiosInstance.get("/api/user")
                setUsers(res.data)
            } catch (error) {
                if (error instanceof Error) console.log(error.message)
            } finally {
                setIsLoading(false)
            }

        }
        fetchUser()
        const handleOnlineUsers = (userId: string[]) => {
            setOnlineUsers(userId)
        }
        socket.on("online-users", handleOnlineUsers)

        return () => {
            socket.off("online-users", handleOnlineUsers)
        }
    }, [])




    return (
        <section className="">
            <div className='flex flex-col'>
                {
                    isLoading ? <UserLoadingUi /> : users.map(user => (
                        <Link to={`/chat/user/${user._id}`} className='flex gap-2 px-4 py-2 cursor-pointer hover:bg-gray-200' key={user._id} >

                            <div className="relative ">

                                <ImageBox avatar={user.avatar!} name={user.name} size="md" />
                                <div className={`absolute left-0 top-1 w-3 h-3 rounded-full ${onlineUsers.includes(user._id) ? "bg-green-400" : "bg-gray-400"} `}></div>
                            </div>
                            <div className="flex-1 flex justify-between items-center  ">
                                <div>
                                    <h1 className="font-serif font-medium ">{user.name}</h1>
                                    <p className="text-sm ">{user.lastMessage}</p>
                                </div>
                                <div className="flex flex-col ">

                                    {!onlineUsers.includes(user._id) && <div className="text-sm">{formatLastSeen(user.lastSeen)}</div>}
                                    {
                                        user?.unreadMessage! > 0 && <p className="px-2 py-1 bg-neutral-300 rounded-xl w-fit self-end text-sm text-neutral-600">{user.unreadMessage}</p>
                                    }

                                </div>
                            </div>

                        </Link>
                    ))
                }
            </div>
        </section>
    )
}

export default UserList