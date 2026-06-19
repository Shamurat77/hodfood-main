import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import AddIcon from '@mui/icons-material/Add';
import EditOutlined from '@mui/icons-material/EditOutlined';
import DeleteOutlineOutlined from '@mui/icons-material/DeleteOutlineOutlined';
import CheckIcon from '@mui/icons-material/Check';
import UtensilsCrossed from '@mui/icons-material/TapasOutlined';
import { useStore } from '../../store/useStore';
import { CATEGORY_LABELS, CATEGORY_EMOJIS } from '../../data/menuData';
import type { Category } from '../../types';

const CATEGORIES: Category[] = ['hotdog', 'burger', 'snack', 'drink'];

interface EditItem { id: string; name: string; price: string; category: Category }
interface AddItem { name: string; price: string; category: Category }

export default function MenuManagement() {
  const { menuItems, addMenuItem, updateMenuItem, deleteMenuItem } = useStore();
  const [editItem, setEditItem] = useState<EditItem | null>(null);
  const [addItem, setAddItem] = useState<AddItem | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  function handleSaveEdit() {
    if (!editItem || !editItem.name || !editItem.price) return;
    updateMenuItem(editItem.id, { name: editItem.name, price: Number(editItem.price), category: editItem.category });
    setEditItem(null);
  }

  function handleSaveAdd() {
    if (!addItem || !addItem.name || !addItem.price) return;
    addMenuItem({ name: addItem.name, price: Number(addItem.price), category: addItem.category });
    setAddItem(null);
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <UtensilsCrossed color="primary" />
          <Typography fontWeight={900} fontSize="1.5rem">Menyuni tahrirlash</Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setAddItem({ name: '', price: '', category: 'hotdog' })}
          sx={{ borderRadius: 2 }}
        >
          Qo'shish
        </Button>
      </Box>

      <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 3 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: 'grey.50' }}>
              <TableCell sx={{ fontWeight: 700 }}>Mahsulot</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Kategoriya</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700 }}>Narx</TableCell>
              <TableCell align="center" sx={{ fontWeight: 700 }}>Amallar</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {menuItems.map((item) => (
              <TableRow key={item.id} hover>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Typography fontSize="1.3rem">{CATEGORY_EMOJIS[item.category]}</Typography>
                    <Typography fontWeight={600} fontSize="0.875rem">{item.name}</Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    label={CATEGORY_LABELS[item.category]}
                    size="small"
                    color="warning"
                    variant="outlined"
                    sx={{ fontWeight: 600, height: 24, fontSize: '0.7rem' }}
                  />
                </TableCell>
                <TableCell align="right">
                  <Typography fontWeight={700} color="primary" fontSize="0.875rem">
                    {item.price.toLocaleString()} so'm
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => setEditItem({ id: item.id, name: item.name, price: String(item.price), category: item.category })}
                      sx={{ bgcolor: 'primary.50' }}
                    >
                      <EditOutlined fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => setDeleteId(item.id)}
                      sx={{ bgcolor: 'error.50' }}
                    >
                      <DeleteOutlineOutlined fontSize="small" />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Edit Dialog */}
      <Dialog open={!!editItem} onClose={() => setEditItem(null)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle fontWeight={800}>Tahrirlash</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '16px !important' }}>
          <TextField label="Nomi" value={editItem?.name ?? ''} onChange={(e) => setEditItem((s) => s ? { ...s, name: e.target.value } : null)} fullWidth size="small" />
          <TextField label="Narx (so'm)" type="number" value={editItem?.price ?? ''} onChange={(e) => setEditItem((s) => s ? { ...s, price: e.target.value } : null)} fullWidth size="small" />
          <FormControl fullWidth size="small">
            <InputLabel>Kategoriya</InputLabel>
            <Select label="Kategoriya" value={editItem?.category ?? 'hotdog'} onChange={(e) => setEditItem((s) => s ? { ...s, category: e.target.value as Category } : null)}>
              {CATEGORIES.map((c) => <MenuItem key={c} value={c}>{CATEGORY_LABELS[c]}</MenuItem>)}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setEditItem(null)} color="inherit">Bekor</Button>
          <Button variant="contained" onClick={handleSaveEdit} startIcon={<CheckIcon />}>Saqlash</Button>
        </DialogActions>
      </Dialog>

      {/* Add Dialog */}
      <Dialog open={!!addItem} onClose={() => setAddItem(null)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle fontWeight={800}>Yangi mahsulot qo'shish</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '16px !important' }}>
          <TextField label="Nomi" value={addItem?.name ?? ''} onChange={(e) => setAddItem((s) => s ? { ...s, name: e.target.value } : null)} fullWidth size="small" />
          <TextField label="Narx (so'm)" type="number" value={addItem?.price ?? ''} onChange={(e) => setAddItem((s) => s ? { ...s, price: e.target.value } : null)} fullWidth size="small" />
          <FormControl fullWidth size="small">
            <InputLabel>Kategoriya</InputLabel>
            <Select label="Kategoriya" value={addItem?.category ?? 'hotdog'} onChange={(e) => setAddItem((s) => s ? { ...s, category: e.target.value as Category } : null)}>
              {CATEGORIES.map((c) => <MenuItem key={c} value={c}>{CATEGORY_LABELS[c]}</MenuItem>)}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setAddItem(null)} color="inherit">Bekor</Button>
          <Button variant="contained" color="success" onClick={handleSaveAdd} startIcon={<AddIcon />}>Qo'shish</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)} maxWidth="xs" PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle fontWeight={800}>O'chirishni tasdiqlang</DialogTitle>
        <DialogContent>
          <Typography color="text.secondary">Bu mahsulotni o'chirishni xohlaysizmi?</Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDeleteId(null)} color="inherit">Bekor</Button>
          <Button variant="contained" color="error" onClick={() => { if (deleteId) deleteMenuItem(deleteId); setDeleteId(null); }}>O'chirish</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
