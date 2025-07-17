import { useAuth } from '@/context/Auth.context'
import React from 'react'
import { Link } from 'react-router-dom'

const CurrentUser = () => {
    const user = useAuth()
    return (
        <section className='border border-gray-200 px-4 py-1'>
            <div className='flex items-center gap-2'>
                <Link to={`/user/${user?._id}`} className='w-12 h-12 rounded-full bg-neutral-200'></Link>
                <h2>{user?.name}</h2>
            </div>
        </section>
    )
}

export default CurrentUser