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
        <section className='mt-14'>
            <div className='flex flex-col gap-4 h-[calc(100vh-4rem)]  bg-white p-6 rounded-lg' >

                <form className='w-full flex bg-neutral-200 rounded-full overflow-hidden'>
                    <input
                        type="text"

                        className='flex-1 px-4 py-2  text-neutral-700 '
                        placeholder='Search user name'
                        onChange={e => setSearchUser(e.target.value)}
                    />
                    <button className='py-2 px-4 '><img src="/icons/maginifying-glass-icon.svg" alt="search icon" className='w-5 bg-transparent' /></button>
                </form>
                <div className=' flex-1 flex flex-col  border border-neutral-200 rounded-md bg-neutral-50 gap-1 justify-center items-center '>


                    {
                        isLoading ? <div className="w-14 h-14 rounded-full border-4 border-purple-500 border-r-transparent animate-spin"></div> : users.length === 0 ? <div className="font-semibold text-lg ">No user found.</div> : users.map((user) => (
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
                <div className="self-end flex gap-4">
                    <button onClick={() => setSelectedUser([])} className="px-4 py-1.5 bg-gray-300 rounded-md">Cancel</button>
                    <button onClick={addGroupMember} className="px-4 py-1.5 bg-green-400 text-white rounded-md">Add to Group</button>
                </div>
            </div>
        </section>
    )
}

export default AddMembers