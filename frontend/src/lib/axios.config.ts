import axios from "axios";
import { useEffect, useState } from "react";

export const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    withCredentials: true
})

export const useFetch = (api: string) => {
    const [data, setData] = useState()
    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    useEffect(() => {
        const fetchAPi = async () => {
            setLoading(true)
            try {
                const res = await axiosInstance(api)
                setData(res.data)

            } catch (error) {
                if (error instanceof Error) {

                    setErrorMessage(error.message)
                }
            } finally {
                setLoading(false)
            }
        }
        fetchAPi()
    }, [])

    return { data, loading, errorMessage }
}
