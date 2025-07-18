import { axiosInstance } from "@/lib/axios.config"
import { formatLastSeen } from "@/lib/helper"
import type { MembersType } from "@/lib/types"
import { useEffect, useRef, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"

interface GroupTypes {
    _id: string,
    name: string,
    createdBy: { name: string },
    members: MembersType[]
}
const GroupDeatil = () => {
    const [group, setGroup] = useState<GroupTypes>({
        _id: "",
        name: "",
        createdBy: { name: "" },
        members: []
    })


    //toogle edit group modal
    const [isEditGroupModalOpen, setIsEditGroupModalOpen] = useState(false)
    const { groupId } = useParams()
    const containerRef = useRef<HTMLDivElement>(null)

    const navigate = useNavigate()

    const handleClickOutside = (event: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
            setIsEditGroupModalOpen(false)
        }
    };

    useEffect(() => {

        window.addEventListener('mousedown', handleClickOutside);
        return () => {
            window.removeEventListener('mousedown', handleClickOutside);
        }
    }, [])


    const fetchGroupById = async () => {
        try {
            const res = await axiosInstance.get(`/api/group/${groupId}`)
            console.log(res.data)
            setGroup(res.data.group)

        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        fetchGroupById()
    }, [])

    const deleteGroup = async (groupId: string) => {

        try {
            const res = await axiosInstance.delete("/api/group/delete/" + groupId)
            if (res.status === 200) {
                console.log("Group deleted successfully");

                navigate("/")
            }


        } catch (error) {
            console.log(error)
        }
    }


    return (
        <section>
            <div className="border-2 border-gray-300 rounded-lg shadow-md max-w-4xl mx-auto ">
                <div className="flex items-center gap-4 border-b-2 border-gray-200 p-4 relative">
                    <div className="w-32 h-32 rounded-full bg-gray-300"></div>
                    <div>
                        <h1 className="text-xl font-semibold font-serif">{group.name}</h1>
                        <p>{group.createdBy.name}</p>
                    </div>
                    <div ref={containerRef} className="absolute right-4 top-4 flex gap-2">
                        <button
                            onClick={() => setIsEditGroupModalOpen(pre => !pre)}
                            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors">Edit Group</button>

                        {
                            isEditGroupModalOpen && (
                                <div className="absolute top-12 right-0 bg-white border border-gray-300  shadow-lg rounded-lg p-4 w-64 flex flex-col gap-1 font-serif">

                                    <Link to={`/group/update/${group._id}`} className=" font-medium text-center px-4 py-1 bg-neutral-200 hover:bg-blue-200 rounded">Update </Link>
                                    <button onClick={() => deleteGroup(groupId!)} className="text-red-400 font-medium text-center px-4 py-1 bg-neutral-200 hover:bg-blue-200 rounded">Delete</button>
                                </div>
                            )
                        }
                    </div>
                </div>

                <div className="flex flex-col gap-4 p-4">
                    <h2 className="text-xl font-semibold ">Members</h2>
                    {
                        group.members.map(m => (
                            <Link to={`/user/${m._id}`} className="flex items-center gap-4 border-b-2 border-gray-200 p-2" key={m._id}>
                                <div className="w-14 h-14 rounded-full bg-gray-300"></div>
                                <div className="font-sans">
                                    <h1 className="text-xl font-semibold ">{m.name}</h1>
                                    <p className="text-sm">Last seen in - {formatLastSeen(m.lastSeen)}</p>
                                </div>

                            </Link>
                        ))
                    }
                </div>



            </div>
        </section>
    )
}

export default GroupDeatil