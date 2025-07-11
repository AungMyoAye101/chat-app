import Button from '@/components/UI/Button'
import { axiosInstance } from '@/lib/axios.config'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Login = () => {
    const [data, setData] = useState({
        email: '',
        password: ''
    })
    const [errorMessage, setErrorMessage] = useState('')
    const navigate = useNavigate()
    const handleSubmit = async (e: any) => {
        e.preventDefault()
        console.log("click")
        try {
            const res = await axiosInstance.post("/api/auth/login", data)
            console.log(res.data.user)
            navigate('/')
        } catch (error: any) {
            console.log(error)
            setErrorMessage(error.response.data.message)

        }
    }
    return (
        <form onSubmit={handleSubmit} className='flex flex-col gap-4 bg-white p-6'>
            <div>
                <input type="email" placeholder='email' name="email" onChange={(e) => setData(pre => ({ ...pre, [e.target.name]: e.target.value }))} className='w-full ' />
            </div>
            <div>
                <input type="password" placeholder='password' name='password' onChange={(e) => setData(pre => ({ ...pre, [e.target.name]: e.target.value }))} className='w-full ' />
            </div>
            <Button type='submit' text='Submit' />
            {
                errorMessage && <p className='text-sm text-red-400'>{errorMessage}</p>
            }
        </form>
    )
}

export default Login