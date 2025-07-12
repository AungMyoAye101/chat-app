import { axiosInstance } from '@/lib/axios.config'
import type { GroupTypes } from '@/lib/types'
import { useEffect, useState } from 'react'

const Group = () => {
    const [data, setData] = useState<GroupTypes[]>([])
    useEffect(() => {
        const fetchGroup = async () => {
            try {
                const res = await axiosInstance.get('/api/groups')
                setData(res.data.groups)
            } catch (error) {
                console.log(error)
            }

        }
        fetchGroup()
    }, [])


    return (
        <section>
            <div>
                <h1 className='text-lg font-semibold'>Group</h1>
                <div>
                    {
                        data.map((g) => (
                            <div key={g._id} className='flex px-4 py-2 bg-neutral-200 border border-white'>
                                <div className='w-6 h-6 rounded-full bg-blue-400'></div>
                                <h2>{g.name}</h2>
                            </div>
                        ))
                    }
                </div>
            </div>
        </section>
    )
}

export default Group