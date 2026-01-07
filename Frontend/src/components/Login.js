import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, clearAuthError } from '../store/slices/authSlice';
import {
  Button,
  TextField,
  Typography,
  Box,
  CircularProgress,
  Avatar,
  Card,
  CardContent,
  InputAdornment,
  IconButton,
  Link
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useSnackbar } from 'notistack';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const auth = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  // Redirect if already logged in
  useEffect(() => {
    if (auth.token) {
      navigate('/admin');
    }
  }, [auth.token, navigate]);

  // SAFE ERROR DISPLAY: Show errors only when they are valid strings from the slice
  useEffect(() => {
    if (auth.status === 'failed' && auth.error) {
      enqueueSnackbar(auth.error, { variant: 'error' });
      // Clear error in store so it doesn't show again on re-render
      dispatch(clearAuthError());
    }
  }, [auth.status, auth.error, enqueueSnackbar, dispatch]);

  const submit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      enqueueSnackbar('Please fill all fields', { variant: 'warning' });
      return;
    }

    // Pass the local 'email' state directly to match the 'email' key in the thunk
    const res = await dispatch(login({ email, password }));

    if (res.meta.requestStatus === 'fulfilled') {
      enqueueSnackbar('Login successful', { variant: 'success' });
      navigate('/admin');
    }
    // Note: Errors are handled by the useEffect above
  };

  return (
    <Card className="auth-card">
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Avatar className="auth-avatar">
            <LockOutlinedIcon />
          </Avatar>
          <Typography variant="h6">Admin Login</Typography>
        </Box>

        <Box component="form" onSubmit={submit} noValidate>
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            margin="normal"
            required
            autoComplete="email"
          />

          <TextField
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type={showPassword ? 'text' : 'password'}
            fullWidth
            margin="normal"
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword((s) => !s)} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Box sx={{ mt: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
            <Button
              type="submit"
              variant="contained"
              disabled={auth.status === 'loading'}
              startIcon={auth.status === 'loading' ? <CircularProgress size={18} /> : null}
            >
              {auth.status === 'loading' ? 'Logging in...' : 'Login'}
            </Button>

            <Link component={RouterLink} to="/register">
              Don't have an account? Register
            </Link>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}