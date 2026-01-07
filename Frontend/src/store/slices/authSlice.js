import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

const initialState = {
  token: localStorage.getItem('token') || null,
  user: localStorage.getItem('username') || null,
  status: 'idle',
  error: null,
};

export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      // Sends 'email' and 'password' to FastAPI AdminLogin model
      const res = await api.post('/admins/login', { email, password });

      // Backend returns: { message: "...", admin: { email, name, ... } }
      return {
        token: 'session_active_token', 
        username: res.data.admin?.name || res.data.admin?.email || email,
      };
    } catch (err) {
      // Pass the raw FastAPI error object to the rejected case
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

export const logout = createAsyncThunk('auth/logout', async () => {
  localStorage.removeItem('token');
  localStorage.removeItem('username');
  return true;
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthError: (state) => {
      state.error = null;
      state.status = 'idle';
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.token = action.payload.token;
        state.user = action.payload.username;
        localStorage.setItem('token', action.payload.token);
        localStorage.setItem('username', action.payload.username);
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        
        // --- SAFE ERROR HANDLING ---
        const detail = action.payload?.detail;
        if (Array.isArray(detail)) {
          // Extracts "value is not a valid email" string from the Pydantic array
          state.error = detail[0].msg; 
        } else {
          // Handles string details or generic error messages
          state.error = detail || action.payload?.message || "Login failed";
        }
      })
      .addCase(logout.fulfilled, (state) => {
        state.token = null;
        state.user = null;
        state.status = 'idle';
      });
  },
});

export const { clearAuthError } = authSlice.actions;
export default authSlice.reducer;