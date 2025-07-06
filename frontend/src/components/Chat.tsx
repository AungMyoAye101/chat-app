import { useAuth } from '@/context/Auth.context'
import { axiosInstance } from '@/lib/axios.config'
import type { UserType } from '@/lib/types'
import { useEffect, useState } from 'react'
import { io } from 'socket.io-client'
const socket = io('http://localhost:3000')

interface ChatPropsType {
    selectedUser: UserType
}

const Chat = ({ selectedUser }: ChatPropsType) => {
    const user = useAuth()
    const [receivedData, setReceivedData] = useState<any[]>([])
    const [message, setmessage] = useState('')

    useEffect(() => {
        socket.emit("setup", user?._id)
        socket.on("received-message", (data) => {
            setReceivedData(pre => ([...pre, data]))
        });

        return () => {
            socket.off("received-message")
        }
    }, [user])

    const handleSend = () => {
        if (!message.trim()) return

        socket.emit('send-message', {
            senderId: user?._id,
            receiverId: selectedUser._id,
            message
        })
        setmessage('')
    }

    const getMessage = async () => {
        const res = await axiosInstance.get("/api/message/" + selectedUser._id)
        setReceivedData(res.data)
    }

    useEffect(() => {
        getMessage()
    }, [selectedUser._id])


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

            </div>
            <div className='flex border border-neutral-50 rounded'>
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setmessage(e.target.value)}
                    className='bg-neutral-200 w-full px-4 py-2'
                />
                <button
                    onClick={() => {
                        handleSend();
                        getMessage();
                    }}
                    className='px-4 py-2 bg-blue-200 cursor-pointer'
                >
                    Send
                </button>
            </div>
        </div>
    )
}

export default Chat