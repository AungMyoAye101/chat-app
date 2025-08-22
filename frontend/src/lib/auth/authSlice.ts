import { createAsyncThunk, createSlice, } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"
import { axiosInstance } from "../axios.config"
import type { UserType } from "../types"


interface AuthState {
    user: UserType | null,
    isLoading: boolean,
    error: string | null,
}

const initialState: AuthState = {
    user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user") as string) : null,
    isLoading: false,
    error: null
}

//register user

export const register = createAsyncThunk<UserType, { name: string, email: string, password: string }, { rejectValue: string }>(
    'auth/register',
    async (crediential, thunkApi) => {
        try {
            const res = await axiosInstance.post("/api/auth/register", crediential,
            )
            const { user } = res.data
            localStorage.setItem("user", JSON.stringify(user))
            return user

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
            const { user } = res.data
            localStorage.setItem("user", JSON.stringify(user))
            return user
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
            const { user } = res.data
            localStorage.setItem("user", JSON.stringify(user))
            return user
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
        localStorage.removeItem('user')
    }
)

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(register.pending, (state) => {
                state.isLoading = true
            })
            .addCase(register.fulfilled, (state, action: PayloadAction<UserType>) => {
                state.user = action.payload
                state.isLoading = false

            })
            .addCase(register.rejected, (state, action) => {
                state.error = action.payload as string
                state.isLoading = false
            })
            .addCase(fetchUser.pending, (state) => {
                state.isLoading = true
            })
            .addCase(fetchUser.fulfilled, (state, action: PayloadAction<UserType>) => {
                state.user = action.payload
                state.isLoading = false
            })
            .addCase(fetchUser.rejected, (state) => {

                state.isLoading = false
            })
            .addCase(login.pending, (state) => {
                state.isLoading = true
            })
            .addCase(login.fulfilled, (state, action: PayloadAction<UserType>) => {
                state.user = action.payload
                state.isLoading = false
            })
            .addCase(login.rejected, (state, action) => {
                state.error = action.payload as string
                state.isLoading = false
            })
            .addCase(logout.fulfilled, (state) => {
                state.user = null
            })

    }
})

export default authSlice.reducer