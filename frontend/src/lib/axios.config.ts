import axios from "axios";

export const axiosFetch = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    withCredentials: true
})
