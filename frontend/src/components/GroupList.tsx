import { axiosInstance } from '@/lib/axios.config'
import type { GroupTypes } from '@/lib/types'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import ImageBox from './ImageBox'

const GroupList = () => {
    const [data, setData] = useState<GroupTypes[]>([])

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

    if (data.length === 0) return
    return (
        <section className='py-2' >
            <div>
                {
                    data.map((g) => (
                        <Link to={`/chat/group/${g._id}`} key={g._id} className='flex items-center justify-between gap-3 px-4 py-2 cursor-pointer hover:bg-purple-200 font-serif'>
                            <div className='flex items-center gap-2'>
                                <ImageBox avatar={g.avatar} name={g.name} size='md' />
                                <h2 className=' font-medium line-clamp-1'>{g.name}</h2>
                            </div>
                            <img src="/icons/group-icon.svg" alt="group icon" className='w-7' />
                        </Link>
                    ))
                }
            </div>

        </section>
    )
}

export default GroupList