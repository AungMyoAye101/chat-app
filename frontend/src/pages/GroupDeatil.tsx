import ImageBox from "@/components/ImageBox"
import ImageUpload from "@/components/ImageUpload"
import { axiosInstance } from "@/lib/axios.config"
import { formatLastSeen } from "@/lib/helper"
import { useAuth } from "@/lib/hooks/useAuth"
import type { MembersType } from "@/lib/types"
import { useEffect, useRef, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"

export interface GroupTypes {
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
    const { user } = useAuth()
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


    const navigateToChat = (userId: string) => {
        const isMember = group.members.some(m => m._id === userId)
        if (isMember) {
            navigate(`/chat/group/${groupId}`)
        } else {
            alert("You are not a group member yet.")
        }
    }

    return (
        <section className="mt-14">
            <div className="border-2 border-gray-300 rounded-lg shadow-md  bg-white h-[calc(100vh-4rem)] flex flex-col">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b-2 border-gray-200 p-4 relative">

                    {/* group info container */}
                    <div className="flex gap-2 items-center">
                        <ImageBox avatar={group.avatar} name={group.name} size="xl" />

                        <div>
                            <h1 className="text-xl font-semibold font-serif">{group.name}</h1>
                            <p>Created by <span className="font-medium"> {group.createdBy.name} </span> </p>
                        </div>
                    </div>

                    {/* buttons conatiner */}
                    <div ref={containerRef} className=" flex flex-row  md:flex-col gap-1 text-sm">
                        <button
                            onClick={() => setIsEditGroupModalOpen(pre => !pre)}
                            className="bg-blue-500 text-white px-3 py-1.5 rounded-md hover:bg-blue-600 transition-colors">
                            Edit Group
                        </button>
                        <button
                            onClick={() => setIsImageBoxOpen(pre => !pre)}
                            className="bg-blue-500 text-white px-3 py-1.5 rounded-md hover:bg-blue-600 transition-colors">
                            Set Photo
                        </button>
                        {/* <Link to={`/chat/group/${groupId}`}

                            onClick={() => setIsImageBoxOpen(pre => !pre)}
                            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors">
                            Send message
                        </Link> */}
                        <button onClick={() => navigateToChat(user?._id!)}
                            className="bg-neutral-400 text-white px-3 py-1.5 rounded-md hover:bg-blue-600 transition-colors">
                            Send message

                        </button>

                        {
                            isEditGroupModalOpen && (
                                <div className="absolute top-4 right-4 bg-neutral-50 border-2 border-purple-500 text-white shadow-lg rounded-lg px-4 py-7 w-60 flex flex-col gap-2 font-medium">

                                    <Link to={`/group/update/${group._id}`} className=" text-center px-4 py-1.5 bg-blue-500 hover:bg-blue-200 rounded-md">Update </Link>
                                    <button onClick={() => deleteGroup(groupId!)} className="bg-red-400 text-center px-4 py-1.5  hover:bg-blue-200 rounded-md">Delete</button>
                                </div>
                            )
                        }

                    </div>
                </div>
                {
                    isImageBoxOpen && <ImageUpload type="group" id={group._id} img={group.avatar} onClose={() => setIsImageBoxOpen(false)} />
                }
                <div className="flex justify-between items-center  p-4">

                    <h2 className="text-xl font-semibold font-serif">Members</h2>
                    <Link to={`/group/update/${groupId}/add-members`} className="bg-green-500  text-white px-4 py-1.5 rounded-md ">Add members</Link>
                </div>
                <div className="flex-1 overflow-hidden overflow-y-scroll flex flex-col gap-4 p-4 scroll-smooth">

                    {
                        group.members.map(m => (
                            <Link to={`/user/${m._id}`} className="flex items-center gap-4 border-b-2 border-gray-200 p-2 hover:bg-purple-200" key={m._id}>

                                <ImageBox avatar={m.avatar!} name={m.name} size="md" />

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