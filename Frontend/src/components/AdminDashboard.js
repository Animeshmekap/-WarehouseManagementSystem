import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../store/slices/productsSlice';
import { fetchAdmins } from '../store/slices/adminsSlice';
import ProductForm from './ProductForm';
import ProductTable from './ProductTable';
import { Box, Paper, Typography, Grid, TextField, CircularProgress, Button } from '@mui/material';
import Alert from '@mui/material/Alert';

export default function AdminDashboard() {
  const dispatch = useDispatch();
  const productsState = useSelector((s) => s.products);
  const adminsState = useSelector((s) => s.admins);
  const [q, setQ] = useState('');

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchAdmins());
    const intv = setInterval(() => dispatch(fetchProducts()), 10000); // poll every 10s
    return () => clearInterval(intv);
  }, [dispatch]);

  const lowStockCount = useMemo(() => productsState.items.filter(p => p.quantity < 10).length, [productsState.items]);

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Admin Dashboard</Typography>

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} sm={4}>
          <Paper sx={{ p: 2 }}>
            <Typography>Total products</Typography>
            <Typography variant="h6">{productsState.items.length}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper sx={{ p: 2 }}>
            <Typography>Active admins</Typography>
            <Typography variant="h6">{adminsState.items.length}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper sx={{ p: 2 }}>
            <Typography>Low stock (&lt;10)</Typography>
            <Typography variant="h6" color={lowStockCount ? 'error' : 'textPrimary'}>{lowStockCount}</Typography>
          </Paper>
        </Grid>
      </Grid>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField label="Search products" value={q} onChange={e => setQ(e.target.value)} fullWidth />
          <Button onClick={() => dispatch(fetchProducts())}>Refresh</Button>
        </Box>
      </Paper>

      {productsState.status === 'loading' ? (
        <Box sx={{ textAlign: 'center', p: 4 }}><CircularProgress /></Box>
      ) : productsState.error ? (
        <Alert severity="error">{productsState.error}</Alert>
      ) : (
        <ProductTable products={productsState.items} query={q} />
      )}

      <Box sx={{ mt: 3 }}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6">Create Product</Typography>
          <ProductForm onSuccess={() => dispatch(fetchProducts())} />
        </Paper>
      </Box>
    </Box>
  );
}
