import { axiosInstance } from '@/lib/axios.config'
import type { UserType } from '@/lib/types'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import ImageUpload from '../components/ImageUpload'
import ImageBox from '@/components/ImageBox'
import { useAuth } from '@/lib/hooks/useAuth'

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
                user._id === currUser?._id ? <div>
                    <button onClick={() => setIsOpenUploadImg(pre => !pre)} className='btn '>Set Profile</button>
                </div> : <button>Send message</button>
            }


            {
                isOpenUploadImg && <ImageUpload id={userId!} onClose={onClose} img={user?.avatar!} type='user' />
            }

        </section>
    )
}

export default UserDeatil