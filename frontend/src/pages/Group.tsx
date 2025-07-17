import Button from "@/components/UI/Button"
import { axiosInstance } from "@/lib/axios.config"
import { useState } from "react"
import { useNavigate } from "react-router-dom"


const Group = () => {
    const [data, setData] = useState({
        name: "",
    })
    const navigate = useNavigate()

    const handelSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const res = await axiosInstance.post("/api/group/create-group", data)
            if (res.status === 201) {
                setData({ name: "" })
                navigate(`/group/${res.data.group._id}`)
            }
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <form onSubmit={handelSubmit} className='flex flex-col gap-4 bg-white p-6'>
            <div>
                <input type="name" placeholder='group name' name="name" onChange={(e) => setData(pre => ({ ...pre, 'name': e.target.value }))} className='w-full ' />
            </div>

            <Button type='submit' text='Submit' />
            {/* {
                errorMessage && <p className='text-sm text-red-400'>{errorMessage}</p>
            } */}
        </form>
    )
}

export default Group