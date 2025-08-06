import { formatChatTime, formatLastSeen } from "@/lib/helper"
import ImageBox from "./ImageBox"
import type { UserType } from "@/lib/types"
import { useEffect, useState, type FC } from "react"
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




    //Send message to server
    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Sending...", message, currUserId, selectedUser._id)
        if (!message.trim() || !currUserId || !selectedUser?._id) return;
        //for sending message
        console.log("Send...")
        socket.emit("send-message", { senderId: currUserId, receiverId: selectedUser._id, message });
        setMessage("");
        setIsTyping(false)
    };

    const getMessage = async () => {
        if (currUserId) {
            const res = await axiosInstance.get("/api/messages/" + selectedUser._id)
            console.log(res.data)
            setReceivedData(res.data)
        }
    }

    useEffect(() => {
        getMessage()
    }, [selectedUser._id])

    console.log(selectedUser)
    return (
        <section className='flex flex-col gap-4 bg-blue-100 h-screen overflow-hidden  overflow-y-scroll  relative '>
            <div className='bg-white flex gap-2 px-4 py-1 items-center sticky top-0 w-full'>
                <ImageBox avatar={selectedUser?.avatar!} name={selectedUser?.name!} />
                <div className='flex flex-col '><h2>{selectedUser?.name}</h2>
                    <p className='text-xs'>{formatLastSeen(selectedUser?.lastSeen!)}</p></div>
            </div>
            <div className='h-full flex flex-col gap-2 px-4 '>
                {
                    receivedData.map(m =>
                        <div key={m._id} className="self-end "  >

                            <div className="bg-white  px-4 py-2 rounded-lg">
                                <p className="font-serif">{m.message}</p>
                                <span className="text-xs text-neutral-500">{formatChatTime(m.createdAt)}</span>
                            </div>
                            {m.seenBy.includes(selectedUser._id) &&
                                <ImageBox avatar={selectedUser.avatar!} name={selectedUser.name} className={"w-6 h-6"} />
                            }

                        </div>)
                }

            </div>
            <form onSubmit={handleSendMessage} className='flex bg-white'>
                <input type="text" className='flex-1' onChange={(e) => setMessage(e.target.value)} />
                <button className='px-4 py-1 bg-blue-400 text-white'>Send</button>
            </form>
        </section >
    )
}

export default ChatBox