import { useAuth } from '@/context/Auth.context'
import { axiosInstance } from '@/lib/axios.config';
import { formatChatTime, formatLastSeen } from '@/lib/helper';
import { socket } from '@/lib/socket'
import type { UserType } from '@/lib/types';
import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'






type MessageType = {
    _id: string,
    sender: { _id: string, name: string, };
    receiver: { _id: string, name: string, };
    message: string,
    createdAt: string,
    seenBy: string[]
    // add other fields if needed
};

const UserChat = () => {
    const [selectedUser, setSelectedUser] = useState<UserType>()
    const [message, setMessage] = useState('')
    const [receivedData, setReceivedData] = useState<MessageType[]>([])
    const [isTyping, setIsTyping] = useState(false)
    const typingTimeOutRef = useRef<NodeJS.Timeout | null>(null)
    const { userId } = useParams()
    const bottomRef = useRef<HTMLDivElement>(null)
    const user = useAuth()
    const currUserId = user?._id


    const getMessage = async () => {
        if (userId) {
            const res = await axiosInstance.get("/api/messages/" + userId)
            setReceivedData(res.data)
        }
    }
    const getUser = async () => {
        if (userId) {
            const res = await axiosInstance.get("/api/user/" + userId)
            setSelectedUser(res.data)
        }
    }
    useEffect(() => {
        getUser()
    }, [userId])


    //seen or unseen message 

    useEffect(() => {
        if (!user?._id || !receivedData) return
        const unSeenMessage = receivedData.filter(m => (
            !m.seenBy.includes(currUserId!)
        ))
        if (unSeenMessage.length === 0) return
        unSeenMessage.forEach(m => (socket.emit("seen-message", ({ messageId: m._id, userId: currUserId, chatId: userId }))))

    }, [receivedData])




    useEffect(() => {
        if (!userId) return;
        socket.on("received-message", (data) => {
            setReceivedData(pre => [...pre, data])
        })

        socket.on("isTyping", () => {
            setIsTyping(true)

        })
        socket.on("stopped-typing", () => {
            setIsTyping(false)
        })
        socket.on("seen", (data) => {
            if (data.seenBy.includes(userId)) {

                getMessage()
            }
        })

        getMessage()
        return () => {
            socket.off("received-message")
            socket.off("isTyping")
            socket.off("stop-typing")
            socket.off("seen")
        }
    }, [userId])



    //Send message to server
    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim() || !currUserId || !selectedUser?._id) return;
        //for sending message
        socket.emit("send-message", { senderId: currUserId, receiverId: selectedUser._id, message });
        setMessage("");
        setIsTyping(false)
    };

    //For typing indicator 
    const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!currUserId) return
        setMessage(e.target.value)
        if (!isTyping) {
            socket.emit("typing", { senderId: user._id, receiverId: userId })
        }
        if (typingTimeOutRef.current) {
            clearTimeout(typingTimeOutRef.current)
        }
        typingTimeOutRef.current = setTimeout(() => {
            socket.emit("stop-typing", { senderId: user._id, receiverId: userId })
        }, 3000)
    }

    //scroll into bottom 
    useEffect(() => {
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: "smooth" })
        }

    }, [receivedData, isTyping])




    return (
        <section className='bg-blue-100 h-full flex flex-col '>
            <div className='bg-white flex gap-2 px-4 py-1 items-center'>
                <div className='w-10 h-10 rounded-full bg-blue-200'></div>
                <div className='flex flex-col '><h2>{selectedUser?.name}</h2>
                    <p className='text-xs'>{formatLastSeen(selectedUser?.lastSeen!)}</p></div>
            </div>
            <div className='flex-1 flex flex-col gap-2 p-2 overflow-hidden overflow-y-scroll'>
                {
                    receivedData.map((data) => (
                        <div key={data._id}>

                            <div className={` px-4 py-1.5 rounded-lg w-fit  ${data.sender._id === currUserId ? "self-end bg-neutral-100" : "self-start bg-blue-200"}`}>
                                <p className='text-sm'>{data.message}</p>
                                <span className='text-xs'>{formatChatTime(data.createdAt)}</span>
                            </div>
                            {
                                data.seenBy.includes(userId!) && <span>✅</span>
                            }
                        </div>
                    ))
                }



                {
                    isTyping && <div className='bg-neutral-100 px-4 py-1 rounded-lg w-fit italic text-sm' >Typing...</div>
                }

                <div ref={bottomRef} />

            </div>
            <form onSubmit={handleSendMessage} className='flex '>
                <input
                    type="text"
                    value={message}
                    onChange={(e) => handleTyping(e)}
                    className='flex-1 py-1 px-4 bg-white'
                />
                <button className='px-4 py-1 bg-white'>Send</button>
            </form>

        </section>
    )
}

export default UserChat