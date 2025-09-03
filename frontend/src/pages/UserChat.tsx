
import ImageBox from '@/components/ImageBox';
import TypingIndicator from '@/components/UI/TypingIndicator';
import { useLayout } from '@/context/Layout.contex';
import { axiosInstance } from '@/lib/axios.config';
import { formatChatTime, formatLastSeen } from '@/lib/helper';
import { useAuth } from '@/lib/hooks/useAuth';
import { socket } from '@/lib/socket';
import type { MessageType, UserType } from '@/lib/types';
import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'


const UserChat = () => {
    const [selectedUser, setSelectedUser] = useState<UserType>({
        _id: '',
        name: '',
        email: '',
        avatar: '',
        lastSeen: ''
    })
    const [message, setMessage] = useState('')
    const [receivedData, setReceivedData] = useState<MessageType[]>([])
    const [onlineUsers, setOnlineUsers] = useState<string[]>([])
    const [isTyping, setIsTyping] = useState(false) //for typing indicatior
    const { userId } = useParams()
    const { user } = useAuth()
    const { isMobile } = useLayout()

    //use ref hook for performace 
    const containerRef = useRef<HTMLDivElement>(null) //for autoscrolling to bottom 
    const timeoutRef = useRef<NodeJS.Timeout | null>(null) //for typing timeout ref
    const fetchRef = useRef(false)
    const navigate = useNavigate()
    const currUserId = user?._id


    const getUser = useCallback(async () => {
        if (userId) {
            const res = await axiosInstance.get("/api/user/" + userId)
            setSelectedUser(res.data)
        }
    }
        , [])


    const getMessage = async () => {
        const res = await axiosInstance.get(`/api/messages/${userId}`)
        setReceivedData(res.data)
    }



    useEffect(() => {
        if (fetchRef.current) return
        fetchRef.current = true
        getUser()
        getMessage()
    }, [userId])

    // Scroll to bottom 
    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollIntoView({ behavior: "smooth" })
        }
    }, [receivedData, isTyping])

    //Check seen or unseen message

    useEffect(() => {
        if (!selectedUser._id) return;

        const unseenMessage = receivedData.filter(m => !m.seenBy.includes(user?._id!))
        if (unseenMessage.length === 0) return;
        unseenMessage.forEach(m => socket.emit("seen-message", ({ messageId: m._id, userId: currUserId, chatId: selectedUser._id })))

    }, [receivedData])

    //socket 

    useEffect(() => {
        socket.on("online-users", (data) => {
            setOnlineUsers(data)
        })

        socket.on("received-message", (data) => {

            if (data.sender._id === currUserId && data.receiver._id === userId) {
                setReceivedData(pre => [...pre, data])
            }

        })

        // For typing indicator
        socket.on("isTyping", (data) => {

            if (data.receiverId === currUserId) {
                setIsTyping(true)
            }
        })
        socket.on("stopped-typing", () => {
            setIsTyping(false)
        })

        return () => {
            socket.off("online-users")
            socket.off("received-message")
            socket.off("isTyping")
            socket.off("stopped-typing")
        }
    }, [])


    // message handler

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!currUserId) return;
        setMessage(e.target.value)
        if (!isTyping) {
            socket.emit('typing', ({ senderId: currUserId, receiverId: selectedUser._id }))
        }
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
        }
        timeoutRef.current = setTimeout(() => {
            socket.emit('stop-typing', ({ senderId: currUserId, receiverId: selectedUser._id }))
        }, 2000)
    }
    //Send message to server
    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim() || !currUserId || !selectedUser._id) return;
        //for sending message
        socket.emit("send-message", { senderId: currUserId, receiverId: selectedUser._id, message, });
        setMessage("");
        setIsTyping(false)
    };


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
                        {
                            onlineUsers.includes(userId!) ? <p className='text-green-400 text-sm font-medium'>Online</p> : <p className='text-xs'>{formatLastSeen(selectedUser?.lastSeen!)}</p>
                        }

                    </div>
                </Link>
            </div>

            <div className="h-[75%] overflow-hidden  overflow-y-scroll no-scrollbar bg-green-100 p-4 flex flex-col gap-4">
                {
                    receivedData.map(m =>
                        <div key={m._id} className={`${currUserId === m.sender._id ? "self-end" : "self-start"}  max-w-[70%] w-fit`}  >

                            <div className="bg-white  px-4 py-2 rounded-lg mb-1">
                                <p className="font-serif">{m.message}</p>
                                <span className="text-xs text-neutral-500">{formatChatTime(m.createdAt)}</span>
                            </div>
                            {(m.seenBy.includes(selectedUser._id) && selectedUser._id !== m.sender._id) &&
                                <ImageBox avatar={selectedUser.avatar!} name={selectedUser.name} size="sm" />
                            }

                        </div>)
                }

                {
                    isTyping && <TypingIndicator />
                }
                {/* For scrol in to view  */}

                <div ref={containerRef} />
            </div>


            <form onSubmit={handleSendMessage} className=' bg-white h-[10%] w-full border-t border-neutral-200 p-1'>
                <div className="flex items-center h-full overflow-hidden">

                    <input
                        type="text"
                        value={message}

                        onChange={(e) => handleChange(e)}
                        placeholder="Send a message."
                        className='flex-1  px-4 py-1 h-full'
                    />
                    <button className=' cursor-pointer  h-full  px-4 py-1.5'><img src="/icons/send-icon.svg" alt="send icon" className="w-6 " />

                    </button>
                </div>
            </form>
        </section>
    )
}

export default UserChat