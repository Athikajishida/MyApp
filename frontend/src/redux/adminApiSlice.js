import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../utils/axiosInstance';

export const fetchUsers = createAsyncThunk('admin/fetchUsers', async (_, thunkAPI) => {
  try {
    const response = await axios.get('/admin/users');
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const blockUser = createAsyncThunk('admin/blockUser', async (userId, thunkAPI) => {
  try {
    const response = await axios.post(`/admin/users/${userId}/block`);
    return { userId, message: response.data.message };
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const unblockUser = createAsyncThunk('admin/unblockUser', async (userId, thunkAPI) => {
  try {
    const response = await axios.post(`/admin/users/${userId}/unblock`);
    return { userId, message: response.data.message };
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const updateUser = createAsyncThunk('admin/updateUser', async ({ userId, userData }, thunkAPI) => {
  try {
    const response = await axios.put(`/admin/users/${userId}`, userData);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const deleteUser = createAsyncThunk('admin/deleteUser', async (userId, thunkAPI) => {
  try {
    await axios.delete(`/admin/users/${userId}`);
    return userId;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

const adminApiSlice = createSlice({
  name: 'adminApi',
  initialState: {
    users: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(blockUser.fulfilled, (state, action) => {
        const user = state.users.find(u => u.id === action.payload.userId);
        if (user) user.blocked = true;
      })
      .addCase(unblockUser.fulfilled, (state, action) => {
        const user = state.users.find(u => u.id === action.payload.userId);
        if (user) user.blocked = false;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        const index = state.users.findIndex(u => u.id === action.payload.id);
        if (index !== -1) state.users[index] = action.payload;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter(u => u.id !== action.payload);
      });
  },
});

export default adminApiSlice.reducer;