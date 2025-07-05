import User from '@/components/User'
import { useEffect, useState } from 'react'
import { io } from 'socket.io-client'
const socket = io('http://localhost:3000')



const Chat = () => {
    const [message, setmessage] = useState('')
    const [receivedData, setReceivedData] = useState<any[]>([])
    const [selectedUser, setselectedUser] = useState<any>()

    useEffect(() => {
        socket.emit("setup", currUser.id)
        socket.on("received-message", (data) => {
            setReceivedData(pre => ([...pre, data]))
        });

        return () => {
            socket.off("received-message")
        }
    }, [])


    const handleSend = () => {
        if (!message.trim()) return

        socket.emit('send-message', {
            sender: currUser,
            receiverId: selectedUser.id,
            message
        })
        setmessage('')
    }

    return (
        <section className='bg-white p-4 h-screen w-full'>
            <div className='flex w-full'>
                <User />
                <div className='w-full'>
                    <h1 className='text-xl font-semibold'>{selectedUser?.name || ""}</h1>

                    <div className='h-96 bg-white border p-4 w-full flex flex-col '>
                        {
                            receivedData.map(data => (
                                <div key={data.id} className={`${data.sender.id === currUser.id ? "self-end bg-blue-200 " : "self-start"} px-2 py-1 rounded-2xl  bg-amber-200 flex gap-1 items-start`}>

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
            </div>
        </section>
    )
}

export default Chat