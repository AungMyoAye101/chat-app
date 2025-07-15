import { axiosInstance } from "@/lib/axios.config"
import type { UserType } from "@/lib/types"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"


const AddMembers = () => {
    const [users, setusers] = useState<UserType[]>([])
    const [selectedUser, setSelectedUser] = useState<string[]>([])
    const { groupId } = useParams()
    useEffect(() => {
        const fetchAvailableUser = async () => {
            try {
                const res = await axiosInstance.get(`/api/group/check-available-user/${groupId}`)
                setusers(res.data.avaliableUser)
            } catch (error) {
                console.log(error)
            }
        }
        fetchAvailableUser()
    }, [])

    const addGroupMember = async () => {
        if (selectedUser.length < 1) return
        console.log(selectedUser, " selected user")
        try {
            const res = await axiosInstance.put(`/api/group/${groupId}/add-members`, { memberId: selectedUser })
            console.log(res.data)
            // Optionally, you can update the state to reflect the new member added 

        } catch (error) {
            console.log(error)
        }
    }

    return (
        <section className=''>
            <div className='flex flex-col gap-4' >
                <div className='flex w-full gap-4'><input type="text" className='flex-1' /><button>search</button></div>
                <div className='flex flex-col  border gap-1 '>
                    {
                        users.map((user) => (
                            <div key={user._id} className={`flex items-center justify-between px-4 py-1  cursor-pointer ${selectedUser.includes(user._id) ? 'bg-blue-400' : 'bg-blue-50'}`} onClick={() => setSelectedUser(pre => pre.includes(user._id) ? pre.filter(id => id !== user._id) : [...pre, user._id])}>

                                <div className='flex items-center gap-2'>
                                    <div className='w-10 h-10 rounded-full bg-gray-300 flex justify-center items-center'>{user.name[0]}</div>
                                    <span>{user.name}</span>
                                </div>
                                {/* <button onClick={() => setSelectedUser(pre => [...pre, user._id])} className='text-blue-500'>Add</button> */}
                            </div>
                        ))
                    }

                </div>
                <div className="flex gap-4">
                    <button onClick={() => setSelectedUser([])} className="px-4 py-1.5 bg-gray-200">Cancel</button>
                    <button onClick={addGroupMember} className="px-4 py-1.5 bg-gray-200">Add to Group</button>
                </div>
            </div>
        </section>
    )
}

export default AddMembers