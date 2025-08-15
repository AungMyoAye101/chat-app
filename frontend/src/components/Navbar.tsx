
import { useAuth } from '@/context/Auth.context'
import { logout } from '@/lib/helper'
import { Link } from 'react-router-dom'
import ImageBox from './ImageBox'
import Button from './UI/Button'
import { useEffect, useRef, useState, type ReactNode } from 'react'



const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const user = useAuth()

    const dropDownRef = useRef<HTMLDivElement | null>(null)
    const handleClickOutside = (e: MouseEvent) => {
        if (dropDownRef.current && !dropDownRef.current.contains(e.target as Node)) {
            setIsMenuOpen(false)
        }
    }

    useEffect(() => {

        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])

    return (
        <nav className="bg-white shadow border border-neutral-100 p-4 sticky top-0 left-0 right-0 z-40 h-16 flex justify-between items-center" >


            <Link to={'/'}>
                <h1 className='text-2xl font-serif font-bold text-neutral-700'>Chat app</h1>
            </Link>

            <div className='relative' ref={dropDownRef}>


                <button
                    onClick={() => setIsMenuOpen(pre => !pre)}
                    className='cursor-pointer bg-white  rounded-full p-1 shadow border border-neutral-200'>
                    <img src="/icons/menu.svg" alt="menu icon" className='w-6' />
                </button>

                {
                    isMenuOpen && <div className='absolute mt-4 right-0 w-60 py-6 px-4 rounded-lg bg-white shadow border border-neutral-200 flex flex-col  '>
                        {
                            user?._id ? <>
                                <Link to={`/user/` + user._id} className='flex items-center gap-2  hover:bg-neutral-200 cursor-pointer rounded-lg py-1.5 px-2'>
                                    <ImageBox avatar={user?.avatar!} name={user?.name!} size='md' />
                                    <h2 className='font-medium'>{user.name}</h2>
                                </Link>

                                <Link to={"/create-group"} className=' hover:bg-neutral-200 py-1.5 px-2 rounded-lg font-sm flex items-center gap-3 font-serif '> <img src="/icons/create.svg" alt="create icon " className='w-10 bg-gray-200 p-2 rounded-full' />Create Group</Link>
                                <Button type='button' func={logout} className='text-red-400 justify-normal px-2 py-1.5 bg-white gap-3 hover:bg-neutral-200 font-serif  '> <img src="/icons/logout-1.svg" alt="logout icon" className='w-10 bg-gray-200 p-2 rounded-full' />Logout</Button>
                            </> :
                                <>
                                    <Link to={"/register"} className=' hover:bg-neutral-200 py-1.5 px-2 rounded-lg font-sm flex items-center gap-3 font-serif '> <img src="/icons/user.svg" alt="register icon " className='w-10 bg-gray-200 p-2 rounded-full' />Register</Link>
                                    <Link to={"/login"} className=' hover:bg-neutral-200 py-1.5 px-2 rounded-lg font-sm flex items-center gap-3 font-serif '> <img src="/icons/login.svg" alt="login icon " className='w-10 bg-gray-200 p-2 rounded-full' />Login</Link>


                                </>
                        }


                    </div>
                }
            </div>

        </nav>
    )
}

export default Navbar