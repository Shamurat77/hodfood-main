import { useState } from 'react';
import { useStore } from '../../store/useStore'; // O'zingizning yo'lingizni yozing
import { Box, Button, TextField, Typography, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

export default function Branches() {
  const { branchesList, addBranch, deleteBranch } = useStore();
  const [newBranchName, setNewBranchName] = useState('');

  const handleAddBranch = () => {
    if (newBranchName.trim()) {
      addBranch(newBranchName);
      setNewBranchName(''); // Qo'shgandan keyin inputni tozalaymiz
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight="bold" mb={3}>Filiallarni boshqarish</Typography>
      
      {/* Filial qo'shish qismi */}
      <Box sx={{ display: 'flex', gap: 2, mb: 4, bgcolor: 'white', p: 2, borderRadius: 2, boxShadow: 1 }}>
        <TextField 
          fullWidth 
          size="small" 
          label="Yangi filial nomi (masalan: Chilonzor filiali)" 
          value={newBranchName}
          onChange={(e) => setNewBranchName(e.target.value)}
        />
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleAddBranch}
          disabled={!newBranchName.trim()}
        >
          Qo'shish
        </Button>
      </Box>

      {/* Mavjud filiallar ro'yxati (Kardlar) */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        {branchesList.map((branch) => (
          <Box key={branch.id} sx={{ width: '48%', bgcolor: 'white', p: 3, borderRadius: 3, boxShadow: 1, position: 'relative' }}>
            
            {/* O'chirish tugmasi */}
            <IconButton 
              color="error" 
              onClick={() => deleteBranch(branch.id)}
              sx={{ position: 'absolute', top: 10, right: 10 }}
            >
              <DeleteIcon />
            </IconButton>

            <Typography variant="h6" fontWeight="bold" color="error.main" mb={2}>
              🏪 {branch.name}
            </Typography>
            
            {/* Bu yerda o'zingizning oldingi Faol/Yakunlangan/Daromad statistikangiz turadi */}
            {/* ... */}
          </Box>
        ))}
      </Box>
    </Box>
  );
}