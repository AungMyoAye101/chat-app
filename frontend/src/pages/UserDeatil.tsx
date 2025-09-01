import { axiosInstance } from '@/lib/axios.config'
import type { UserType } from '@/lib/types'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import ImageUpload from '../components/ImageUpload'
import ImageBox from '@/components/ImageBox'
import { useAuth } from '@/lib/hooks/useAuth'
import UpdateForm from '@/components/UpdateForm'
import { logout } from '@/lib/auth/authSlice'
import type { AppDispatch } from '@/lib/auth/store'
import { useDispatch } from 'react-redux'
const initialState = {
    uploadImg: false,
    updateBox: false,
}

const UserDeatil = () => {
    const [user, setUser] = useState<UserType>({
        _id: "",
        name: "",
        email: '',
        avatar: "",
        lastSeen: ''
    })

    const currUser = useAuth().user
    const [isOpen, setIsOpen] = useState(initialState)
    const { userId } = useParams()

    const dispatch: AppDispatch = useDispatch()

    const fetchUser = async () => {
        try {
            const res = await axiosInstance.get(`/api/user/${userId}`)
            setUser(res.data)
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        fetchUser()
    }, [userId, currUser])

    const onClose = () => {
        setIsOpen(initialState)
    }

    return (
        <section className=' mt-14  h-[calc(100vh-4rem)]   '>
            < div className="h-full  px-4 py-6 bg-white shadow rounded-lg  border border-neutral-200 mt-4 flex flex-col gap-4 " >
                < h1 className='text-lg font-serif text-neutral-600 font-semibold ' > User info</h1 >

                <div className='flex flex-col justify-center md:flex-row md:justify-normal items-center gap-4 border-b border-b-neutral-200 py-4'>
                    <ImageBox avatar={user?.avatar!} name={user?.name!} size='w-40 h-40 text-4xl' />
                    <div className='flex flex-col gap-2 items-center md:items-start'>
                        <h1 className='text-xl font-serif font-bold'>{user?.name}</h1>
                        <p className='font-medium text-neutral-600'>{user?.email}</p>
                    </div>
                </div>
                {
                    user._id === currUser?._id ? <div className='flex flex-wrap gap-2 md:self-end'>
                        <button onClick={() => setIsOpen(pre => ({ ...pre, updateBox: true }))} className='px-4 py-2 font-serif text-neutral-50 rounded-lg bg-purple-500 flex-1 min-w-fit '>Update Profile</button>
                        <button onClick={() => setIsOpen(pre => ({ ...pre, uploadImg: true }))} className='px-4 py-2 font-serif text-neutral-50 rounded-lg bg-purple-500 flex-1 min-w-fit '>Upload Photo</button>
                        <button onClick={() => dispatch(logout())} className='px-4 py-2 font-serif text-neutral-50 rounded-lg bg-red-500 flex-1'>Logout</button>


                    </div> : <Link to={`/chat/user/${userId}`} className='self-end bg-neutral-200 px-4 py-1.5 rounded-lg w-fit font-serif text-neutral-800'>Send message</Link>
                }


                {
                    isOpen.uploadImg && <ImageUpload id={userId!} onClose={onClose} img={user?.avatar!} type='user' />
                }
                {
                    isOpen.updateBox && <UpdateForm onClose={onClose} updateUser={user} />
                }


            </div >
        </section >
    )
}

export default UserDeatil