
import { Link } from 'react-router-dom'
import ImageBox from './ImageBox'
import Button from './UI/Button'
import { useEffect, useRef, useState, } from 'react'
import { useAuth } from '@/lib/hooks/useAuth'
import type { AppDispatch } from '@/lib/auth/store'
import { useDispatch } from 'react-redux'
import { logout } from '@/lib/auth/authSlice'
import Search from './Search'



const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const { user } = useAuth()
    const dropDownRef = useRef<HTMLDivElement | null>(null)
    const handleClickOutside = (e: MouseEvent) => {
        if (dropDownRef.current && !dropDownRef.current.contains(e.target as Node)) {
            setIsMenuOpen(false)
        }
    }

    const dispatch: AppDispatch = useDispatch()

    useEffect(() => {

        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])


    const handleCLose = () => {
        setIsMenuOpen(false)
    }
    return (
        <nav className="max-w-7xl mx-auto  px-4  fixed top-0 left-0 right-0 z-40" >
            <div className='flex justify-between items-center bg-white border-b border-neutral-300 px-4 py-2 rounded-lg '>

                <Link to={'/'}>
                    <h1 className='text-2xl font-serif font-bold text-neutral-700'>Chat</h1>
                </Link>

                <div className='flex items-center gap-4'>
                    {user?._id &&
                        <Link to={`/user/` + user?._id} >
                            <ImageBox avatar={user?.avatar!} name={user?.name!} size='md' className='' />
                        </Link>
                    }

                    <div className='relative' ref={dropDownRef}>


                        <button
                            onClick={() => setIsMenuOpen(pre => !pre)}
                            className='cursor-pointer bg-white  rounded-full p-1 shadow border border-neutral-200'>
                            <img src="/icons/menu.svg" alt="menu icon" className='w-8' />
                        </button>


                        {
                            isMenuOpen && <div className='absolute mt-2 right-0 w-60 py-6 px-4 z-10 rounded-lg bg-white shadow border border-purple-400 flex flex-col gap-1 '>
                                {
                                    user?._id ? <>
                                        <Link
                                            to={`/user/` + user._id}
                                            className='flex items-center gap-2  hover:bg-purple-200 cursor-pointer rounded-lg py-1.5 px-2'
                                            onClick={handleCLose}
                                        >
                                            <ImageBox avatar={user?.avatar!} name={user?.name!} size='md' />
                                            <h2 className='font-medium'>{user.name}</h2>
                                        </Link>

                                        <Link
                                            to={"/create-group"}
                                            className=' nav-link-btn hover:bg-purple-200 '
                                            onClick={handleCLose}
                                        >
                                            <img src="/icons/create.svg" alt="create icon " className='w-10 bg-gray-200 p-2 rounded-full' />
                                            Create Group
                                        </Link>
                                        <Button type='button' func={() => { dispatch(logout()); setIsMenuOpen(false) }} className=' justify-start gap-2 bg-inherit text-red-500 border border-neutral-200 py-1 px-2'> <img src="/icons/logout-1.svg" alt="logout icon" className='w-10 bg-gray-200 p-2 rounded-full' />Logout</Button>
                                    </> :
                                        <>
                                            <Link to={"/register"}
                                                onClick={handleCLose}
                                                className=' nav-link-btn hover:bg-purple-200 '> <img src="/icons/user.svg" alt="register icon " className='w-10 bg-gray-200 p-2 rounded-full' />Register</Link>
                                            <Link to={"/login"}
                                                onClick={handleCLose}
                                                className='nav-link-btn hover:bg-purple-200 '> <img src="/icons/login.svg" alt="login icon " className='w-10 bg-gray-200 p-2 rounded-full' />Login</Link>


                                        </>
                                }


                            </div>
                        }

                    </div>
                </div>
            </div>


        </nav >
    )
}

export default Navbar