import { createAsyncThunk, createSlice, } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"
import { axiosInstance } from "../axios.config"

interface User {
    name: string,
    email: string,
    password: string,
}
interface AuthState {
    user: User | null,
    status: 'idle' | 'loading' | 'succeeded' | "failed",
    error: string | null,
}

const initialState: AuthState = {
    user: null,
    status: 'idle',
    error: null
}

//login User 
export const login = createAsyncThunk<User, { email: string, password: string }, { rejectValue: string }>(
    'auth/login',
    async (crediential, thunkApi) => {
        try {
            const res = await axiosInstance.post("/api/auth/login", crediential)
            console.log(res.data.user)
            return res.data.user
        } catch (error: any) {
            return thunkApi.rejectWithValue(error.response?.data?.message || "Login failed.")
        }
    }
)


//fetch current user
export const fetchUser = createAsyncThunk(
    'auth/fetchUser',
    async (_, thunkApi) => {
        try {
            const res = await axiosInstance.get("/api/auth/me")
            return res.data.user
        } catch (error: any) {
            return thunkApi.rejectWithValue(error.response?.data?.message || "Unauthorized.")
        }
    }
)

//logout 
export const logout = createAsyncThunk(
    'auth/logout',
    async () => {
        await axiosInstance.post('/api/auth/logout')
    }
)

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchUser.fulfilled, (state, action: PayloadAction<User>) => {
                state.user = action.payload
            })
            .addCase(login.fulfilled, (state, action: PayloadAction<User>) => {
                state.user = action.payload
                state.status = 'succeeded'
            })
            .addCase(login.rejected, (state, action) => {
                state.error = action.payload as string,
                    state.status = 'failed'
            })
            .addCase(logout.fulfilled, (state) => {
                state.user = null
            })

    }
})

export default authSlice.reducer