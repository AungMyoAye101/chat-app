import ChatBox from '@/components/ChatBox';
import { useAuth } from '@/context/Auth.context'
import { axiosInstance } from '@/lib/axios.config';
import type { UserType } from '@/lib/types';
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'


const UserChat = () => {
    const [selectedUser, setSelectedUser] = useState<UserType>({
        _id: '',
        name: '',
        email: '',
        avatar: '',
        lastSeen: ''
    })


    const { userId } = useParams()
    const user = useAuth()
    const currUserId = user?._id


    const getUser = async () => {
        if (userId) {
            const res = await axiosInstance.get("/api/user/" + userId)
            setSelectedUser(res.data)
        }
    }
    useEffect(() => {
        getUser()
    }, [userId])






    return (

        <ChatBox selectedUser={selectedUser} currUserId={currUserId!} />

    )
}

export default UserChat