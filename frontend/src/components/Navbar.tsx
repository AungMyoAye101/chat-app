
import { useAuth } from '@/context/Auth.context'
import { Link } from 'react-router-dom'

const Navbar = () => {
    const user = useAuth()
    return (
        <nav className="bg-gray-200 p-4">
            <div className="container mx-auto flex justify-between items-center">

                <Link to={'/'}><div>CHAT APP</div> </Link>
                <div>{user?.name}</div>
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