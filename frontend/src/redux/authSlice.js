import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../utils/axiosInstance';

// Login async action
export const login = createAsyncThunk('auth/login', async (credentials, thunkAPI) => {
  try {
    const response = await axios.post('/login', credentials); // no need for { user: credentials }
    const { token, user } = response.data;
    localStorage.setItem('token', token); 
    localStorage.setItem('user', JSON.stringify(user));
    return { user, token };
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const adminLogin = createAsyncThunk('auth/adminLogin', async (credentials, thunkAPI) => {
  try {
    const response = await axios.post('/admin/login', credentials);
    const { token, user } = response.data;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    return { user, token };
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});
// Register async action
export const register = createAsyncThunk('auth/register', async (userData, thunkAPI) => {
  try {
    const response = await axios.post('/register', userData); // no need for { user: userData }
    const { token, user } = response.data;
    localStorage.setItem('token', token); 
    return { user, token };
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

// Logout async action
export const logout = createAsyncThunk('auth/logout', async () => {
  localStorage.removeItem('token'); // remove the token from localStorage
});

// Profile update async action
export const updateProfile = createAsyncThunk('auth/updateProfile', async (formData, thunkAPI) => {
  try {
    const response = await axios.put('/users', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${localStorage.getItem('token')}` // include Bearer token
      }
    });
    return response.data.user; // Assuming user data is returned
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
    loading: false,
    error: null,
    isAdmin: JSON.parse(localStorage.getItem('user'))?.admin || false, // Check admin status on load
  },
  reducers: {
    initializeAuth: (state) => {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user'));
      if (token && user) {
        state.token = token;
        state.user = user;
        state.isAdmin = user.admin === true;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        // localStorage.setItem('user', JSON.stringify(action.payload.user));
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error || 'Login failed';
      })
      .addCase(adminLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(adminLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAdmin = true;
        state.isAdmin = action.payload.user.admin === true;
        localStorage.setItem('user', JSON.stringify(action.payload.user));


      })
      .addCase(adminLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error || 'Admin login failed';
      })
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAdmin = false; // Set isAdmin to false since new users are not admins by default
        localStorage.setItem('user', JSON.stringify(action.payload.user));    
        })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error || 'Registration failed';
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      })
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload; 
        localStorage.setItem('user', JSON.stringify(action.payload));
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error || 'Profile update failed';
      });
  },
});


export const { initializeAuth } = authSlice.actions;

export default authSlice.reducer;
