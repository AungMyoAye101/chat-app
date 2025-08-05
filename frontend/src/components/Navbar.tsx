
import { useAuth } from '@/context/Auth.context'
import { Link } from 'react-router-dom'

const Navbar = () => {
    const user = useAuth()
    return (
        <nav className="bg-gray-200 p-4 sticky top-0 left-0 right-0 z-40 opacity-15">
            <div className="container mx-auto flex justify-between items-center">

                <Link to={'/'}><div>CHAT APP</div> </Link>
                <Link to={`/user/${user?._id}`} className='flex '>

                    <img src={user?.avatar || '/vite.svg'} alt="" className='w-6 h-6 ' />
                    <div>{user?.name}</div>
                </Link>
                <div className='flex gap-4 '>
                    <Link to={'/register'}>register</Link>
                    <Link to={'/login'}>Login</Link>
                    <Link to={"/create-group"}>Create Group</Link>
                </div>
            </div>
        </nav>
    )
}

export default Navbar