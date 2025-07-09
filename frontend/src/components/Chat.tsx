import { useAuth } from '@/context/Auth.context'
import { axiosInstance } from '@/lib/axios.config'
import type { UserType } from '@/lib/types'
import { useEffect, useRef, useState } from 'react'
import { io } from 'socket.io-client'
export const socket = io('http://localhost:5000')

interface ChatPropsType {
    selectedUser: UserType
}


const Chat = ({ selectedUser }: ChatPropsType) => {
    const user = useAuth()
    const [receivedData, setReceivedData] = useState<any[]>([])
    const [message, setMessage] = useState('')
    const [typing, setTyping] = useState(false)
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        socket.emit("setup", user?._id)



    }, [user])


    const getMessage = async () => {
        const res = await axiosInstance.get("/api/messages/" + selectedUser._id)
        setReceivedData(res.data)
    }

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault()
        if (!message.trim()) return

        socket.emit('send-message', {
            senderId: user?._id,
            receiverId: selectedUser._id,
            message
        })
        getMessage()
        setMessage('')
    }

    useEffect(() => {
        if (!selectedUser) return;
        socket.on("received-message", (data) => {
            setReceivedData(pre => ([...pre, data]))
        });
        getMessage()

        const handleTyping = (id: string) => {
            if (selectedUser && id === selectedUser._id) {
                setTyping(true)
            }
        }
        const handleStopTyping = (id: string) => {
            if (selectedUser && id === selectedUser._id) {
                setTyping(false)
            }
        }

        socket.on("isTyping", handleTyping)
        socket.on("stop-typing", handleStopTyping)

        return () => {
            socket.off("isTyping", handleTyping)
            socket.off("stop-typing", handleStopTyping)
            socket.off("received-message")

        };

    }, [selectedUser])


    const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMessage(e.target.value)
        if (!typing) {
            setTyping(true)
            socket.emit("typing", selectedUser._id)
        }
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }
        typingTimeoutRef.current = setTimeout(() => {
            socket.emit("stop-typing", selectedUser._id);
            setTyping(false);
        }, 2000);
    }


    function formatRelativeTime(createdAt: any): React.ReactNode {
        const date = new Date(createdAt)
        const now = new Date()
        const diff = Math.floor((now.getTime() - date.getTime()) / 1000)

        if (diff < 60) return 'just now'
        if (diff < 3600) return `${Math.floor(diff / 60)} min ago`
        if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`
        return date.toLocaleDateString()
    }

    return (
        <div className='w-full'>
            <h1 className='text-xl font-semibold'>{selectedUser?.name || ""}</h1>

            <div className='h-96 overflow-hidden overflow-y-scroll bg-white border p-2 w-full flex flex-col gap-1 '>
                {
                    receivedData.length > 0 && receivedData.map((data, i) => (
                        <div key={i} className={`${data.sender._id === user?._id ? "self-end bg-blue-100 " : "self-start bg-neutral-200"} px-4 py-1.5 rounded-2xl   flex gap-1 items-start`}>

                            <div>
                                <p className='text-sm '>{data.message}</p>
                                {
                                    data.createdAt && (
                                        <span className="text-xs text-gray-500">
                                            {formatRelativeTime(data.createdAt)}
                                        </span>
                                    )}
                            </div>
                        </div>
                    ))
                }
                {
                    typing && <span>typing...</span>
                }

            </div>
            <form onSubmit={handleSend} className='flex border border-neutral-50 rounded'>
                <input
                    type="text"
                    value={message}
                    onChange={(e) => handleTyping(e)}
                    className='bg-neutral-200 w-full px-4 py-2'
                />
                <button
                    type='submit'
                    className='px-4 py-2 bg-blue-200 cursor-pointer'
                >
                    Send
                </button>
            </form>
        </div>
    )
}

export default Chat