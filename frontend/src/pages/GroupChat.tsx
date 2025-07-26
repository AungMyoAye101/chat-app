import { axiosInstance } from "@/lib/axios.config"
import { useAuth } from "@/context/Auth.context"
import { formatChatTime } from "@/lib/helper"
import { socket } from "@/lib/socket"
import type { GroupTypes } from "@/lib/types"
import { useEffect, useRef, useState } from "react"
import { Link, useParams, } from "react-router-dom"

interface SeenUserType {
    _id: string,
    name: string
}
interface GroupMessageType {
    sender: { name: string, _id: string },
    message: string,
    _id: string,
    group: string,
    createdAt: string,
    seenBy: SeenUserType[]
}


const GroupChat = () => {
    const [group, setGroup] = useState<GroupTypes>()
    const [message, setMessage] = useState('')
    const [receivedData, setReceivedData] = useState<GroupMessageType[]>([])
    const [isTyping, setIsTyping] = useState(false)
    const { groupId } = useParams()
    const user = useAuth()
    const typingTimeOutRef = useRef<NodeJS.Timeout | null>(null)
    const scrollRef = useRef<HTMLDivElement | null>(null)
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" })
        }
    }, [receivedData, isTyping])


    useEffect(() => {
        const getGroup = async () => {
            const res = await axiosInstance.get(`/api/group/${groupId}`)
            setGroup(res.data.group)
        }
        const getGroupMessage = async () => {
            const res = await axiosInstance.get(`/api/messages/group/${groupId}`)
            setReceivedData(res.data)
        }

        getGroup()
        getGroupMessage()

    }, [groupId])

    //For message seen functionally

    useEffect(() => {
        // const seenMessage = async () => {
        //     const unseenMessage = receivedData.filter((m) => !m.seenBy.some(u => u._id === user?._id))
        //     console.log(unseenMessage.length)
        //     if (unseenMessage.length === 0) return;
        //     unseenMessage.forEach(msg => {
        //         socket.emit("seen-message", { messageId: msg._id, userId: user?._id, chatId: groupId });
        //     });

        //     // setReceivedData(unseenMessage)
        // }
        socket.on("seen", (data) => {
            setReceivedData(pre => (pre.map(m => m._id === data._id ? data : pre)))
        })

        return () => { socket.off("seen") }
    }, [])

    useEffect(() => {

        if (!user?._id || !receivedData) return
        const unSeenMessage = receivedData.filter((message) => !message.seenBy.some(msg => msg._id === user?._id))
        console.log(unSeenMessage)
        if (unSeenMessage.length === 0) return
        unSeenMessage.forEach(m => {
            console.log(m._id)
            socket.emit("seen-message", { messageId: m._id, userId: user?._id, chatId: groupId })
        })




    }, [receivedData])



    useEffect(() => {
        if (!groupId || !user?._id) return;
        socket.emit("join-group", { groupId, userId: user._id });

        socket.on("received-group-message", (data) => {
            setReceivedData(prev => [...prev, data]);
        });

        socket.on("isTyping", (data) => {
            if (groupId === data.receiverId) {
                setIsTyping(true)
            }
        })
        socket.on("stopped-typing", (data) => {
            if (groupId === data.receiverId) {
                setIsTyping(false)
            }
        })

        return () => {
            socket.off("received-group-message");
            socket.off("isTying");
            socket.off("stopped-tying");
        };
    }, [groupId, user?._id]);


    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim() || !groupId || !user?._id) return console.log('group ,userid is required');

        socket.emit("send-message-group", { groupId, senderId: user._id, message });

        setMessage("");
    };


    //For typing indicator 
    const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {

        setMessage(e.target.value)
        if (!isTyping) {
            socket.emit("typing", ({ senderId: user?._id, receiverId: groupId }))
            if (typingTimeOutRef.current) {
                clearTimeout(typingTimeOutRef.current)
            }
            typingTimeOutRef.current = setTimeout(() => {
                socket.emit("stop-typing", ({ senderId: user?._id, receiverId: groupId }))
            }, 3000)
        }
    }



    return (
        <section className=' h-screen w-full flex flex-col '>
            <Link to={`/group/${groupId}`} className="flex gap-2 px-4 py-1 bg-white">
                <div className="w-8 h-8 rounded-full bg-green-400"></div>
                <h1>{group?.name}</h1>
            </Link>

            <div className="overflow-hidden overflow-y-scroll flex-1 flex flex-col gap-2 p-4">
                {receivedData.map((m) => (
                    <div key={m._id} className={`w-fit max-w-[60%]  ${m.sender?._id && user?._id === m.sender._id ? "self-end " : "self-start "}`}>
                        <div className={`mb-2 px-4 py-1.5  rounded-lg flex flex-col  shadow ${m.sender?._id && user?._id === m.sender._id ? " bg-white" : " bg-blue-50"}`}>
                            {m.sender?.name && m.sender._id !== user?._id && (
                                <p className="text-sm font-medium text-blue-400">{m.sender.name}</p>
                            )}
                            <div className="text-sm">{m.message}</div>
                            <span className="text-sm self-end text-neutral-600 opacity-80 ">{formatChatTime(m.createdAt)}</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                            {Array.isArray(m.seenBy) && m.seenBy.filter(u => u._id !== user?._id).map(u =>
                                <div key={u._id} className="w-6 h-6 flex justify-center items-center bg-green-400 rounded-full text-sm">{u.name[0]}</div>
                            )}
                        </div>
                    </div>
                ))}
                {
                    isTyping && <p className="px-4 py-1 bg-white text-sm w-fit rounded-lg">Typing...</p>
                }
                <div ref={scrollRef} />
            </div>
            <form onSubmit={handleSend} className="flex">
                <input type="text" value={message} className="flex-1" onChange={e => handleTyping(e)} />
                <button type="submit" className="px-4 py-1 bg-white">send</button>
            </form>

        </section>
    )
}

export default GroupChat