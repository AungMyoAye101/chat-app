import { useAuth } from '@/context/Auth.context'
import { axiosInstance } from '@/lib/axios.config';
import { socket } from '@/lib/socket'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

type MessageType = {
    _id: string,
    senderId: string;
    message: string;
    // add other fields if needed
};

const UserChat = () => {
    const [message, setMessage] = useState('')
    const [receivedData, setReceivedData] = useState<MessageType[]>([])
    const { userId } = useParams()
    const user = useAuth()
    const currUserId = user?._id


    const getMessage = async () => {
        if (userId) {
            const res = await axiosInstance.get("/api/messages/" + userId)
            setReceivedData(res.data)
        }
    }
    useEffect(() => {
        socket.on("received-message", (data) => {
            setReceivedData(pre => ([...pre, data]))
        })
        getMessage()

    }, [])

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault()
        socket.emit("send-message", ({ senderId: user?._id, receiverId: userId, message }))
        setMessage('')
    }



    return (
        <section className='bg-blue-100 h-full flex flex-col '>
            <div className='bg-green-200 '>{userId}</div>
            <div className='flex-1'>
                {
                    receivedData.map((data, i) => (
                        <div key={data._id}>
                            <p>{data.message}</p>
                            <span>{data.senderId}</span>

                        </div>
                    ))
                }
            </div>
            <form onSubmit={handleSendMessage} className='flex '>
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className='flex-1 py-1 px-4 bg-neutral-200'
                />
                <button className='px-4 py-1 bg-white'>Send</button>
            </form>

        </section>
    )
}

export default UserChat