import Button from '@/components/UI/Button'
import { axiosInstance } from '@/lib/axios.config'
import type { GroupWithMembers } from '@/lib/types'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'


const UpdateGroup = () => {
    const [data, setData] = useState<GroupWithMembers>({
        _id: '',
        name: "",
        members: [],
        createdBy: ''
    })

    const { groupId } = useParams()


    useEffect(() => {
        const fetchGroup = async () => {
            try {
                const res = await axiosInstance.get(`/api/group/${groupId}`)
                setData(res.data.group)
            } catch (error) {
                console.log(error)
            }
        }
        fetchGroup()

    }, [])



    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await axiosInstance.put(`/api/group/update/${groupId}`, data)
        } catch (error) {
            console.log(error)
        }
    }

    //for remove members 
    const handleRemoveMember = (memberId: string) => {
        if (data.createdBy === memberId) {
            alert("You cannot remove the group admin")
            return
        }
        setData(prev => ({
            ...prev,
            members: prev.members.filter(member => member._id !== memberId)
        }))

    }

    // const handleAddMember = (newMember: MembersType) => {
    //     setData(prev => ({ ...prev, members: [...prev.members, newMember] }))
    // }
    return (
        <section>
            <form onSubmit={handleSubmit} className='flex flex-col gap-4 bg-white p-6'>
                <div className='flex justify-center items-center gap-4'>
                    <div className='w-32 h-32 rounded-full bg-gray-300'></div>
                    <input type="name" placeholder='group name' name="name" value={data.name} onChange={(e) => setData(pre => ({ ...pre, 'name': e.target.value }))} className="flex-1" />
                </div>
                <div>
                    <div className='flex justify-between items-center'>

                        <h2 className='text-xl font-semibold font-serif '>Group members <span className='text-sm'>({data.members.length} members)</span></h2>
                        <Link to="add-members" className='text-sm font-serif hover:text-purple-400'>Add members</Link>
                    </div>
                    <div className='flex flex-col gap-2'>

                        {
                            data.members.map((m) => (
                                <div key={m._id} className='flex  items-center gap-1 relative'>

                                    <div className='w-10 h-10 rounded-full flex justify-center items-center bg-gray-300'>{m.name[0]}</div>
                                    <h2>{m.name}</h2>
                                    {
                                        data.createdBy === m._id && <span className='text-xs text-green-500'> (Admin)</span>
                                    }
                                    <button onClick={() => handleRemoveMember(m._id)} className='text-red-400'>Remove</button>
                                </div>
                            ))
                        }
                    </div>

                </div>

                <Button type='submit' text='Update' />
                {/* {
                errorMessage && <p className='text-sm text-red-400'>{errorMessage}</p>
            } */}
            </form>
        </section>
    )
}

export default UpdateGroup