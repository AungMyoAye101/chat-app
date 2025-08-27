
import { axiosInstance } from '@/lib/axios.config'
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import type { GroupTypes } from './GroupDeatil'
import ImageBox from '@/components/ImageBox'
import ImageUpload from '@/components/ImageUpload'


const UpdateGroup = () => {
    const [data, setData] = useState<GroupTypes>({
        _id: "",
        name: "",
        createdBy: { _id: '', name: "" },
        members: [],
        avatar: ''
    })
    const [isImageBoxOpen, setIsImageBoxOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const { groupId } = useParams()

    const navogate = useNavigate()


    useEffect(() => {
        const fetchGroup = async () => {
            try {
                const res = await axiosInstance.get(`/api/group/${groupId}`)
                setData(res.data.group)
            } catch (error) {
                console.log(error)
            }
        }
        fetchGroup()

    }, [])



    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            const res = await axiosInstance.put(`/api/group/update/${groupId}`, data)
            if (res.status === 200) {
                navogate(`/group/${groupId}`)
            }
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }

    //for remove members 
    const handleRemoveMember = (memberId: string) => {
        if (data.createdBy._id === memberId) {
            alert("You cannot remove the group admin")
            return
        }
        setData(prev => ({
            ...prev,
            members: prev.members.filter(member => member._id !== memberId)
        }))

    }

    return (
        <section className='mt-14'>
            <form onSubmit={handleSubmit} className='flex flex-col gap-4 h-[calc(100vh-4rem)]  bg-white p-6 rounded-lg'>
                <div className='flex  items-center gap-4'>
                    {/* <div>
                        <div className='group w-32 h-32 rounded-full bg-gray-300 relative overflow-hidden'>
                            <img src="/vite.svg" alt="group profile " className='w-full h-full object-cover' />
                            <label htmlFor="file-upload" className='group-hover:flex hidden absolute inset-0 z-10 bg-blue-200  justify-center items-center'>
                                Upload
                                <input type="file" id='file-upload' className='hidden' />
                            </label>

                        </div>

                    </div> */}
                    <div className='relative'>

                        <ImageBox avatar={data.avatar} name={data.name} size="xl" />
                        <button type='button' onClick={() => setIsImageBoxOpen(true)} className='absolute -right-1 top-[60%] bg-green-500 z-50 w-8 h-8 rounded-full text-lg flex justify-center items-center text-white'>+</button>
                    </div>

                    <input type="name" placeholder='group name' name="name" value={data.name} onChange={(e) => setData(pre => ({ ...pre, 'name': e.target.value }))} className=" border-b border-neutral-400 py-2 px-4 " />
                </div>



                {
                    isImageBoxOpen && <ImageUpload type="group" id={data._id} img={data.avatar} onClose={() => setIsImageBoxOpen(false)} />
                }
                <div className="flex justify-between items-center  p-4">

                    <h2 className="text-xl font-semibold font-serif">Members</h2>
                    <Link to={`/group/update/${groupId}/add-members`} className="bg-green-500  text-white px-4 py-1.5 rounded-md ">Add members</Link>
                </div>

                <div className="flex-1 overflow-hidden overflow-y-scroll flex flex-col gap-4 p-4 scroll-smooth">

                    {
                        data.members.map((m) => (
                            <div key={m._id} className='flex  justify-between   px-4 py-1 gap-1 relative hover:bg-purple-200'>
                                <div className='flex gap-4 items-center'>

                                    <ImageBox avatar={m.avatar!} name={m.name} size="md" />

                                    <div className="font-sans">
                                        <h1 className="text-lg font-semibold ">{m.name}
                                            {
                                                m._id === data.createdBy._id && <span className="text-sm text-green-500"> (Admin)</span>
                                            }
                                        </h1>

                                    </div>
                                </div>

                                <button onClick={() => handleRemoveMember(m._id)} className='text-red-400 '>Remove</button>
                            </div>
                        ))
                    }
                </div>

                <button disabled={isLoading} className='px-4 py-2 bg-orange-400 text-white rounded-lg self-end'>{isLoading ? "Updating" : "Update"}</button>

            </form>
        </section>
    )
}

export default UpdateGroup