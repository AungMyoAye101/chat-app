import { useAuth } from "@/context/Auth.context"
import { axiosInstance } from "@/lib/axios.config"
import { socket } from "@/lib/socket"
import type { GroupTypes } from "@/lib/types"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"




const GroupChat = () => {
    const [group, setGroup] = useState<GroupTypes>()
    const [message, setMessage] = useState('')
    const [receivedData, setReceivedData] = useState<string[]>([])
    const { groupId } = useParams()
    const user = useAuth()


    useEffect(() => {
        const getGroup = async () => {
            const res = await axiosInstance.get(`/api/group/${groupId}`)
            setGroup(res.data.group)
        }
        getGroup()
    }, [groupId])

    useEffect(() => {
        if (!groupId || !user?._id) return;
        socket.emit("join-group", { groupId, userId: user._id });


        socket.on("received-group-message", (data) => {
            setReceivedData(prev => [...prev, data]);
        });

        return () => {
            socket.off("received-group-message");
        };
    }, [groupId, user?._id]);


    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim() || !groupId || !user?._id) return;

        socket.emit("send-message-group", { groupId, senderId: user._id, message });
        setMessage("");
    };
    return (
        <section className='bg-sky-200 h-screen w-full flex flex-col '>
            <div className="flex gap-2 px-4 py-1 bg-white">
                <div className="w-8 h-8 rounded-full bg-green-400"></div>
                <h1>{group?.name}</h1>
            </div>

            <div className="overflow-hidden overflow-y-scroll flex-1">
                {receivedData.map((m, i) => (
                    <div key={i} className={`px-4 py-1.5 rounded-lg w-fit mb-2 `}>
                        <div className="text-sm">{m}</div>

                    </div>
                ))}
            </div>
            <form onSubmit={handleSend} className="flex">
                <input type="text" value={message} className="flex-1" onChange={e => setMessage(e.target.value)} />
                <button type="submit" className="px-4 py-1 bg-white">send</button>
            </form>

        </section>
    )
}

export default GroupChat