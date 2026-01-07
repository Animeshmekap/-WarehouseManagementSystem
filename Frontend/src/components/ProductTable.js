import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { deleteProduct } from '../store/slices/productsSlice';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TableSortLabel, TablePagination, IconButton, Typography, Chip, Tooltip, Dialog, DialogTitle, DialogContent } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ProductForm from './ProductForm';

function applyFilter(items, q) {
  if (!q) return items;
  const s = q.toLowerCase();
  return items.filter(p => (p.name || '').toLowerCase().includes(s) || (p.company || '').toLowerCase().includes(s) || (p.delivery_partner || '').toLowerCase().includes(s));
}

export default function ProductTable({ products = [], query = '' }) {
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('name');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [edit, setEdit] = useState(null);
  const dispatch = useDispatch();

  const filtered = useMemo(() => applyFilter(products, query), [products, query]);

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const sorted = useMemo(() => {
    const list = [...filtered];
    list.sort((a, b) => {
      const av = (a[orderBy] ?? '').toString();
      const bv = (b[orderBy] ?? '').toString();
      if (order === 'asc') return av.localeCompare(bv, undefined, { numeric: true });
      return bv.localeCompare(av, undefined, { numeric: true });
    });
    return list;
  }, [filtered, order, orderBy]);

  const paged = useMemo(() => sorted.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage), [sorted, page, rowsPerPage]);

  const handleDelete = (id) => dispatch(deleteProduct(id));

  return (
    <Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel active={orderBy === 'name'} direction={order} onClick={() => handleRequestSort('name')}>Name</TableSortLabel>
              </TableCell>
              <TableCell>Company</TableCell>
              <TableCell>Delivery Partner</TableCell>
              <TableCell>
                <TableSortLabel active={orderBy === 'quantity'} direction={order} onClick={() => handleRequestSort('quantity')}>Qty</TableSortLabel>
              </TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paged.map((p) => (
              <TableRow key={p.id} sx={{ bgcolor: p.quantity < 10 ? 'rgba(244, 63, 94, 0.08)' : 'inherit' }}>
                <TableCell>
                  <Typography variant="subtitle2">{p.name}</Typography>
                  <Typography variant="caption" color="text.secondary">{p.description}</Typography>
                </TableCell>
                <TableCell>{p.company}</TableCell>
                <TableCell>{p.delivery_partner}</TableCell>
                <TableCell>{p.quantity < 10 ? <Chip label={p.quantity} color="error" /> : p.quantity}</TableCell>
                <TableCell>${p.price}</TableCell>
                <TableCell>
                  <Tooltip title="Edit"><IconButton onClick={() => setEdit(p)}><EditIcon /></IconButton></Tooltip>
                  <Tooltip title="Delete"><IconButton onClick={() => handleDelete(p.id)}><DeleteIcon color="error" /></IconButton></Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {sorted.length === 0 && <Box sx={{ p: 2 }}><Typography>No products found</Typography></Box>}
      </TableContainer>

      <TablePagination component="div" count={sorted.length} page={page} onPageChange={(e, newPage) => setPage(newPage)} rowsPerPage={rowsPerPage} onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }} />

      <Dialog open={!!edit} onClose={() => setEdit(null)} fullWidth maxWidth="sm">
        <DialogTitle>Edit Product</DialogTitle>
        <DialogContent>
          {edit && <ProductForm product={edit} onSuccess={() => setEdit(null)} />}
        </DialogContent>
      </Dialog>
    </Box>
  );
}

ProductTable.propTypes = { products: PropTypes.array, query: PropTypes.string };
