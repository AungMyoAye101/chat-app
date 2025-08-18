
import ImageBox from "@/components/ImageBox"
import { axiosInstance } from "@/lib/axios.config"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

interface Members {
    _id: string,
    name: string,
    avatar: string,
}
interface GroupType {
    name: string,
    members: string[],
}


const Group = () => {
    const [data, setData] = useState<GroupType>({
        name: "",
        members: []
    })
    const [members, setMembers] = useState<Members[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [isLoadingData, setIsLoadingData] = useState(false)
    const [errorMessage, seterrorMessage] = useState('')
    const navigate = useNavigate()

    useEffect(() => {
        const fetchUser = async () => {
            setIsLoadingData(true)
            try {


                const res = await axiosInstance.get('/api/user')
                setMembers(res.data)
            } catch (error) {
                console.log(error)
            } finally {
                setIsLoadingData(false)
            }
        }
        fetchUser()

    }, [])





    const handelSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!data.name.trim()) seterrorMessage("Please set group name.")
        setIsLoading(true)
        try {
            const res = await axiosInstance.post("/api/group/create-group", data)
            if (res.status === 201) {

                navigate(`/group/${res.data.group._id}`)
            }
        } catch (error) {
            if (error instanceof Error) {

                console.log(error)
                seterrorMessage(error.message)
            }
        } finally {
            setIsLoading(false)
        }
    }




    const handleAddMember = (userId: string) => {
        if (data.members.includes(userId)) {
            const removeUser = data.members.filter(id => id !== userId)

            setData(pre => ({ ...pre, members: removeUser }))
        } else {
            setData(pre => ({ ...pre, members: [...pre.members, userId] }))

        }

    }
    return (
        <form onSubmit={handelSubmit} className='flex flex-col gap-4 bg-white p-6 border border-neutral-200 mt-4 rounded-lg shadow max-w-2xl mx-auto'>
            <h1 className="text-2xl font-semibold  text-center font-serif">Create Group</h1>
            {
                errorMessage && <p className="text-red-400 font-serif text-center">{errorMessage}</p>
            }
            <div className="flex flex-col gap-1">
                <label htmlFor="group-name" className="font-medium ">Group name</label>
                <input type="name" id="group-name" placeholder='group name' name="name" onChange={(e) => setData(pre => ({ ...pre, 'name': e.target.value }))} className='w-full border border-neutral-200 px-4 py-2 rounded-lg ' />
            </div>
            <div>
                <h1 className="font-semibold text-lg font-serif ">Add members</h1>
                <div className="flex border border-neutral-200 pl-4  rounded-lg overflow-hidden my-2">
                    <input type="text" placeholder="Search user name" className="flex-1 !rounded-none" />
                    <button type="button" className="px-4 py-2 bg-orange-400 text-white">Search</button>
                </div>
                <div className="rounded-lg overflow-hidden border border-neutral-200">
                    {
                        isLoadingData ? <div className="font-medium ">Loading user...</div> :
                            members.map(user => (
                                <div key={user._id} className={`flex justify-between gap-4 px-4 py-1 hover:bg-blue-200 ${data.members.includes(user._id) && "bg-green-100"}`} onClick={() => handleAddMember(user._id)}>
                                    <div className="flex items-center gap-4 ">

                                        <ImageBox avatar={user.avatar} name={user.name} size="md" />
                                        <h1 className="font-medium text-lg font-serif">{user.name}</h1>

                                    </div>
                                    <button type="button" className="font-serif text-green-500  "
                                    >{data.members.includes(user._id) ? "Added" : "Add"}</button>
                                </div>
                            ))
                    }
                </div>
            </div>
            <button type="submit" className={`px-4 py-1.5 bg-orange-400 text-white rounded-lg ${isLoading ? "cursor-wait" : "cursor-pointer"}`}>
                {isLoading ? "Creating..." : "Create"}
            </button>
            {/* {
                errorMessage && <p className='text-sm text-red-400'>{errorMessage}</p>
            } */}
        </form>
    )
}

export default Group