import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../utils/axiosInstance';

export const fetchUsers = createAsyncThunk('users/fetchUsers', async (_, thunkAPI) => {
  try {
    const response = await axios.get('/admin/users', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },

    });
    

    return response.data;

  } catch (error) {
    return thunkAPI.rejectWithValue(error.response);
  }
});

export const blockUser = createAsyncThunk('users/blockUser', async (userId, thunkAPI) => {
  try {
    const response = await axios.patch(`/admin/users/${userId}/block`, {}, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data.user;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

const userSlice = createSlice({
  name: 'users',
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error || 'Failed to fetch users';
      })
      .addCase(blockUser.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.list.findIndex(user => user.id === action.payload.id);
        if (index !== -1) {
          state.list[index] = action.payload; // Update the blocked status of the user
        }
      })
      .addCase(blockUser.rejected, (state, action) => {
        state.error = action.payload.error || 'Failed to block user';
      });
  },
});

export default userSlice.reducer;
