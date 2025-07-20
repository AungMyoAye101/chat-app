import { useAuth } from '@/context/Auth.context'
import { socket } from '@/lib/socket'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

type MessageType = {
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




    useEffect(() => {
        socket.on("received-message", (data) => {
            setReceivedData(pre => ([...pre, data]))
        })

    }, [])


    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault()
        console.log(currUserId, userId)
        socket.emit("send-message", ({ senderId: user?._id, receiverId: userId, message }))
        setMessage('')
    }



    return (
        <section className='bg-blue-100 h-full flex flex-col '>
            <div className='bg-green-200 '>{userId}</div>
            <div className='flex-1'>
                {
                    receivedData.map((data, i) => (
                        <div key={i}>{data.message}</div>
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