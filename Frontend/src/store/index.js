import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import productsReducer from './slices/productsSlice';
import adminsReducer from './slices/adminsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productsReducer,
    admins: adminsReducer,
  },
});

export default store;
