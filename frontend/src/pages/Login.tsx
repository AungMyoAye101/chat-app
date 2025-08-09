import Button from '@/components/UI/Button'
import { axiosInstance } from '@/lib/axios.config'
import { useState } from 'react'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'

interface LoginType {
    email: string,
    password: string,
}

const Login = () => {
    // const [data, setData] = useState({
    //     email: '',
    //     password: ''
    // })
    const [errorMessage, setErrorMessage] = useState('')
    const navigate = useNavigate()

    const { register, handleSubmit, formState: { errors } } = useForm<LoginType>()

    const onSubmit = handleSubmit(async (data: LoginType) => {
        console.log(data)
        try {
            const res = await axiosInstance.post("/api/auth/login", data)
            console.log(res.data.user)
            navigate('/')
        } catch (error: any) {
            console.log(error)
            setErrorMessage(error.response.data.message)

        }
    })
    return (
        <form onSubmit={onSubmit} className='flex flex-col gap-4 bg-white p-6 border border-neutral-200 shadow-md max-w-2xl mx-auto mt-4 rounded-lg'>

            <h1 className='text-2xl font-semibold font-serif text-center'>Login</h1>
            <div className='flex flex-col gap-1'>
                <label htmlFor="email" className='font-medium text-neutral-600'>Email</label>
                <input
                    type="email"
                    id="email"
                    placeholder='email'
                    className='w-full border border-neutral-200 shadow px-4 py-2 rounded '
                    {...register("email", { required: "Email is required." })}
                />
                {
                    errors.email && <p className='text-sm text-red-500'>{errors.email.message}</p>
                }
            </div>
            <div className='flex flex-col gap-1'>
                <label htmlFor="password" className='font-medium text-neutral-600'>Password</label>
                <input
                    type="password"
                    placeholder='password'
                    className='w-full border border-neutral-200 shadow px-4 py-2 rounded '
                    {...register("password", { required: "Password is required.", minLength: { value: 6, message: "Password conatin at least 6 characters." } })}
                />
                {
                    errors.password && <p className='text-sm text-red-500'>{errors.password.message}</p>
                }
            </div>
            <Link to='/register' className='text-sm font-medium opacity-60 hover:text-purple-600'>Create new account?</Link>
            <Button type='submit'>Submit</Button>
            {
                errorMessage && <p className='text-sm text-red-400'>{errorMessage}</p>
            }
        </form>
    )
}

export default Login