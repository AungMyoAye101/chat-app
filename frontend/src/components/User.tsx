
import { axiosInstance } from "@/lib/axios.config"
import type { UserType } from "@/lib/types"
import { useEffect, useState } from "react"
import { socket } from "./Chat"
import { formatLastSeen } from "@/lib/helper"


interface SelectUserProps {
    setSelectedUser: React.Dispatch<React.SetStateAction<UserType>>
}

const User = ({ setSelectedUser }: SelectUserProps) => {
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
        <section className="w-96 p-4">
            <div className='flex flex-col'>
                {
                    users.map(user => (
                        <div className="flex gap-1 p-2 bg-neutral-200 border border-white" key={user._id} onClick={() => setSelectedUser(user)}>
                            <div className="w-6 h-6 rounded-full bg-blue-300"></div>
                            <div>{user.name}</div>
                            <div className={`w-3 h-3 rounded-full ${onlineUsers.includes(user._id) ? "bg-green-400" : "bg-gray-400"} `}></div>
                            {!onlineUsers.includes(user._id) && <div>Last seen {formatLastSeen(user.lastSeen)}</div>}
                        </div>
                    ))
                }
            </div>
        </section>
    )
}

export default User