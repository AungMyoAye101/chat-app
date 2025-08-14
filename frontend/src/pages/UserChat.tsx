import ChatBox from '@/components/ChatBox';
import ImageBox from '@/components/ImageBox';
import { useAuth } from '@/context/Auth.context'
import { useLayout } from '@/context/Layout.contex';
import { axiosInstance } from '@/lib/axios.config';
import { formatLastSeen } from '@/lib/helper';
import type { MessageType, UserType } from '@/lib/types';
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'


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
    const { isMobile } = useLayout()

    const navigate = useNavigate()
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
                {
                    isMobile && <button onClick={() => navigate(-1)}> <img src="/icons/back.svg" alt=" back icon" className="w-8 cursor-pointer" /> </button>
                }
                <Link to={`/user/${userId}`} className="flex items-center gap-2">

                    <ImageBox avatar={selectedUser?.avatar!} name={selectedUser?.name!} size="lg" />
                    <div className='flex flex-col '>
                        <h2>{selectedUser?.name}</h2>
                        <p className='text-xs'>{formatLastSeen(selectedUser?.lastSeen!)}</p>
                    </div>
                </Link>
            </div>

            <ChatBox selectedChatId={selectedUser._id} currUserId={currUserId!} receivedData={receivedData} setReceivedData={setReceivedData} />
        </section>
    )
}

export default UserChat