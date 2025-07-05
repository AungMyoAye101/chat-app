
import { axiosInstance } from "@/lib/axios.config"
import type { UserType } from "@/lib/types"
import { useEffect, useState } from "react"

interface SelectUserProps {
    setSelectedUser: React.Dispatch<React.SetStateAction<UserType>>
}

const User = ({ setSelectedUser }: SelectUserProps) => {
    const [users, setUsers] = useState<UserType[]>([])
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axiosInstance.get("/api/users")
                setUsers(res.data)
            } catch (error) {
                if (error instanceof Error) console.log(error.message)
            }

        }
        fetchUser()


    }, [])

    return (
        <section className="w-96 p-4">
            <div className='flex flex-col'>
                {
                    users.map(user => (
                        <div className="flex gap-1 p-2 bg-neutral-200 border border-white" key={user._id} onClick={() => setSelectedUser(user)}>
                            <div className="w-6 h-6 rounded-full bg-blue-300"></div>
                            <div>{user.name}</div>
                        </div>
                    ))
                }
            </div>
        </section>
    )
}

export default User