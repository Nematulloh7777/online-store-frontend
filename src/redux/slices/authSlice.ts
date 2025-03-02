import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import apiClient from '../../axios'
import { IAuthParams } from '../../types/auth';
import { IProduct } from '../../types/product';


export interface IUser {
    _id: string;
    fullName?: string;
    email: string;
    avatarUrl?: string;
    token: string;
    favorites: IProduct[];
    [key: string]: any;
}


interface AuthState {
    data: IUser | null;
    status: 'idle' | 'loading' | 'success' | 'error';
    error: { message: string } | string | null;
}

interface UpdateUserParams {
    _id: string;
    [key: string]: any;
}

const initialState: AuthState = {
    data: null,
    status: 'idle',
    error: null,
};

export const fetchLogin = createAsyncThunk<IUser, IAuthParams, { rejectValue: string }>(
    'auth/fetchLogin',
    async (params, { rejectWithValue }) => {
        try {
            const { data } = await apiClient.post<IUser>('/api/users/login', params)
            return data
        } catch (error: any) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data)
            }
            throw error
        }
    }
)

export const fetchRegister = createAsyncThunk<IUser, IAuthParams, { rejectValue: string }>(
    'auth/fetchRegister',
    async (params , { rejectWithValue }) => {
        try {
            const { data } = await apiClient.post<IUser>('/api/users/register', params)
            return data
        } catch (error: any) {
            return rejectWithValue(error.response?.data || 'Registration failed')
        }
    }
)

export const fetchMe = createAsyncThunk<IUser>('auth/fetchMe', async () => {
    const { data } = await apiClient.get<IUser>('/api/users/me')
    return data
})

export const updateUserAsync = createAsyncThunk<IUser, UpdateUserParams, { rejectValue: string }>(
    'auth/updateUser', 
    async ({_id, ...userData }, { rejectWithValue, dispatch }) => {
        try {
            const { data } = await apiClient.put<IUser>(`/api/users/${_id}`, userData)
            await dispatch(fetchMe())
            return data
        } catch (error: any) {
            return rejectWithValue(error.response?.data || 'Update user failed');
        }
    }
)

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logOut: (state) => {
            state.data = null
        },
        updateFavorites(state, action: PayloadAction<IProduct>) {
            if (!state.data) return;

            const item = action.payload;
            const index = state.data.favorites.findIndex(fav => fav._id === item._id);

            if (index !== -1) {
                // Если товар уже в избранном — удаляем
                state.data.favorites.splice(index, 1);
            } else {
                // Иначе добавляем новый товар
                state.data.favorites.push(item);
            }
        }
    },
    extraReducers: (builder) => {
        const handlePending = (state: AuthState) => {
            state.status = 'loading'
            state.error = null
        }
    
        const handleFulfilled = (state: AuthState, action: PayloadAction<IUser>) => {
            state.status = 'success'
            state.data = action.payload
            state.error = null
        }

        const handleRejected = (state: AuthState, action: any, errorMessage: string) => {
            state.status = 'error'
            state.error = action.payload || action.error.message
            console.error(errorMessage, action.error)
        }

        builder
            .addCase(fetchLogin.pending, handlePending)
            .addCase(fetchLogin.fulfilled, handleFulfilled)
            .addCase(fetchLogin.rejected, (state, action) =>
                handleRejected(state, action, 'Ошибка авторизации:')
            )

            .addCase(fetchMe.pending, handlePending)
            .addCase(fetchMe.fulfilled, handleFulfilled)
            .addCase(fetchMe.rejected, (state, action) =>
                handleRejected(state, action, 'Ошибка авторизации. Нет доступа:')
            )

            .addCase(fetchRegister.pending, handlePending)
            .addCase(fetchRegister.fulfilled, handleFulfilled)
            .addCase(fetchRegister.rejected, (state, action) =>
                handleRejected(state, action, 'Ошибка регистрации:')
            )

            .addCase(updateUserAsync.pending, handlePending)
            .addCase(updateUserAsync.rejected, (state, action) =>
                handleRejected(state, action, 'Ошибка обновления пользователя:')
            )
    },
})

export const selectIsAuth = (state: { auth: AuthState }) => Boolean(state.auth.data);

export default authSlice.reducer;

export const { logOut, updateFavorites } = authSlice.actions;
