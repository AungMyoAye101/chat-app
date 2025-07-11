import Button from "@/components/UI/Button"
import { axiosInstance } from "@/lib/axios.config"
import { useState } from "react"


const Group = () => {
    const [data, setData] = useState({
        name: "",
    })

    const handelSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const res = await axiosInstance.post("/api/groups/create-group", data)
            console.log(res.data)
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