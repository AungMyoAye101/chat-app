import { axiosInstance } from "@/lib/axios.config"
import type { GroupTypes } from "@/lib/types"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"


const GroupChat = () => {
    const [group, setGroup] = useState<GroupTypes>()

    const { groupId } = useParams()

    useEffect(() => {
        const getGroup = async () => {
            const res = await axiosInstance.get(`/api/group/${groupId}`)
            setGroup(res.data.group)

        }
        getGroup()
    }, [groupId])


    return (
        <section className='bg-sky-200 h-screen w-full flex flex-col '>
            <div className="flex gap-2 px-4 py-1">
                <div className="w-8 h-8 rounded-full bg-green-400"></div>
                <h1>{group?.name}</h1>
            </div>

            <div className="overflow-hidden overflow-y-scroll flex-1">

            </div>
            <form className="flex">
                <input type="text" className="flex-1" />
                <button>send</button>
            </form>

        </section>
    )
}

export default GroupChat