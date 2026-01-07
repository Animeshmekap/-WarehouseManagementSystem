import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

const initialState = {
  items: [],
  status: 'idle',
  error: null,
};

export const fetchProducts = createAsyncThunk('products/fetchProducts', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/Products');
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || { message: err.message });
  }
});

export const addProduct = createAsyncThunk('products/addProduct', async (payload, { rejectWithValue }) => {
  try {
    const res = await api.post('/Products', payload);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || { message: err.message });
  }
});

export const updateProduct = createAsyncThunk('products/updateProduct', async ({ id, body }, { rejectWithValue }) => {
  try {
    const res = await api.put(`/Products?id=${id}`, body);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || { message: err.message });
  }
});

export const deleteProduct = createAsyncThunk('products/deleteProduct', async (id, { rejectWithValue }) => {
  try {
    const res = await api.delete(`/Products?id=${id}`);
    return { id };
  } catch (err) {
    return rejectWithValue(err.response?.data || { message: err.message });
  }
});

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProducts(state, action) {
      state.items = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload || [];
      })
      .addCase(fetchProducts.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload?.message || action.error.message; })
      .addCase(addProduct.fulfilled, (state, action) => { /* product added — could push, but backend returns new list */ })
      .addCase(updateProduct.fulfilled, (state, action) => { /* no-op here; refetch or optimistic update can be used */ })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.items = state.items.filter(p => p.id !== action.payload.id);
      });
  }
});

export const { setProducts } = productsSlice.actions;
export default productsSlice.reducer;
