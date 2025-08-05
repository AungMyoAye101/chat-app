import { formatLastSeen } from "@/lib/helper"
import ImageBox from "./ImageBox"
import type { UserType } from "@/lib/types"
import { useState, type FC } from "react"
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
        if (!message.trim() || !currUserId || !selectedUser?._id) return;
        //for sending message
        socket.emit("send-message", { senderId: currUserId, receiverId: selectedUser._id, message });
        setMessage("");
        setIsTyping(false)
    };

    const getMessage = async () => {
        if (currUserId) {
            const res = await axiosInstance.get("/api/messages/" + currUserId)
            setReceivedData(res.data)
        }
    }

    return (
        <section className='flex flex-col gap-4 bg-blue-100 h-screen overflow-hidden  overflow-y-scroll  relative '>
            <div className='bg-white flex gap-2 px-4 py-1 items-center sticky top-0 w-full'>
                <ImageBox avatar={selectedUser?.avatar!} name={selectedUser?.name!} />
                <div className='flex flex-col '><h2>{selectedUser?.name}</h2>
                    <p className='text-xs'>{formatLastSeen(selectedUser?.lastSeen!)}</p></div>
            </div>
            <div className='h-full'>

            </div>
            <form onSubmit={handleSendMessage} className='flex bg-white'>
                <input type="text" className='flex-1' />
                <button className='px-4 py-1 bg-blue-400 text-white'>Send</button>
            </form>
        </section >
    )
}

export default ChatBox