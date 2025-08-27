import Button from '@/components/UI/Button'
import { login } from '@/lib/auth/authSlice'
import type { AppDispatch } from '@/lib/auth/store'
import { useAuth } from '@/lib/hooks/useAuth'

import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'

interface LoginType {
    email: string,
    password: string,
}

const Login = () => {
    const { error, isLoading } = useAuth()
    const navigate = useNavigate()
    const dispatch: AppDispatch = useDispatch()
    const { register, handleSubmit, formState: { errors } } = useForm<LoginType>()

    const onSubmit = handleSubmit(async (data: LoginType) => {
        const result = await dispatch(login(data))
        if (login.fulfilled.match(result)) {
            navigate('/')
        }
    })
    return (
        <section className='mt-16 max-w-lg mx-auto '>

            <form onSubmit={onSubmit} className='flex flex-col h-fit gap-4 bg-white px-6 py-12 border border-white/10 shadow-md  mt-4 rounded-lg '>

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
                <Button type='submit' isLoading={isLoading}>{isLoading ? "Submitting..." : "Submit"}</Button>
                {
                    error && <p className='text-center bg-red-400 text-white/80 rounded-lg p-1'>{error}</p>
                }
            </form>
        </section>
    )
}

export default Login