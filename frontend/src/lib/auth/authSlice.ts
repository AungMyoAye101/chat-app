import { createAsyncThunk, createSlice, } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"
import { axiosInstance } from "../axios.config"
import type { UserType } from "../types"


interface AuthState {
    user: UserType | null,
    status: 'idle' | 'loading' | 'succeeded' | "failed",
    error: string | null,
}

const initialState: AuthState = {
    user: null,
    status: 'idle',
    error: null
}

//register user

export const register = createAsyncThunk<UserType, { name: string, email: string, password: string }, { rejectValue: string }>(
    'auth/register',
    async (crediential, thunkApi) => {
        try {
            const res = await axiosInstance.post("/api/auth/register", crediential,
            )
            console.log(res.data.user)
            return res.data.user

        } catch (error: any) {
            return thunkApi.rejectWithValue(error.response.data.message || "Register failed.")
        }
    }
)

//login User 
export const login = createAsyncThunk<UserType, { email: string, password: string }, { rejectValue: string }>(
    'auth/login',
    async (crediential, thunkApi) => {
        try {
            const res = await axiosInstance.post("/api/auth/login", crediential)
            console.log(res.data.user)
            return res.data.user
        } catch (error: any) {
            console.log(error)
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
            console.log(res.data)
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
            .addCase(register.fulfilled, (state, action: PayloadAction<UserType>) => {
                state.user = action.payload
                state.status = 'succeeded'
            })
            .addCase(register.rejected, (state, action) => {
                state.error = action.payload as string
                state.status = "failed"
            })
            .addCase(fetchUser.fulfilled, (state, action: PayloadAction<UserType>) => {
                state.user = action.payload
            })
            .addCase(login.fulfilled, (state, action: PayloadAction<UserType>) => {
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