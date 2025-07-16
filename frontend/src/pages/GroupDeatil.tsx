import { axiosInstance } from "@/lib/axios.config"
import type { GroupWithMembers } from "@/lib/types"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"


const GroupDeatil = () => {
    const [group, setGroup] = useState<GroupWithMembers[]>([])
    const { groupId } = useParams()
    const fetchGroupById = async () => {
        try {
            const res = await axiosInstance.get(`/api/group/${groupId}`)
            setGroup(res.data.group)

        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        fetchGroupById()
    }, [])

    return (
        <section>
            <div>
                {
                    group.map(g => (
                        <div>
                            <div className="w-32 h-32 rounded-full bg-gray-300"></div>
                            <div>
                                <h1 className="text-xl font-semibold font-serif">{g.name}</h1>
                                <p>{ }</p>
                            </div>
                            <div>
                                <h2>Members</h2>
                                {
                                    g.members.map(m => (
                                        <div>
                                            <div className="w-32 h-32 rounded-full bg-gray-300"></div>
                                            <div>
                                                <h1 className="text-xl font-semibold font-serif">{m.name}</h1>
                                                <p>{m.lastSeen}</p>
                                            </div>

                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    ))
                }
            </div>
        </section>
    )
}

export default GroupDeatil