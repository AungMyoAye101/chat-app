import ChatBox from '@/components/ChatBox';
import ImageBox from '@/components/ImageBox';
import { useAuth } from '@/context/Auth.context'
import { axiosInstance } from '@/lib/axios.config';
import { formatLastSeen } from '@/lib/helper';
import type { MessageType, UserType } from '@/lib/types';
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

    const [receivedData, setReceivedData] = useState<MessageType[]>([])
    const { userId } = useParams()
    const user = useAuth()
    const currUserId = user?._id


    const getUser = async () => {
        if (userId) {
            const res = await axiosInstance.get("/api/user/" + userId)
            setSelectedUser(res.data)
        }
    }



    const getMessage = async () => {
        if (selectedUser._id) {
            const res = await axiosInstance.get("/api/messages/" + userId)
            setReceivedData(res.data)
        }
    }

    // useEffect(() => {
    //     getMessage()
    // }, [selectedUser._id])

    useEffect(() => {
        getUser()
        getMessage()
    }, [userId])






    return (
        <section className='flex flex-col  rounded-lg shadow-md overflow-hidden  h-full border border-neutral-200'>
            <div className='bg-white flex gap-2 px-4 py-1 items-center h-[15%] border-b border-neutral-200'>
                <ImageBox avatar={selectedUser?.avatar!} name={selectedUser?.name!} size="lg" />
                <div className='flex flex-col '><h2>{selectedUser?.name}</h2>
                    <p className='text-xs'>{formatLastSeen(selectedUser?.lastSeen!)}</p></div>
            </div>
            <ChatBox selectedChatId={selectedUser._id} currUserId={currUserId!} receivedData={receivedData} setReceivedData={setReceivedData} />
        </section>
    )
}

export default UserChat