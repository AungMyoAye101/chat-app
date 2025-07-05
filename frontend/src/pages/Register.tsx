import { axiosInstance } from '@/lib/axios.config'
import React, { useState } from 'react'

const Register = () => {
    const [data, setData] = useState({
        name: '',
        email: '',
        password: ''
    })
    const handleSubmit = async (e: any) => {
        e.preventDefault()
        try {
            const res = await axiosInstance.post("/api/auth/register", data)
            console.log("register ", res.data)
        } catch (error) {
            console.log(error.message)
        }
    }
    return (
        <form onSubmit={handleSubmit} className='bg-white p-2 border space-y-4'>
            <div>
                <input type="name" placeholder='name' name="name" onChange={(e) => setData(pre => ({ ...pre, name: e.target.value }))} />
            </div>
            <div>
                <input type="email" placeholder='email' name="email" onChange={(e) => setData(pre => ({ ...pre, email: e.target.value }))} />
            </div>
            <div>
                <input type="password" placeholder='password' name='password' onChange={(e) => setData(pre => ({ ...pre, password: e.target.value }))} />
            </div>
            <button type='submit'>Submit</button>
        </form>
    )
}

export default Register