import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { addProduct, updateProduct } from '../store/slices/productsSlice';
import { Button, TextField, Box } from '@mui/material';
import { useSnackbar } from 'notistack';

export default function ProductForm({ onSuccess, product }) {
  const [name, setName] = useState(product?.name || '');
  const [description, setDescription] = useState(product?.description || '');
  const [price, setPrice] = useState(product?.price ?? '');
  const [quantity, setQuantity] = useState(product?.quantity ?? '');
  const [company, setCompany] = useState(product?.company || '');
  const [delivery, setDelivery] = useState(product?.delivery_partner || '');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (product) {
      setName(product.name || '');
      setDescription(product.description || '');
      setPrice(product.price ?? '');
      setQuantity(product.quantity ?? '');
      setCompany(product.company || '');
      setDelivery(product.delivery_partner || '');
    }
  }, [product]);

  const submit = async (e) => {
    e.preventDefault();
    if (!name || !price || quantity === '') return enqueueSnackbar('Please fill required fields', { variant: 'warning' });
    setLoading(true);
    try {
      const body = { name, description, price: parseFloat(price), quantity: parseInt(quantity || '0'), company, delivery_partner: delivery };
      let res;
      if (product) res = await dispatch(updateProduct({ id: product.id, body }));
      else res = await dispatch(addProduct(body));

      if (res.error) {
        enqueueSnackbar(res.payload?.message || res.error.message || 'Failed', { variant: 'error' });
      } else {
        enqueueSnackbar(product ? 'Product updated' : 'Product added', { variant: 'success' });
        if (!product) { setName(''); setDescription(''); setPrice(''); setQuantity(''); setCompany(''); setDelivery(''); }
        onSuccess && onSuccess();
      }
    } catch (err) {
      enqueueSnackbar(String(err), { variant: 'error' });
    } finally { setLoading(false); }
  };

  return (
    <Box component="form" onSubmit={submit} sx={{ display: 'grid', gap: 1 }}>
      <TextField label="Product name" value={name} onChange={e=>setName(e.target.value)} required />
      <TextField label="Description" value={description} onChange={e=>setDescription(e.target.value)} multiline rows={2} />
      <TextField label="Price" type="number" value={price} onChange={e=>setPrice(e.target.value)} required />
      <TextField label="Quantity" type="number" value={quantity} onChange={e=>setQuantity(e.target.value)} required />
      <TextField label="Company" value={company} onChange={e=>setCompany(e.target.value)} />
      <TextField label="Delivery partner" value={delivery} onChange={e=>setDelivery(e.target.value)} />
      <Box sx={{ mt: 1 }}>
        <Button type="submit" variant="contained" disabled={loading}>{loading ? 'Saving...' : (product ? 'Update' : 'Save Product')}</Button>
      </Box>
    </Box>
  );
}
