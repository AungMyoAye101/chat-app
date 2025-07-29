import { axiosInstance } from '@/lib/axios.config'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface RegisterType {
    name: string,
    email: string,
    password: string,
    avater: File

}

const Register = () => {
    const [data, setData] = useState<RegisterType>({
        name: '',
        email: '',
        password: '',
        avater: undefined as unknown as File
    })
    const [status, setStatus] = useState<{ isLoading: boolean, errorMessage: string }>({
        isLoading: false,
        errorMessage: ''
    })
    const navigate = useNavigate()
    const handleSubmit = async (e: any) => {
        e.preventDefault()
        setStatus(pre => ({ ...pre, isLoading: true }))
        try {
            const res = await axiosInstance.post("/api/auth/register", data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            })
            console.log(res.data)
            navigate('/')
        } catch (error) {
            if (error instanceof Error) {
                console.log(error.message);
                setStatus(pre => ({ ...pre, errorMessage: error.message }))
            }
        } finally {
            setStatus(pre => ({ ...pre, isLoading: false }))
        }
    }
    return (
        <form onSubmit={handleSubmit} className='bg-white p-4 flex flex-col gap-4 '>
            {
                status.errorMessage && <p>{status.errorMessage}</p>
            }
            <div>
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                        const file = e.target.files && e.target.files[0] ? e.target.files[0] : undefined;
                        setData(pre => ({ ...pre, avater: file as File }));
                    }}
                />
            </div>
            <div>
                <input type="name" placeholder='name' name="name" onChange={(e) => setData(pre => ({ ...pre, name: e.target.value }))} />
            </div>
            <div>
                <input type="email" placeholder='email' name="email" onChange={(e) => setData(pre => ({ ...pre, email: e.target.value }))} />
            </div>
            <div>
                <input type="password" placeholder='password' name='password' onChange={(e) => setData(pre => ({ ...pre, password: e.target.value }))} />
            </div>
            <button type='submit' className='bg-blue-400 px-4 py-2'>{status.isLoading ? "submiting..." : "submit"}</button>
        </form>
    )
}

export default Register