import Button from '@/components/UI/Button'
import { axiosInstance } from '@/lib/axios.config'
import type { GroupTypes } from '@/lib/types'
import React, { use, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

interface MembersType {
    _id: string;
    name: string;
    avatar?: string;
}


const UpdateGroup = () => {
    const [data, setData] = useState<GroupTypes>({
        _id: '',
        name: "",
        members: [],
        createdBy: ''
    })
    const { groupId } = useParams()
    console.log(groupId)

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
    }, [groupId])


    const handleSubmit = async () => {
        try {
            const res = await axiosInstance.put("/api/group/update/", data)
            console.log(res.data.result)
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <section>
            <form onSubmit={handleSubmit} className='flex flex-col gap-4 bg-white p-6'>
                <div>
                    <input type="name" placeholder='group name' name="name" onChange={(e) => setData(pre => ({ ...pre, 'name': e.target.value }))} className='w-full ' />
                </div>
                {
                    data.members.map((m) => (
                        <div key={m._id} className='flex flex-col items-center gap-1'>
                            <div className='w-6 h-6 rounded-full flex justify-center items-center bg-blue-400'>{m.name[0]}</div>
                            <h2>{m.name}</h2>
                        </div>
                    ))
                }

                <Button type='submit' text='Update' />
                {/* {
                errorMessage && <p className='text-sm text-red-400'>{errorMessage}</p>
            } */}
            </form>
        </section>
    )
}

export default UpdateGroup