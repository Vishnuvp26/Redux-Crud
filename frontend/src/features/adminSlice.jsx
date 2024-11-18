import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Admin Login
export const adminLogin = createAsyncThunk(
    'admin/adminLogin',
    async (adminData, { rejectWithValue }) => {
        try {
            const response = await axios.post('http://localhost:3000/api/admin/login', adminData, { withCredentials: true });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

// Fetch All Users (for Admin)
export const getAllUsers = createAsyncThunk(
    'admin/getAllUsers',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get('http://localhost:3000/api/admin/users', { withCredentials: true });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

const adminSlice = createSlice({
    name: 'admin',
    initialState: {
        users: [],
        adminInfo: null,
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
            .addCase(adminLogin.pending, (state) => {
                state.loading = true;
            })
            .addCase(adminLogin.fulfilled, (state, action) => {
                state.loading = false;
                state.adminInfo = action.payload;
            })
            .addCase(adminLogin.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(getAllUsers.pending, (state) => {
                state.loading = true;
            })
            .addCase(getAllUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.users = action.payload;
            })
            .addCase(getAllUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { resetError } = adminSlice.actions;
export default adminSlice.reducer;