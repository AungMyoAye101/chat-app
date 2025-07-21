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
    // useEffect(() => {
    //     const getMessage = async () => {
    //         if (userId) {
    //             const res = await axiosInstance.get("/api/messages/" + userId)
    //             setReceivedData(res.data)
    //         }
    //     }
    //     getMessage()
    // }, [])

    useEffect(() => {
        if (!userId) return;

        // Handler for received-message
        const handleReceivedMessage = (data: MessageType) => {
            // Only add if the message is for this chat (either sent or received)
            if (
                (data.sender._id === userId && data.receiver._id === user?._id) ||
                (data.receiver._id === userId && data.sender._id === user?._id)
            ) {
                setReceivedData(prev => {
                    const updated = [...prev, data];
                    // Sort by createdAt
                    return updated.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
                });
            }
        };

        socket.on("received-message", handleReceivedMessage);
        getMessage();

        socket.on("isTyping", (senderId: string) => {
            if (senderId === userId) {
                setIsTyping(true);
            }
        });
        socket.on("stopped-typing", (senderId: string) => {
            if (senderId === userId) {
                setIsTyping(false);
            }
        });

        return () => {
            socket.off("received-message", handleReceivedMessage);
            socket.off("isTyping");
            socket.off("stopped-typing");
        };
    }, [userId, user?._id]);


    //Send message to server
    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim() || !user?._id || !userId) return;

        // Optimistically add message for sender
        const newMsg: MessageType = {
            _id: Math.random().toString(36), // temp id
            sender: { _id: user._id, name: user.name || "You" },
            receiver: { _id: userId, name: "" },
            message,
            createdAt: new Date().toISOString(),
        };
        setReceivedData(prev => {
            const updated = [...prev, newMsg];
            return updated.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        });

        socket.emit("send-message", { senderId: user._id, receiverId: userId, message });
        setMessage("");
    };

    //For typing indicator 
    const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!user?._id) return
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

    return (
        <section className='bg-blue-100 h-full flex flex-col '>
            <div className='bg-green-200 '>{userId}</div>
            <div className='flex-1 flex flex-col gap-2 p-2 overflow-hidden overflow-y-scroll'>
                {
                    receivedData.map((data, i) => (
                        <div key={data._id + i} className={` px-4 py-1.5 rounded-lg w-fit  ${data.sender._id === user?._id ? "self-end bg-neutral-100" : "self-start bg-blue-200"}`}>
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