import { axiosInstance } from '@/lib/axios.config'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Register = () => {
    const [data, setData] = useState({
        name: '',
        email: '',
        password: ''
    })
    const navigate = useNavigate()
    const handleSubmit = async (e: any) => {
        e.preventDefault()
        try {
            const res = await axiosInstance.post("/api/auth/register", data)
            navigate('/')
        } catch (error) {
            if (error instanceof Error) console.log(error.message)
        }
    }
    return (
        <form onSubmit={handleSubmit} className='bg-white p-4 flex flex-col gap-4 '>
            <div>
                <input type="name" placeholder='name' name="name" onChange={(e) => setData(pre => ({ ...pre, name: e.target.value }))} />
            </div>
            <div>
                <input type="email" placeholder='email' name="email" onChange={(e) => setData(pre => ({ ...pre, email: e.target.value }))} />
            </div>
            <div>
                <input type="password" placeholder='password' name='password' onChange={(e) => setData(pre => ({ ...pre, password: e.target.value }))} />
            </div>
            <button type='submit' className='bg-blue-400 px-4 py-2'>Submit</button>
        </form>
    )
}

export default Register