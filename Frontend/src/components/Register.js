import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addAdmin } from '../store/slices/adminsSlice';
import { Button, TextField, Typography, Box, Avatar, Card, CardContent, InputAdornment, IconButton } from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [name, setName] = useState(''); // Added to match AdminCreate
  const [email, setEmail] = useState(''); // Changed from username to match AdminBase
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validate required fields
    if (!email || !password) return enqueueSnackbar('Email and Password are required', { variant: 'warning' });
    
    try {
      // Sending payload as { email, name, password } to match your backend Pydantic model
      const res = await dispatch(addAdmin({ email, name, password }));
      
      if (res.error) {
        enqueueSnackbar(res.payload?.message || res.error.message || 'Registration failed', { variant: 'error' });
      } else {
        enqueueSnackbar('Admin registered, redirecting to login...', { variant: 'success' });
        setTimeout(() => navigate('/login'), 1000);
      }
    } catch (err) {
      enqueueSnackbar(String(err), { variant: 'error' });
    }
  };

  return (
    <Card className="auth-card">
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Avatar className="auth-avatar"><PersonAddIcon /></Avatar>
          <Typography variant="h6">Register Admin</Typography>
        </Box>

        <Box component="form" onSubmit={handleSubmit} noValidate>
          {/* New Name field for AdminBase schema */}
          <TextField 
            label="Full Name" 
            value={name} 
            onChange={e => setName(e.target.value)} 
            fullWidth 
            margin="normal" 
          />

          <TextField 
            label="Email" 
            type="email"
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            fullWidth 
            margin="normal" 
            required 
          />

          <TextField
            label="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            type={showPassword ? 'text' : 'password'}
            fullWidth
            margin="normal"
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(s => !s)} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Box sx={{ mt: 2 }}>
            <Button type="submit" variant="contained" fullWidth>
              Register
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}