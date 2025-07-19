import { axiosInstance } from '@/lib/axios.config'
import type { GroupTypes } from '@/lib/types'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

const GroupList = () => {
    const [data, setData] = useState<GroupTypes[]>([])

    const { groupId } = useParams()
    useEffect(() => {
        const fetchGroup = async () => {
            try {
                const res = await axiosInstance.get('/api/group')
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
                            <Link to={`/chat/group/${groupId}`} key={g._id} className='flex px-4 py-2 cursor-pointer hover:bg-gray-200'>


                                <div className='w-6 h-6 rounded-full bg-blue-400'></div>

                                <div>

                                    <h2>{g.name}</h2>


                                </div>
                            </Link>
                        ))
                    }
                </div>
            </div>
        </section>
    )
}

export default GroupList