import Button from "@/components/UI/Button"
import { axiosInstance } from "@/lib/axios.config"
import type { UserType } from "@/lib/types"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"


const AddMembers = () => {
    const [users, setusers] = useState<UserType[]>([])
    const [selectedUser, setSelectedUser] = useState<string[]>([])
    const [searchUser, setSearchUser] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const { groupId } = useParams()

    const navigate = useNavigate()

    useEffect(() => {
        const fetchAvailableUser = async () => {
            console.log("Fetching available users...")
            setIsLoading(true)
            try {
                const res = await axiosInstance.get(`/api/group/check-available-user/${groupId}?name=${searchUser}`)
                setusers(res.data.avaliableUser)
            } catch (error) {
                console.log(error)
            } finally {
                setIsLoading(false)
            }
        }

        const intervalId = setTimeout(() => {
            fetchAvailableUser()
        }, 500) // Fetch every 5 seconds
        return () => clearTimeout(intervalId) // Cleanup on unmount
    }, [searchUser, groupId])

    const addGroupMember = async () => {
        if (selectedUser.length < 1) return

        try {
            const res = await axiosInstance.put(`/api/group/${groupId}/add-members?`, { memberId: selectedUser })
            if (res.status === 200) {
                navigate('/group/' + groupId)
            }
            // Optionally, you can update the state to reflect the new member added 

        } catch (error) {
            console.log(error)
        }
    }

    return (
        <section className=''>
            <div className='flex flex-col gap-4' >
                <form className='flex w-full gap-4'>
                    <input type="text" className='flex-1' onChange={e => setSearchUser(e.target.value)} />
                    <Button type="submit" text="Search" />
                </form>
                <div className='flex flex-col  border gap-1 '>
                    {
                        isLoading ? <div>Loading...</div> : users.map((user) => (
                            <div key={user._id} className={`flex items-center justify-between px-4 py-1  cursor-pointer ${selectedUser.includes(user._id) ? 'bg-blue-400' : 'bg-blue-50'}`} onClick={() => setSelectedUser(pre => pre.includes(user._id) ? pre.filter(id => id !== user._id) : [...pre, user._id])}>

                                <div className='flex items-center gap-2'>
                                    <div className='w-10 h-10 rounded-full bg-gray-300 flex justify-center items-center'>{user.name[0]}</div>
                                    <span>{user.name}</span>
                                </div>
                                {
                                    selectedUser.includes(user._id) ? <span className='text-white'>Selected</span> : <span className='text-green-500'>Select</span>
                                }

                            </div>
                        ))
                    }

                </div>
                <div className="flex gap-4">
                    <button onClick={() => setSelectedUser([])} className="px-4 py-1.5 bg-gray-200">Cancel</button>
                    <button onClick={addGroupMember} className="px-4 py-1.5 bg-green-400 text-white">Add to Group</button>
                </div>
            </div>
        </section>
    )
}

export default AddMembers