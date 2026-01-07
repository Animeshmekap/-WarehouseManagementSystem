import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addAdmin } from '../store/slices/adminsSlice';
import { TextField, Button, Box } from '@mui/material';
import { useSnackbar } from 'notistack';

export default function AdminRegisterForm({ onDone }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) return enqueueSnackbar('Fill fields', { variant: 'warning' });
    const res = await dispatch(addAdmin({ username, password }));
    if (res.error) enqueueSnackbar(res.payload?.message || 'Failed', { variant: 'error' });
    else {
      enqueueSnackbar('Admin added', { variant: 'success' });
      onDone && onDone();
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'grid', gap: 1, width: 360 }}>
      <TextField label="Username" value={username} onChange={e => setUsername(e.target.value)} required />
      <TextField label="Password" value={password} onChange={e => setPassword(e.target.value)} type="password" required />
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Button type="submit" variant="contained">Add</Button>
      </Box>
    </Box>
  );
}
