import { axiosInstance } from '@/lib/axios.config'
import type { GroupTypes } from '@/lib/types'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

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

            <h1 className='text-lg font-semibold px-4'>Group</h1>
            <div>
                {
                    data.map((g) => (
                        <Link to={`/chat/group/${g._id}`} key={g._id} className='flex items-center gap-3 px-4 py-2 cursor-pointer hover:bg-gray-200 font-serif'>

                            {
                                g.avatar ? <img src={g.avatar} alt={g.name + "avatar photo"} className='w-12 h-12 rounded-full bg-gray-300 object-cover' /> : <div className='w-12 h-12 rounded-full bg-blue-400 flex justify-center items-center text-lg capitalize text-white' >{g.name[0]}</div>
                            }




                            <h2 className='text-lg font-medium'>{g.name}</h2>



                        </Link>
                    ))
                }
            </div>

        </section>
    )
}

export default GroupList