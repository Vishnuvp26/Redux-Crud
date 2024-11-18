import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Thunks for handling user login, registration, and profile updates
export const registerUser = createAsyncThunk(
    'user/registerUser',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await axios.post('http://localhost:3000/api/users/register', userData, { withCredentials: true });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

export const loginUser = createAsyncThunk(
    'user/loginUser',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await axios.post('http://localhost:3000/api/users/login', userData, { withCredentials: true });
            console.log('userdata from login slice', response.data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

export const logoutUser = createAsyncThunk(
    'user/logoutUser',
    async (_, { rejectWithValue }) => {
        try {
            await axios.post('http://localhost:3000/api/users/logout', {}, { withCredentials: true });
            return;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

export const editUser = createAsyncThunk(
    'user/editUser',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await axios.put(
                'http://localhost:3000/api/users/profile',
                userData,
                { headers: { 'Content-Type': 'multipart/form-data' }, withCredentials: true }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

// User Slice
const userSlice = createSlice({
    name: 'user',
    initialState: {
        userInfo: null,
        loading: false,
        error: null,
    },
    reducers: {
        resetError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false;
                state.userInfo = action.payload;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.userInfo = action.payload;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.userInfo = null;
            })
            .addCase(editUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(editUser.fulfilled, (state, action) => {
                state.loading = false;
                state.userInfo = action.payload;
            })
            .addCase(editUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { resetError } = userSlice.actions;
export default userSlice.reducer;   