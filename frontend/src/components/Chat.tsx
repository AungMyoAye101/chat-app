import { useAuth } from '@/context/Auth.context'
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
            sender: user?._id,
            receiverId: selectedUser._id,
            message
        })
        setmessage('')
    }
    return (
        <div className='w-full'>
            <h1 className='text-xl font-semibold'>{selectedUser?.name || ""}</h1>

            <div className='h-96 bg-white border p-4 w-full flex flex-col '>
                {
                    receivedData.map(data => (
                        <div key={data.id} className={`${data.sender.id === user?._id ? "self-end bg-blue-200 " : "self-start"} px-2 py-1 rounded-2xl  bg-amber-200 flex gap-1 items-start`}>

                            <div>
                                <p>{data.message}</p>
                                <p className='text-xs'>{data.sender.name}</p>
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
                <button onClick={handleSend} className='px-4 py-2 bg-blue-200 cursor-pointer'>Send</button>
            </div>
        </div>
    )
}

export default Chat