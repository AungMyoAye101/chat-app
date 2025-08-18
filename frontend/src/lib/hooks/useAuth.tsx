
import { useSelector } from 'react-redux'
import type { RootState } from '../auth/store'

export const useAuth = () => {
    return useSelector((state: RootState) => state.auth)
}


