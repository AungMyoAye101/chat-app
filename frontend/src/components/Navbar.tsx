
import { useAuth } from '@/context/Auth.context'
import { logout } from '@/lib/helper'
import { Link } from 'react-router-dom'
import ImageBox from './ImageBox'
import Button from './UI/Button'



const Navbar = () => {
    const user = useAuth()

    return (
        <nav className="bg-white shadow border border-neutral-100 p-4 sticky top-0 left-0 right-0 z-40 h-16 flex justify-between items-center">


            <Link to={'/'}>
                <h1 className='text-2xl font-serif font-bold text-neutral-700'>Chat app</h1>
            </Link>

            <div className='flex gap-1 justify-center items-center'>
                <Link to={'/register'} className='link-btn'>register</Link>
                <Link to={'/login'} className='link-btn'>Login</Link>
                <Link to={"/create-group"} className='link-btn'>Create Group</Link>

                <Button type='button' func={logout}>Logout</Button>
                <ImageBox avatar={user?.avatar!} name={user?.name!} size='md' />
            </div>

        </nav>
    )
}

export default Navbar