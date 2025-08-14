import Button from '@/components/UI/Button'
import { axiosInstance } from '@/lib/axios.config'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

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

    const [status, setStatus] = useState<{ isLoading: boolean, errorMessage: string }>({
        isLoading: false,
        errorMessage: ''
    })
    const navigate = useNavigate()

    const { register, handleSubmit, formState: { errors } } = useForm<RegisterType>()
    const onSubmit = handleSubmit(async (data) => {

        setStatus(pre => ({ ...pre, isLoading: true }))

        try {
            const res = await axiosInstance.post("/api/auth/register", data, {
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
    })


    return (
        <section className='container flex justify-center mt-4'>

            <form onSubmit={onSubmit} className=' shadow-xl rounded-lg border border-neutral-100 bg-white  px-4 py-6 flex flex-col gap-4 min-w-xs w-full max-w-xl'>

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
                                {...register(field.name as keyof RegisterType, { required: "Name is required.", minLength: { value: 3, message: "Name at least 3 characters long." } })} />

                            {
                                errors?.[field.name as keyof RegisterType] && <p className='text-red-400 text-sm'>{errors[field.name as keyof RegisterType]?.message}</p>
                            }
                        </div>
                    ))
                }



                <Button type='submit' isLoading={status.isLoading}>{status.isLoading ? "Creating" : "Create"}</Button>


                {
                    status.errorMessage && <p className='text-red-400  text-center '>{status.errorMessage}</p>
                }
            </form>
        </section >
    )
}

export default Register