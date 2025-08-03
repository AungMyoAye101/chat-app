import Button from "@/components/UI/Button"
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

    const navigate = useNavigate()

    useEffect(() => {
        const fetchUser = async () => {
            try {


                const res = await axiosInstance.get('/api/user')
                setMembers(res.data)
            } catch (error) {
                console.log(error)
            }
        }
        fetchUser()

    }, [])


    console.log(data)
    const handelSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const res = await axiosInstance.post("/api/group/create-group", data)
            if (res.status === 201) {

                navigate(`/group/${res.data.group._id}`)
            }
        } catch (error) {
            console.log(error)
        }
    }


}

const handleAddMember = (userId: string) => {
    if (!Array.data.members.includes(userId)) {
        setData(pre => ({ ...pre, members: [...pre.members, userId] }))
    }
}
return (
    <form onSubmit={handelSubmit} className='flex flex-col gap-4 bg-white p-6'>
        <div>
            <input type="name" placeholder='group name' name="name" onChange={(e) => setData(pre => ({ ...pre, 'name': e.target.value }))} className='w-full ' />
        </div>
        <div>
            <h1 className="font-semibold text-lg font-serif mb-4">Add members</h1>
            <div>
                {
                    members.map(user => (
                        <div key={user._id} className="flex justify-between gap-4 px-4 py-1 hover:bg-blue-200" onClick={() => handleAddMember(user._id)}>
                            <div className="flex items-center gap-4 ">

                                <img src={user.avatar} alt={user.name + " profile photo"} className="w-12 h-12 rounded-full object-cover bg-gray-200 border border-purple-400" />
                                <h1 className="font-medium text-lg font-serif">{user.name}</h1>
                            </div>
                            <button type="button" className="font-serif text-green-400  "
                            >Add</button>
                        </div>
                    ))
                }
            </div>
        </div>
        <Button type='submit' text='Submit' />
        {/* {
                errorMessage && <p className='text-sm text-red-400'>{errorMessage}</p>
            } */}
    </form>
)
}

export default Group