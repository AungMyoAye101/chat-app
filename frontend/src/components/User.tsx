
import { axiosInstance } from "@/lib/axios.config"
import type { UserType } from "@/lib/types"
import { useEffect, useState } from "react"
import { formatLastSeen } from "@/lib/helper"
import { Link, useNavigate } from "react-router-dom"
import { socket } from "@/lib/socket"




const User = () => {
    const [users, setUsers] = useState<UserType[]>([])
    const [onlineUsers, setOnlineUsers] = useState<string[]>([])

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axiosInstance.get("/api/user")
                setUsers(res.data)
            } catch (error) {
                if (error instanceof Error) console.log(error.message)
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
                    users.map(user => (
                        <Link to={`/chat/user/${user._id}`} className='flex px-4 py-2 cursor-pointer hover:bg-gray-200' key={user._id} >
                            <div className="w-6 h-6 rounded-full bg-blue-300 relative ">
                                <div className={`absolute -left-1 top-0 w-3 h-3 rounded-full ${onlineUsers.includes(user._id) ? "bg-green-400" : "bg-gray-400"} `}></div>
                            </div>
                            <div className="flex justify-between items-center  w-full">

                                <h1 className="font-serif font-medium ">{user.name}</h1>

                                {!onlineUsers.includes(user._id) && <div className="text-sm">{formatLastSeen(user.lastSeen)}</div>}
                            </div>
                        </Link>
                    ))
                }
            </div>
        </section>
    )
}

export default User