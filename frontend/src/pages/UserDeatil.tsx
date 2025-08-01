import { axiosInstance } from '@/lib/axios.config'
import type { UserType } from '@/lib/types'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import ImageUpload from './ImageUpload'

const UserDeatil = () => {
    const [user, setUser] = useState<UserType>()
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
        <section className="container px-4 py-6 bg-white shadow-lg border border-neutral-200  mt-4 ">
            <div className='flex justify-between'>

                <div className='flex items-center gap-2'>
                    <img src={user?.avatar} alt='profile image' className='w-32 h-32 rounded-full bg-neutral-200' />
                    <div>
                        <h1 className='text-2xl font-bold'>{user?.name}</h1>
                        <p className='font-medium text-neutral-600'>{user?.email}</p>
                    </div>
                </div>
                {/* <div className='flex flex-col gap-2'>
                    <Link to={`/user/update/${userId}`} className='btn'>update</Link>
                    <Link to={`/image/upload/${userId}`} className='btn'>Upload Profile</Link>
                </div> */}
                <div>
                    <button onClick={() => setIsOpenUploadImg(pre => !pre)} className='btn '>Set Profile</button>
                </div>
            </div>
            {
                isOpenUploadImg && <ImageUpload userId={userId!} onClose={onClose} />
            }

        </section>
    )
}

export default UserDeatil