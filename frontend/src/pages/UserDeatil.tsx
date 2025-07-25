import { axiosInstance } from '@/lib/axios.config'
import type { UserType } from '@/lib/types'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

const UserDeatil = () => {
    const [user, setUser] = useState<UserType>()
    const { userId } = useParams()
    const fetchUser = async () => {
        try {
            const res = await axiosInstance.get(`/api/user/${userId}`)
            setUser(res.data)

        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        fetchUser()
    }, [userId])


    return (
        <section>
            <div className='flex items-center gap-2'>
                <div className='w-16 h-16 rounded-full bg-neutral-200'></div>
                <div>
                    <h1>{user?.name}</h1>
                    <p>{user?.email}</p>
                </div>
            </div>
        </section>
    )
}

export default UserDeatil