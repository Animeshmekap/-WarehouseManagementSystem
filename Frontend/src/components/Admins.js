import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdmins, deleteAdmin } from '../store/slices/adminsSlice';
import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AdminRegisterForm from './AdminRegisterForm';

export default function Admins() {
  const dispatch = useDispatch();
  const admins = useSelector(state => state.admins.items);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchAdmins());
  }, [dispatch]);

  return (
    <div>
      <Typography variant="h5" gutterBottom>
        Admins
      </Typography>

      <Button
        variant="contained"
        onClick={() => setOpen(true)}
        sx={{ mb: 2 }}
      >
        Add Admin
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Email</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {admins.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  No admins found
                </TableCell>
              </TableRow>
            ) : (
              admins.map(admin => (
                <TableRow key={admin.id}>
                  <TableCell>{admin.email}</TableCell>
                  <TableCell>{admin.name || '-'}</TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => dispatch(deleteAdmin(admin.id))}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Admin</DialogTitle>
        <DialogContent>
          <AdminRegisterForm
            onDone={() => {
              setOpen(false);
              dispatch(fetchAdmins());
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
