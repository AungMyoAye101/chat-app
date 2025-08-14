
import { useAuth } from '@/context/Auth.context'
import { logout } from '@/lib/helper'
import { Link } from 'react-router-dom'
import ImageBox from './ImageBox'
import Button from './UI/Button'
import { useState } from 'react'



const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const user = useAuth()


    return (
        <nav className="bg-white shadow border border-neutral-100 p-4 sticky top-0 left-0 right-0 z-40 h-16 flex justify-between items-center">


            <Link to={'/'}>
                <h1 className='text-2xl font-serif font-bold text-neutral-700'>Chat app</h1>
            </Link>

            <div className='relative'>


                <button
                    onClick={() => setIsMenuOpen(pre => !pre)}
                    className='cursor-pointer bg-white  rounded-full p-1 shadow border border-neutral-200'>
                    <img src="/icons/menu.svg" alt="menu icon" className='w-8' />
                </button>

                {
                    isMenuOpen && <div className='absolute right-0 w-40 py-6 px-4 rounded-lg bg-white shadow-2xl flex flex-col gap-1 '>
                        {
                            user?._id ? <>
                                <Link to={`/user/` + user._id} className='flex items-center gap-1 justify-end bg-neutral-100 hover:bg-purple-100 cursor-pointer rounded-lg'>
                                    <h2 className='font-medium'>{user.name}</h2>
                                    <ImageBox avatar={user?.avatar!} name={user?.name!} size='md' />
                                </Link>

                                <Link to={"/create-group"} className='link-btn'>Create Group</Link>
                                {/* <Button type='button' func={logout} className='text-sm flex justify-center items-center gap-2'><img src="/icons/" alt="logout icon" className='w-6' />Logout</Button> */}
                            </> :
                                <>
                                    <Link to={'/register'} className='link-btn'>register</Link>
                                    <Link to={'/login'} className='link-btn'>Login</Link>

                                </>
                        }


                    </div>
                }
            </div>

        </nav>
    )
}

export default Navbar