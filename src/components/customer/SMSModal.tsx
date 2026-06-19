import { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import Paper from '@mui/material/Paper';
import { motion } from 'framer-motion';
import SmsOutlined from '@mui/icons-material/SmsOutlined';
import { useStore } from '../../store/useStore';

export default function SMSModal() {
  const { smsModalOpen, smsCode, confirmSMS, pendingOrder } = useStore();
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);

  const phoneDisplay = pendingOrder?.phone ?? '+998 XX XXX XX XX';

  function handleConfirm() {
    const ok = confirmSMS(input);
    if (!ok) {
      setAttempts((a) => a + 1);
      setError(`Noto'g'ri kod. Qayta urinib ko'ring.`);
      setInput('');
    } else {
      setInput('');
      setError('');
      setAttempts(0);
    }
  }

  return (
    <Dialog
      open={smsModalOpen}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        component: motion.div,
        initial: { scale: 0.8, opacity: 0 },
        animate: { scale: 1, opacity: 1 },
        sx: { borderRadius: 4 },
      }}
    >
      <DialogTitle sx={{ textAlign: 'center', pb: 0, pt: 3 }}>
        <Box
          sx={{
            width: 64, height: 64, borderRadius: '50%', mx: 'auto', mb: 2,
            background: 'linear-gradient(135deg, #E60000, #FF6B00)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <SmsOutlined sx={{ color: '#fff', fontSize: 28 }} />
        </Box>
        <Typography fontWeight={800} fontSize="1.2rem">SMS Kodni kiriting</Typography>
      </DialogTitle>

      <DialogContent sx={{ px: 3, pb: 1 }}>
        <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mb: 3 }}>
          {phoneDisplay} raqamiga 4 xonali kod yuborildi
        </Typography>

        <TextField
          fullWidth
          value={input}
          onChange={(e) => { setInput(e.target.value.replace(/\D/g, '').slice(0, 4)); setError(''); }}
          placeholder="_ _ _ _"
          inputProps={{
            maxLength: 4,
            style: { textAlign: 'center', fontSize: '2rem', fontWeight: 800, letterSpacing: '0.8rem', padding: '12px' },
          }}
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
          autoFocus
        />

        {error && (
          <Alert severity="error" sx={{ mt: 1.5, borderRadius: 2 }}>{error}</Alert>
        )}

        {/* Demo hint */}
        <Paper
          variant="outlined"
          sx={{ mt: 2, p: 1.5, borderRadius: 2, bgcolor: 'warning.50', borderColor: 'warning.200', textAlign: 'center' }}
        >
          <Typography variant="caption" color="warning.dark" fontWeight={600}>
            🔑 Test uchun kod: <strong style={{ fontSize: '1rem', letterSpacing: '0.3rem' }}>{smsCode}</strong>
          </Typography>
        </Paper>

        {attempts >= 3 && (
          <Typography variant="caption" color="text.disabled" textAlign="center" display="block" sx={{ mt: 1 }}>
            Kodni qayta yuborish: 0:30
          </Typography>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, flexDirection: 'column', gap: 1 }}>
        <Button
          fullWidth
          variant="contained"
          size="large"
          onClick={handleConfirm}
          disabled={input.length < 4}
          sx={{ borderRadius: 3, py: 1.5, fontWeight: 800 }}
        >
          Tasdiqlash ✓
        </Button>
      </DialogActions>
    </Dialog>
  );
}
