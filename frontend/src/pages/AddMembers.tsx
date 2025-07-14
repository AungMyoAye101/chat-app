import { axiosInstance } from "@/lib/axios.config"
import type { UserType } from "@/lib/types"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"


const AddMembers = () => {
    const [users, setusers] = useState<UserType[]>([])
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

    return (
        <section className=''>
            <div className='flex flex-col gap-4' >
                <div className='flex w-full gap-4'><input type="text" className='flex-1' /><button>search</button></div>
                <div className='flex flex-col  border '>
                    {
                        users.map((user) => (
                            <div key={user._id} className='flex items-center justify-between px-4 py-1 hover:bg-gray-200 cursor-pointer'>

                                <div className='flex items-center gap-2'>
                                    <div className='w-10 h-10 rounded-full bg-gray-300 flex justify-center items-center'>{user.name[0]}</div>
                                    <span>{user.name}</span>
                                </div>
                                <button className='text-blue-500'>Add</button>
                            </div>
                        ))
                    }

                </div>
            </div>
        </section>
    )
}

export default AddMembers