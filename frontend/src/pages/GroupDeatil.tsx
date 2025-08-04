import ImageUpload from "@/components/ImageUpload"
import { axiosInstance } from "@/lib/axios.config"
import { formatLastSeen } from "@/lib/helper"
import type { MembersType } from "@/lib/types"
import { useEffect, useRef, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"

interface GroupTypes {
    _id: string,
    name: string,
    createdBy: { _id: string, name: string },
    members: MembersType[],
    avatar: string
}
const GroupDeatil = () => {
    const [group, setGroup] = useState<GroupTypes>({
        _id: "",
        name: "",
        createdBy: { _id: '', name: "" },
        members: [],
        avatar: ''
    })


    //toogle edit group modal
    const [isEditGroupModalOpen, setIsEditGroupModalOpen] = useState(false)
    const [isImageBoxOpen, setIsImageBoxOpen] = useState(false)
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
                navigate("/")
            }
        } catch (error) {
            console.log(error)
        }
    }


    return (
        <section>
            <div className="border-2 border-gray-300 rounded-lg shadow-md max-w-4xl mx-auto ">
                <div className="flex items-center justify-between gap-4 border-b-2 border-gray-200 p-4 relative">
                    <div className="flex gap-2 items-center">

                        <img src={group.avatar || "/vite.svg"} alt="Group avatar photo" className="w-32 h-32 rounded-full bg-gray-300 object-cover" />
                        <div>
                            <h1 className="text-xl font-semibold font-serif">{group.name}</h1>
                            <p>Created by <span className="font-medium"> {group.createdBy.name} </span> </p>
                        </div>
                    </div>
                    <div ref={containerRef} className=" flex flex-col gap-2">
                        <button
                            onClick={() => setIsEditGroupModalOpen(pre => !pre)}
                            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors">
                            Edit Group
                        </button>
                        <button
                            onClick={() => setIsImageBoxOpen(pre => !pre)}
                            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors">
                            Set Photo
                        </button>

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
                {
                    isImageBoxOpen && <ImageUpload type="group" id={group._id} img={group.avatar} onClose={() => setIsImageBoxOpen(false)} />
                }

                <div className="flex flex-col gap-4 p-4">
                    <h2 className="text-xl font-semibold ">Members</h2>
                    {
                        group.members.map(m => (
                            <Link to={`/user/${m._id}`} className="flex items-center gap-4 border-b-2 border-gray-200 p-2" key={m._id}>
                                <img src={m.avatar || '/user-icon.svg'} alt={m.name + "profile photo"} className="w-14 h-14 rounded-full bg-gray-300 object-cover" />
                                <div className="font-sans">
                                    <h1 className="text-xl font-semibold ">{m.name}
                                        {
                                            m._id === group.createdBy._id && <span className="text-sm text-green-500"> (Admin)</span>
                                        }
                                    </h1>
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