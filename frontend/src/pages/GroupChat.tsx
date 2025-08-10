import { axiosInstance } from "@/lib/axios.config"
import { useAuth } from "@/context/Auth.context"
import { formatChatTime } from "@/lib/helper"
import { socket } from "@/lib/socket"
import type { GroupTypes } from "@/lib/types"
import { useEffect, useRef, useState } from "react"
import { Link, useParams, } from "react-router-dom"
import ChatBox from "@/components/ChatBox"

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

    const { groupId } = useParams()
    const user = useAuth()




    //Get group or user 
    const getGroupMessage = async () => {
        const res = await axiosInstance.get(`/api/messages/group/${groupId}`)

    }
    useEffect(() => {
        const getGroup = async () => {
            const res = await axiosInstance.get(`/api/group/${groupId}`)
            setGroup(res.data.group)
        }

        getGroup()
        getGroupMessage()

    }, [groupId])



    return (
        <ChatBox selectedUser={group} currUserId={user?._id!} />
    )
}

export default GroupChat