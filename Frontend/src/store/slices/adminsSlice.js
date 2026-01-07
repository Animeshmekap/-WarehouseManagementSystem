import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

const initialState = { items: [], status: 'idle', error: null };

// --- Thunks ---

export const fetchAdmins = createAsyncThunk(
  'admins/fetchAdmins',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/admins');
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

export const addAdmin = createAsyncThunk(
  'admins/addAdmin',
  async (payload, { rejectWithValue }) => {
    try {
      const res = await api.post('/admins/register', payload);
      return res.data; 
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

// ADD THIS SECTION: The missing deleteAdmin export
export const deleteAdmin = createAsyncThunk(
  'admins/deleteAdmin',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/admins/${id}`);
      return id; // Return the ID so we can remove it from state
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

// --- Slice ---

const adminsSlice = createSlice({
  name: 'admins',
  initialState,
  reducers: {
    clearAdminError: (state) => { state.error = null; state.status = 'idle'; }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdmins.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload || [];
      })
      .addCase(addAdmin.fulfilled, (state, action) => {
        state.status = 'succeeded';
        if (action.payload.admin) state.items.push(action.payload.admin);
      })
      // ADD THIS SECTION: Handle the state update after deletion
      .addCase(deleteAdmin.fulfilled, (state, action) => {
        state.items = state.items.filter((admin) => admin.id !== action.payload);
      })
      // Error handling for all rejected cases
      .addMatcher(
        (action) => action.type.endsWith('/rejected'),
        (state, action) => {
          state.status = 'failed';
          const detail = action.payload?.detail;
          state.error = Array.isArray(detail) ? detail[0].msg : (detail || action.payload?.message || "Action failed");
        }
      );
  }
});

export const { clearAdminError } = adminsSlice.actions;
export default adminsSlice.reducer;