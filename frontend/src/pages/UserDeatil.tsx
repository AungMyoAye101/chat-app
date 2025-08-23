import { axiosInstance } from '@/lib/axios.config'
import type { UserType } from '@/lib/types'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import ImageUpload from '../components/ImageUpload'
import ImageBox from '@/components/ImageBox'
import { useAuth } from '@/lib/hooks/useAuth'
import UpdateForm from '@/components/UpdateForm'

const UserDeatil = () => {
    const [user, setUser] = useState<UserType>({
        _id: "",
        name: "",
        email: '',
        avatar: "",
        lastSeen: ''
    })

    const currUser = useAuth().user
    const [isOpenUploadImg, setIsOpenUploadImg] = useState(false)
    const [isUpdateBoxOpen, setIsUpdateBoxOpen] = useState(false)
    const { userId } = useParams()


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
        setIsOpenUploadImg(false)
    }

    return (
        <section className="max-w-xl mx-auto px-4 py-6 bg-white shadow-lg border border-neutral-200  mt-4 flex flex-col gap-4 ">
            <h1 className='text-xl font-semibold '>User info</h1>

            <div className='flex items-center gap-2 border-b border-b-neutral-200 py-4'>
                <ImageBox avatar={user?.avatar!} name={user?.name!} size='lg' />
                <div>
                    <h1 className='text-2xl font-bold'>{user?.name}</h1>
                    <p className='font-medium text-neutral-600'>{user?.email}</p>
                </div>
            </div>
            {
                user._id === currUser?._id ? <div className='flex gap-4 self-end'>
                    <button onClick={() => setIsOpenUploadImg(pre => !pre)} className='btn '>Add Profile</button>
                    <button onClick={() => setIsOpenUploadImg(pre => !pre)} className='btn '>Upload</button>
                    <button onClick={() => setIsOpenUploadImg(pre => !pre)} className='px-4 py-2 font-serif bg-neutral-300 rounded-lg text-red-500 '>Logout</button>


                </div> : <Link to={`/chat/user/${userId}`} className='bg-neutral-200 px-4 py-1.5 rounded-lg w-fit font-serif text-neutral-800'>Send message</Link>
            }


            {
                isOpenUploadImg && <ImageUpload id={userId!} onClose={onClose} img={user?.avatar!} type='user' />
            }
            <UpdateForm />

        </section>
    )
}

export default UserDeatil