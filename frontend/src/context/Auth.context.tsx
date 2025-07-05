import { axiosInstance } from '@/lib/axios.config'
import { createContext, useEffect, useState, type ReactNode } from 'react'
interface UserType {
    name: string,
    email: string,
    avatar?: string
}
const auth = createContext<UserType | null>(null)

const AuthContext = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<UserType | null>(null)
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await axiosInstance.get("/api/auth/me")
                setUser(res.data.user)
            } catch (error) {
                console.log(error)
            }
        }
        checkAuth()
    }, [])
    console.log(user)

    return (<auth.Provider value={user}>{children}</auth.Provider>
    )
}

export default AuthContext