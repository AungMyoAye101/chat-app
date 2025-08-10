import { formatChatTime, formatLastSeen } from "@/lib/helper"
import ImageBox from "./ImageBox"
import type { UserType } from "@/lib/types"
import { useEffect, useRef, useState, type FC } from "react"
import { socket } from "@/lib/socket"
import { axiosInstance } from "@/lib/axios.config"

interface ChatBoxPropsTypes {
    selectedUser: UserType,
    currUserId: string
}

type MessageType = {
    _id: string,
    sender: { _id: string, name: string, };
    receiver: { _id: string, name: string, };
    message: string,
    createdAt: string,
    seenBy: string[]
    // add other fields if needed
};

const ChatBox: FC<ChatBoxPropsTypes> = ({ selectedUser, currUserId }) => {
    const [message, setMessage] = useState('')
    const [isTyping, setIsTyping] = useState(false)
    const [receivedData, setReceivedData] = useState<MessageType[]>([])

    const containerRef = useRef<HTMLDivElement>(null) //for autoscrolling to bottom 

    const timeoutRef = useRef<NodeJS.Timeout | null>(null)

    //Send message to server
    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim() || !currUserId || !selectedUser?._id) return;
        //for sending message
        socket.emit("send-message", { senderId: currUserId, receiverId: selectedUser._id, message });
        setMessage("");
        setIsTyping(false)
    };

    const getMessage = async () => {
        if (selectedUser._id) {
            const res = await axiosInstance.get("/api/messages/" + selectedUser._id)
            setReceivedData(res.data)
        }
    }

    useEffect(() => {
        getMessage()
    }, [selectedUser._id])


    // Scroll to bottom 
    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollIntoView({ behavior: "smooth" })
        }
    }, [receivedData, isTyping])

    //Check seen or unseen message

    useEffect(() => {
        if (!selectedUser._id) return;

        const unseenMessage = receivedData.filter(m => !m.seenBy.includes(currUserId))
        if (unseenMessage.length === 0) return;
        unseenMessage.forEach(m => socket.emit("seen-message", ({ messageId: m._id, userId: currUserId, chatId: selectedUser._id })))

    }, [receivedData])

    //socket 

    useEffect(() => {
        if (!selectedUser._id) return;

        socket.on("received-message", (data) => {
            setReceivedData(pre => [...pre, data])
        })

        // For typing indicator
        socket.on("isTyping", () => {
            setIsTyping(true)
        })
        socket.on("stopped-typing", () => {
            setIsTyping(false)
        })

        return () => {
            socket.off("received-message")
            socket.off("isTyping")
            socket.off("stopped-typing")
        }
    }, [selectedUser._id])


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


    return (
        <section className='flex flex-col  rounded-lg shadow-md overflow-hidden  h-full border border-neutral-200'>
            <div className='bg-white flex gap-2 px-4 py-1 items-center h-[15%] border-b border-neutral-200'>
                <ImageBox avatar={selectedUser?.avatar!} name={selectedUser?.name!} size="lg" />
                <div className='flex flex-col '><h2>{selectedUser?.name}</h2>
                    <p className='text-xs'>{formatLastSeen(selectedUser?.lastSeen!)}</p></div>
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
                    isTyping && <div className="italic font-serif text-sm">Typing...</div>
                }
                {/* For scrol in to view  */}

                <div ref={containerRef} />
            </div>



            <form onSubmit={handleSendMessage} className='flex bg-white h-[10%] w-full border-t border-neutral-200'>
                <input
                    type="text"
                    value={message}

                    onChange={(e) => handleChange(e)}
                    placeholder="Aa"
                    className='flex-1 bg-white px-4 py-3'
                />
                <button className='px-4 py-1 bg-blue-400 text-white'>Send</button>
            </form>
        </section >
    )
}

export default ChatBox