import Button from '@/components/UI/Button'
import { register as signup } from '@/lib/auth/authSlice'
import type { AppDispatch } from '@/lib/auth/store'
import { useAuth } from '@/lib/hooks/useAuth'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'

export interface RegisterType {
    name: string,
    email: string,
    password: string,

}
export const inputData = [{
    name: "name",
    label: "name",
    placeholder: "John Doe",
    type: "text",
    validation: { required: "Name is required.", minLength: { value: 3, message: "Name at least 3 characters long." } }

}, {
    name: "email",
    label: "email",
    placeholder: "example@gmail.com",
    type: "email",
    validation: { required: "Email is required.", }

}, {
    name: "password",
    label: "password",
    placeholder: "Enter your password.",
    type: "password",
    validation: { required: "Password is required.", minLength: { value: 6, message: "Password at least 3 characters long." } }

},

]



const Register = () => {


    const dispatch: AppDispatch = useDispatch()
    const { isLoading, error } = useAuth()
    const navigate = useNavigate()

    const { register, handleSubmit, formState: { errors } } = useForm<RegisterType>()
    const onSubmit = handleSubmit(async (data) => {

        const result = await dispatch(signup(data))
        if (signup.fulfilled.match(result)) {
            navigate('/')
        }
    })


    return (
        <section className='container flex justify-center mt-16'>

            <form onSubmit={onSubmit} className=' shadow rounded-lg border border-white/20 bg-white  px-6 py-12 flex flex-col gap-4 min-w-xs w-full max-w-lg'>

                <h1 className='text-2xl font-bold font-serif text-center'>Signup </h1>
                {
                    inputData.map((field, i) => (
                        <div key={i} className='flex flex-col gap-1'>
                            <label htmlFor={field.name} className='capitalize font-medium text-neutral-600 '> {field.label}</label>
                            <input
                                type={field.type}
                                id={field.name}
                                placeholder={field.placeholder}
                                className='shadow border border-neutral-200 px-4 py-1.5 rounded-lg'
                                {...register(field.name as keyof RegisterType, field.validation)} />

                            {
                                errors?.[field.name as keyof RegisterType] && <p className='text-red-400 text-sm' >{errors[field.name as keyof RegisterType]?.message}</p>
                            }
                        </div>
                    ))
                }


                <Link to={'/login'} className='text-sm font-medium opacity-60 hover:text-purple-600'>Already have an account? Login</Link>
                <Button type='submit' isLoading={isLoading}>{isLoading ? "Creating" : "Create"}</Button>


                {
                    error && <p className='bg-red-400 text-white/90 p-1 rounded-lg'>{error}</p>
                }
            </form>
        </section >
    )
}

export default Register