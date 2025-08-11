import { axiosInstance } from "@/lib/axios.config"
import { useAuth } from "@/context/Auth.context"
import { formatChatTime } from "@/lib/helper"
import { socket } from "@/lib/socket"
import type { GroupTypes, MessageType } from "@/lib/types"
import { useEffect, useRef, useState } from "react"
import { Link, useParams, } from "react-router-dom"
import ChatBox from "@/components/ChatBox"
import ImageBox from "@/components/ImageBox"

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
    const [group, setGroup] = useState<GroupTypes>({
        _id: '',
        name: '',
        createdBy: '',
        members: [],
        avatar: '',
    })
    const [receivedData, setReceivedData] = useState<MessageType[]>([])
    const { groupId } = useParams()
    console.log(groupId)
    const user = useAuth()





    useEffect(() => {
        const getGroup = async () => {
            const res = await axiosInstance.get(`/api/group/${groupId}`)
            setGroup(res.data.group)
        }
        //Get group or user 
        const getGroupMessage = async () => {
            const res = await axiosInstance.get(`/api/messages/group/${groupId}`)
            console.log(res.data, "data")
            setReceivedData(res.data)
            console.log(receivedData)
        }

        getGroup()
        getGroupMessage()

    }, [groupId])




    return (
        <section className='flex flex-col  rounded-lg shadow-md overflow-hidden  h-full border border-neutral-200'>
            <div className='bg-white flex gap-2 px-4 py-1 items-center h-[15%] border-b border-neutral-200'>
                <ImageBox avatar={group.avatar!} name={group.name!} size="lg" />
                <div className='flex flex-col '>
                    <h2 className="font-semibold text-lg">{group.name}</h2>
                    <p className="text-sm">{group.members.length} memebers</p>
                </div>
            </div>
            <ChatBox selectedChatId={group._id} receivedData={receivedData} setReceivedData={setReceivedData} currUserId={user?._id!} />
        </section>
    )
}

export default GroupChat