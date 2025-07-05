import { axiosInstance } from '@/lib/axios.config'
import { useState } from 'react'

const Login = () => {
    const [data, setData] = useState({
        email: '',
        password: ''
    })
    const handleSubmit = async (e: any) => {
        e.preventDefault()
        try {
            const res = await axiosInstance.post("/api/auth/login", data)
            console.log(res.data.user)
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <form onSubmit={handleSubmit}>
            <div>
                <input type="email" placeholder='email' name="email" onChange={(e) => setData(pre => ({ ...pre, [e.target.name]: e.target.value }))} />
            </div>
            <div>
                <input type="password" placeholder='password' name='password' onChange={(e) => setData(pre => ({ ...pre, [e.target.name]: e.target.value }))} />
            </div>
            <button type='submit'>Submit</button>
        </form>
    )
}

export default Login