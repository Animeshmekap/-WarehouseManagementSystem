import React from 'react';
import { Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from './store/slices/authSlice';
import Register from './components/Register';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import Admins from './components/Admins';
import { AppBar, Toolbar, IconButton, Typography, Button, Box } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

export default function App({ toggleTheme, themeMode }) {
  const auth = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/login');
  };

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }} component={Link} to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            📦 Warehouse Management 🚛
          </Typography>

          <IconButton color="inherit" onClick={toggleTheme} sx={{ mr: 1 }}>
            {themeMode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>

          {!auth.token && <Button color="inherit" component={Link} to="/login">Login</Button>}
          {!auth.token && <Button color="inherit" component={Link} to="/register">Register</Button>}
          {auth.token && <Button color="inherit" component={Link} to="/admin">Dashboard</Button>}
          {auth.token && <Button color="inherit" component={Link} to="/admin/admins">Admins</Button>}
          {auth.token && <Button color="inherit" onClick={handleLogout}>Logout</Button>}
        </Toolbar>
      </AppBar>

      <Box sx={{ p: 2 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={auth.token ? <AdminDashboard /> : <Navigate to="/login" replace />} />
          <Route path="/admin/admins" element={auth.token ? <Admins /> : <Navigate to="/login" replace />} />
        </Routes>
      </Box>
    </div>
  );
}

function Home() {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 4, flexDirection: { xs: 'column', md: 'row' }, p: 4, mt: 2 }}>
      <Box sx={{ flex: 1, maxWidth: 720 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
          Warehouse Management made simple
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
          Our Warehouse Management System streamlines inventory control, product tracking, and delivery management with an intuitive, real-time dashboard. Admins can efficiently add, update, and monitor products, manage users, and generate insights. Designed for speed, accuracy, and ease-of-use, it optimizes warehouse operations, reduces errors, and improves overall logistics efficiency.        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="contained" component={Link} to="/login">Login</Button>
          <Button variant="outlined" component={Link} to="/register">Register</Button>
        </Box>
      </Box>

      <Box sx={{ width: 520, display: { xs: 'none', md: 'block' } }}>
        <Box className="hero-media" sx={{ position: 'relative', overflow: 'hidden', borderRadius: 2, height: 320 }}>
          <img
            src="/images/warehouse-welcome.jpg"
            alt="Warehouse welcome"
            className="hero-img"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/images/welcome.svg'; }}
          />

          <Box className="hero-overlay" sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(2,6,23,0.07), rgba(2,6,23,0.02))' }} />
        </Box>
      </Box>
    </Box>
  );
}

