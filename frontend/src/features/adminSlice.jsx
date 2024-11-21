import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Admin Login
export const adminLogin = createAsyncThunk(
    'admin/adminLogin',
    async (adminData, { rejectWithValue }) => {
        try {
            const response = await axios.post('http://localhost:3000/api/admin/login', adminData, { withCredentials: true });
            localStorage.setItem('adminInfo', JSON.stringify(response.data)); // Store admin info in localStorage
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

// Fetch All Users
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

// Edit User
export const editUser = createAsyncThunk(
    'admin/editUser',
    async ({ id, userData }, { rejectWithValue }) => {
        try {
            const response = await axios.put(`http://localhost:3000/api/admin/users/${id}`, userData,
                { withCredentials: true });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

// Create User
export const createUser = createAsyncThunk(
    'admin/createUser',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await axios.post('http://localhost:3000/api/admin/users', userData, { withCredentials: true });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

// Delete User
export const deleteUser = createAsyncThunk(
    'admin/deleteUser',
    async (id, { rejectWithValue }) => {
        try {
            const response = await axios.delete(`http://localhost:3000/api/admin/users/${id}`, { withCredentials: true });
            return { id };
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

const adminSlice = createSlice({
    name: 'admin',
    initialState: {
        users: [],
        adminInfo: localStorage.getItem('adminInfo') 
            ? JSON.parse(localStorage.getItem('adminInfo'))
            : null,
        loading: false,
        error: null,
    },
    reducers: {
        resetError: (state) => {
            state.error = null;
        },
        logoutAdmin: (state) => {
            state.adminInfo = null;
            localStorage.removeItem('adminInfo'); // Remove from localStorage
        },
    },
    extraReducers: (builder) => {
        builder
            // Admin Login
            .addCase(adminLogin.pending, (state) => {
                state.loading = true;
            })
            .addCase(adminLogin.fulfilled, (state, action) => {
                state.loading = false;
                state.adminInfo = action.payload;
                state.error = null;
            })
            .addCase(adminLogin.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Fetch All Users
            .addCase(getAllUsers.pending, (state) => {
                state.loading = true;
            })
            .addCase(getAllUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.users = action.payload;
                state.error = null;
            })
            .addCase(getAllUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Edit User
            .addCase(editUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(editUser.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.users.findIndex(user => user._id === action.payload._id);
                if (index !== -1) {
                    state.users[index] = action.payload;
                }
                state.error = null;
            })
            .addCase(editUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Add user
            .addCase(createUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(createUser.fulfilled, (state, action) => {
                state.loading = false;
                state.users.push(action.payload);
                state.error = null;
            })
            .addCase(createUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Delete User
            .addCase(deleteUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.loading = false;
                state.users = state.users.filter(user => user._id !== action.payload.id);
                state.error = null;
            })
            .addCase(deleteUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { resetError, logoutAdmin } = adminSlice.actions;
export default adminSlice.reducer;