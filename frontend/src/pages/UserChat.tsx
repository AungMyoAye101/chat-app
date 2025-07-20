import { useAuth } from '@/context/Auth.context'
import { axiosInstance } from '@/lib/axios.config';
import { formatLastSeen } from '@/lib/helper';
import { socket } from '@/lib/socket'
import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'






type MessageType = {
    _id: string,
    sender: { _id: string, name: string, };
    receiver: { _id: string, name: string, };
    message: string;
    createdAt: string
    // add other fields if needed
};

const UserChat = () => {
    const [message, setMessage] = useState('')
    const [receivedData, setReceivedData] = useState<MessageType[]>([])
    const [isTyping, setIsTyping] = useState(false)
    const typingTimeOutRef = useRef<NodeJS.Timeout | null>(null)
    const { userId } = useParams()
    const user = useAuth()



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

        socket.on("isTyping", (senderId) => {
            console.log(senderId, "is typing")
            if (senderId === userId) {
                setIsTyping(true)
            }

        })
        socket.on("stopped-typing", (senderId) => {
            if (senderId === userId) {
                setIsTyping(false)
            }

        })
        getMessage()

    }, [])


    //Send message to server
    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault()
        socket.emit("send-message", ({ senderId: user?._id, receiverId: userId, message }))
        setMessage('')
    }

    //For typing indicator 
    const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!user?._id) return
        setMessage(e.target.value)
        if (!isTyping) {
            setIsTyping(true)
            socket.emit("typing", { senderId: user._id, receiverId: userId })
        }
        if (typingTimeOutRef.current) {
            clearTimeout(typingTimeOutRef.current)
        }
        typingTimeOutRef.current = setTimeout(() => {
            setIsTyping(false)
            socket.emit("stop-typing", { senderId: user._id, receiverId: userId })
        }, 3000)
    }
    console.log(isTyping)
    return (
        <section className='bg-blue-100 h-full flex flex-col '>
            <div className='bg-green-200 '>{userId}</div>
            <div className='flex-1 flex flex-col gap-2 p-2 overflow-hidden overflow-y-scroll'>
                {
                    receivedData.map((data, i) => (
                        <div key={i} className={`bg-neutral-100 px-4 py-1.5 rounded-lg w-fit  ${data.sender._id === user?._id ? "self-start" : "self-end"}`}>
                            <p className='text-sm'>{data.message}</p>
                            <span className='text-xs'>{formatLastSeen(data.createdAt)}</span>

                        </div>
                    ))

                }
                {
                    isTyping && <div className='bg-neutral-100 px-4 py-1 rounded-lg w-fit italic text-sm' >Typing...</div>
                }

            </div>
            <form onSubmit={handleSendMessage} className='flex '>
                <input
                    type="text"
                    value={message}
                    onChange={(e) => handleTyping(e)}
                    className='flex-1 py-1 px-4 bg-neutral-200'
                />
                <button className='px-4 py-1 bg-white'>Send</button>
            </form>

        </section>
    )
}

export default UserChat