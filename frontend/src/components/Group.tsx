import { axiosInstance } from '@/lib/axios.config'
import type { GroupTypes } from '@/lib/types'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const Group = ({ setSelectedGroup }: { setSelectedGroup: () => void }) => {
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


    return (
        <section>
            <div>
                <h1 className='text-lg font-semibold'>Group</h1>
                <div>
                    {
                        data.map((g) => (
                            <div key={g._id} className='flex px-4 py-2 bg-neutral-200 border border-white'>
                                <Link to={`/group/${g._id}`} className='flex items-center gap-2'>

                                    <div className='w-6 h-6 rounded-full bg-blue-400'></div>
                                </Link>
                                <div onClick={() => setSelectedGroup(g)} className='cursor-pointer bg-blue-100 w-full'>

                                    <h2>{g.name}</h2>
                                </div>


                            </div>
                        ))
                    }
                </div>
            </div>
        </section>
    )
}

export default Group