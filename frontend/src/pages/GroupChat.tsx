import { axiosInstance } from "@/lib/axios.config"
import { formatChatTime } from "@/lib/helper"
import { socket } from "@/lib/socket"
import type { GroupTypes } from "@/lib/types"
import { useEffect, useRef, useState } from "react"
import { Link, useNavigate, useParams, } from "react-router-dom"

import ImageBox from "@/components/ImageBox"
import { useLayout } from "@/context/Layout.contex"
import TypingIndicator from "@/components/UI/TypingIndicator"
import { useAuth } from "@/lib/hooks/useAuth"

interface SeenUserType {
    _id: string,
    name: string,
    avatar: string,
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
    const [group, setGroup] = useState<GroupTypes>({
        _id: '',
        name: '',
        createdBy: '',
        members: [],
        avatar: '',
    })
    const [receivedData, setReceivedData] = useState<GroupMessageType[]>([])


    const [message, setMessage] = useState('')
    const [isTyping, setIsTyping] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null) //for autoscrolling to bottom 

    const timeoutRef = useRef<NodeJS.Timeout | null>(null)
    const { groupId } = useParams()

    const { user } = useAuth()
    const { isMobile } = useLayout()

    const navigate = useNavigate()
    //Get group or user 
    const getGroupMessage = async () => {
        const res = await axiosInstance.get(`/api/messages/group/${groupId}`)

        setReceivedData(res.data)
        console.log("get")

    }


    useEffect(() => {
        const getGroup = async () => {
            const res = await axiosInstance.get(`/api/group/${groupId}`)
            setGroup(res.data.group)
        }
        getGroup()
        getGroupMessage()
    }, [groupId])

    useEffect(() => {

        if (!groupId) return console.log("no groupid");

        //join group
        socket.emit("join-group", { groupId, userId: user?._id })

        socket.on("received-group-message", (data) => {
            if (!receivedData.includes(data._id)) {
                setReceivedData(pre => [...pre, data])
            }
        })


        // For typing indicator
        socket.on("isTyping", () => {
            setIsTyping(true)
        })
        socket.on("stopped-typing", () => {
            setIsTyping(false)
        })



        return () => {
            socket.off("received-group-message")
            socket.off("isTyping")
            socket.off("stopped-typing")

        }
    }, [groupId])

    //seen or unseen message 
    useEffect(() => {
        if (!groupId || !user?._id) return;





        const unseenMessage = receivedData.filter(m => {
            const seenByIds = m.seenBy.map(u => u._id)
            return !seenByIds.includes(user._id)
        }
        )
        if (unseenMessage.length === 0) return;

        unseenMessage.forEach((msg) => socket.emit("seen-message", ({
            messageId: msg._id, userId: user?._id, chatId: groupId
        })))
        getGroupMessage()


    }, [receivedData])



    //Send message to server
    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim() || !user?._id || !groupId) return;
        //for sending message
        socket.emit("send-message-group", { groupId: groupId, senderId: user._id, message, });
        setMessage("");
        setIsTyping(false)
    };
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!user?._id) return;
        setMessage(e.target.value)
        if (!isTyping) {
            socket.emit('typing', ({ senderId: user._id, receiverId: groupId }))
        }
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
        }
        timeoutRef.current = setTimeout(() => {
            socket.emit('stop-typing', ({ senderId: user._id, receiverId: groupId }))
        }, 2000)
    }
    // Scroll to bottom 
    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollIntoView({ behavior: "smooth" })
        }
    }, [receivedData, isTyping])



    return (
        <section className='flex flex-col  rounded-lg shadow-md overflow-hidden  h-full border border-neutral-200'>
            <div className='bg-white flex gap-2 px-4 py-1 items-center h-[15%] border-b border-neutral-200'>
                {
                    isMobile && <button onClick={() => navigate(-1)}> <img src="/icons/back.svg" alt=" back icon" className="w-8 cursor-pointer" /> </button>
                }
                <Link to={`/group/${groupId}`} className="flex gap-2 items-center">
                    <ImageBox avatar={group.avatar!} name={group.name!} size="lg" />
                    <div className='flex flex-col '>
                        <h2 className="font-semibold text-lg">{group.name}</h2>
                        <p className="text-sm">{group.members.length} memebers</p>
                    </div>
                </Link>
            </div>
            <div className="h-[75%] overflow-hidden  overflow-y-scroll no-scrollbar bg-green-100 p-4 flex flex-col gap-4">
                {
                    receivedData.map((m) =>
                        <div key={m._id} className={`w-full relative gap-1 flex flex-col  `}  >


                            <div className={` w-fit relative ${user?._id === m.sender._id ? "self-end" : "self-start"} `}>
                                <div className={`bg-white px-4 py-2 w-fit rounded-lg flex flex-col  `}>
                                    <p className="font-serif">{m.message}</p>
                                    <span className="text-xs text-neutral-500">{formatChatTime(m.createdAt)}</span>

                                </div>
                                <div className={`flex mx-1.5   absolute -bottom-1 ${user?._id === m.sender._id ? " right-[100%] flex-row-reverse" : " left-[100%]"} `} >

                                    {
                                        m.seenBy && m.seenBy.map((u) => u._id !== user?._id && <ImageBox avatar={u.avatar} name={u.name} size="sm" key={u._id} className="-ml-1 border border-white" />)
                                    }
                                    {
                                        m.seenBy.length > 3 && <div className="flex items-center justify-center bg-white w-6 h-6 text-sm rounded-xl px-4 text-neutral-700 mx-0.5">
                                            +{
                                                m.seenBy.length - 3
                                            }

                                        </div>
                                    }




                                </div>
                            </div>

                        </div>




                    )
                }

                {
                    isTyping && <TypingIndicator />
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
                <button className='px-4 py-1 bg-blue-300 cursor-pointer '><img src="/icons/send.svg" alt="send icon" className="w-8 " /></button>
            </form>
        </section>
    )
}

export default GroupChat