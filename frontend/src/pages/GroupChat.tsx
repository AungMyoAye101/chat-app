import { useAuth } from "@/context/Auth.context"
import { axiosInstance } from "@/lib/axios.config"
import { socket } from "@/lib/socket"
import type { GroupTypes } from "@/lib/types"
import { useEffect, useRef, useState } from "react"
import { Link, useParams, } from "react-router-dom"


interface GroupMessageType {
    sender: { name: string, _id: string },
    message: string,
    _id: string,
    group: string
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
        <section className='bg-sky-50 h-screen w-full flex flex-col '>
            <Link to={`/group/${groupId}`} className="flex gap-2 px-4 py-1 bg-white">
                <div className="w-8 h-8 rounded-full bg-green-400"></div>
                <h1>{group?.name}</h1>
            </Link>

            <div className="overflow-hidden overflow-y-scroll flex-1 flex flex-col gap-1 p-4">
                {receivedData.map((m) => (
                    <div key={m._id} className={`px-4 py-1.5 rounded-lg w-fit mb-2 ${user?._id === m.sender._id ? "self-end bg-white" : "self-start bg-blue-200"}`}>
                        <div className="text-sm">{m.message}</div>
                        <p className="text-xs">{m.sender.name}</p>
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