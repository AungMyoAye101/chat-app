import { axiosInstance } from '@/lib/axios.config'
import type { UserType } from '@/lib/types'
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

const auth = createContext<UserType | null>(null)

const AuthContext = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<UserType>({
        _id: '',
        name: "",
        email: "",
        lastSeen: "",
        avatar: ''
    })
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
    return (<auth.Provider value={user}>{children}</auth.Provider>
    )
}
export const useAuth = () => {
    const user = useContext(auth)
    return user
}
export default AuthContext