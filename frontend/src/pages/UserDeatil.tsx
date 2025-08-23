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
    }, [userId])

    const onClose = () => {
        setIsOpen(initialState)
    }

    return (
        <section className=' mt-12 flex justify-center items-center'>


            < div className="min-w- sm w-full max-w-xl px-4 py-6 bg-white shadow rounded-lg  border border-neutral-200 mt-4 flex flex-col gap-4 " >
                < h1 className='text-lg font-serif text-neutral-600 font-semibold ' > User info</h1 >

                <div className='flex items-center gap-2 border-b border-b-neutral-200 py-4'>
                    <ImageBox avatar={user?.avatar!} name={user?.name!} size='lg' />
                    <div>
                        <h1 className='text-lg font-serif font-bold'>{user?.name}</h1>
                        <p className='font-medium text-neutral-600'>{user?.email}</p>
                    </div>
                </div>
                {
                    user._id === currUser?._id ? <div className='flex gap-4 self-end'>
                        <button onClick={() => setIsOpen(pre => ({ ...pre, updateBox: true }))} className='btn '>Add Profile</button>
                        <button onClick={() => setIsOpen(pre => ({ ...pre, uploadImg: true }))} className='btn '>Upload</button>
                        <button onClick={() => dispatch(logout())} className='px-4 py-2 font-serif text-neutral-50 rounded-lg bg-red-500 '>Logout</button>


                    </div> : <Link to={`/chat/user/${userId}`} className='self-end bg-neutral-200 px-4 py-1.5 rounded-lg w-fit font-serif text-neutral-800'>Send message</Link>
                }


                {
                    isOpen.uploadImg && <ImageUpload id={userId!} onClose={onClose} img={user?.avatar!} type='user' />
                }
                {
                    isOpen.updateBox && <UpdateForm onClose={onClose} />
                }


            </div >
        </section >
    )
}

export default UserDeatil