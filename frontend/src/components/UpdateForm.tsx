import React, { useRef, type FC } from 'react'
import { useForm } from 'react-hook-form'
import Button from './UI/Button'
import { axiosInstance } from '@/lib/axios.config'
import { useDispatch } from 'react-redux'
import type { AppDispatch } from '@/lib/auth/store'
import { fetchUser } from '@/lib/auth/authSlice'
import { useAuth } from '@/lib/hooks/useAuth'

interface UpdateUserType {
    name: string,
    email: string,
}

interface UpdateUserPropType {
    onClose: () => void
}

const UpdateForm: FC<UpdateUserPropType> = ({ onClose }) => {

    const containerRef = useRef<HTMLFormElement | null>(null) // for handle click outside


    const { register, handleSubmit, formState: { errors } } = useForm<UpdateUserType>()

    const dispatch: AppDispatch = useDispatch()
    const { user } = useAuth()

    const onSubmit = handleSubmit((data) => {
        try {
            axiosInstance.put(`/api/user/update/${user?._id}`, data)
            dispatch(fetchUser())

        } catch (error) {
            console.log(error)
        }
    })

    const handleClickOutside = (e: React.MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
            onClose()
        }
    }
    return (
        <section className="absolute  flex justify-center items-center inset-0 z-50 bg-black/20" onClick={handleClickOutside}>

            <form onSubmit={onSubmit} className='bg-white border-2 border-purple-400 rounded-lg px-4 py-6 flex flex-col gap-4 min-w-xs' ref={containerRef}>
                <h1 className='text-2xl font-semibold font-serif text-center'>Update</h1>
                <div className='flex flex-col gap-1'>
                    <label htmlFor="name" className='font-medium text-neutral-600'>Name</label>
                    <input
                        type="name"
                        placeholder='name'
                        className='w-full border border-neutral-200 shadow px-4 py-2 rounded-md  bg-neutral-300'
                        {...register("name", { required: "Name is required.", minLength: { value: 1, message: "Name conatin at least 1 character." } })}
                    />
                    {
                        errors.name && <p className='text-sm text-red-500'>{errors.name.message}</p>
                    }
                </div>
                <div className='flex flex-col gap-1'>
                    <label htmlFor="email" className='font-medium text-neutral-600'>Email</label>
                    <input
                        type="email"
                        id="email"
                        placeholder='email'
                        className='w-full border border-neutral-200 shadow px-4 py-2 rounded-md bg-neutral-300 '
                        {...register("email", { required: "Email is required." })}
                    />
                    {
                        errors.email && <p className='text-sm text-red-500'>{errors.email.message}</p>
                    }
                </div>
                <Button type='submit'>update</Button>

            </form>
        </section>
    )
}

export default UpdateForm