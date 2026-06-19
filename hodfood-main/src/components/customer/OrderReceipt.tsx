import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import CheckCircleOutline from '@mui/icons-material/CheckCircleOutline';
import LocalFireDepartmentOutlined from '@mui/icons-material/LocalFireDepartmentOutlined';
import DirectionsBikeOutlined from '@mui/icons-material/DirectionsBikeOutlined';
import StoreOutlined from '@mui/icons-material/StoreOutlined';
import { motion } from 'framer-motion';
import { useStore } from '../../store/useStore';

export default function OrderReceipt() {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const { receiptOrder, closeReceipt } = useStore();

  if (!receiptOrder) return null;

  const order = receiptOrder;
  const eta = order.orderType === 'delivery' ? '30–45 daqiqa' : '10–15 daqiqa';

  return (
    <Dialog
      open={!!receiptOrder}
      onClose={closeReceipt}
      fullScreen={fullScreen}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        component: motion.div,
        initial: { scale: 0.8, opacity: 0, y: 40 },
        animate: { scale: 1, opacity: 1, y: 0 },
        transition: { type: 'spring', stiffness: 300, damping: 25 },
        sx: { borderRadius: fullScreen ? 0 : 4, overflow: 'hidden' },
      }}
    >
      <DialogContent sx={{ p: 0 }}>
        {/* Header */}
        <Box
          sx={{
            background: 'linear-gradient(135deg, #E60000 0%, #B30000 100%)',
            px: 3, pt: 4, pb: 3,
            textAlign: 'center',
            color: '#fff',
          }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 400 }}
          >
            <CheckCircleOutline sx={{ fontSize: 56, color: '#FFD700', mb: 1 }} />
          </motion.div>
          <Typography fontWeight={900} fontSize="1.4rem" sx={{ mb: 0.5 }}>Buyurtma qabul qilindi!</Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.875rem' }}>
            Buyurtmangiz tayyorlanmoqda
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mt: 1.5 }}>
            <LocalFireDepartmentOutlined sx={{ color: '#FFD700', fontSize: 18 }} />
            <Typography fontWeight={800} sx={{ color: '#FFD700' }}>G'uncha HotFood</Typography>
          </Box>
        </Box>

        {/* Zigzag */}
        <Box sx={{ background: 'linear-gradient(135deg, #E60000, #B30000)', position: 'relative', height: 20 }}>
          <Box
            sx={{
              position: 'absolute', bottom: 0, left: 0, right: 0, height: 20,
              background: '#fff',
              clipPath: 'polygon(0 100%, 2% 0, 4% 100%, 6% 0, 8% 100%, 10% 0, 12% 100%, 14% 0, 16% 100%, 18% 0, 20% 100%, 22% 0, 24% 100%, 26% 0, 28% 100%, 30% 0, 32% 100%, 34% 0, 36% 100%, 38% 0, 40% 100%, 42% 0, 44% 100%, 46% 0, 48% 100%, 50% 0, 52% 100%, 54% 0, 56% 100%, 58% 0, 60% 100%, 62% 0, 64% 100%, 66% 0, 68% 100%, 70% 0, 72% 100%, 74% 0, 76% 100%, 78% 0, 80% 100%, 82% 0, 84% 100%, 86% 0, 88% 100%, 90% 0, 92% 100%, 94% 0, 96% 100%, 98% 0, 100% 100%)',
            }}
          />
        </Box>

        {/* Receipt body */}
        <Box sx={{ px: 3, py: 2 }}>
          {/* Order ID */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography color="text.secondary" variant="body2">Buyurtma raqami</Typography>
            <Typography fontWeight={900} color="primary" fontSize="1rem">#{order.id}</Typography>
          </Box>

          <Divider sx={{ borderStyle: 'dashed', mb: 2 }} />

          {/* Info */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" color="text.secondary">Mijoz</Typography>
              <Typography variant="body2" fontWeight={700}>{order.customerName}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" color="text.secondary">Filial</Typography>
              <Typography variant="body2" fontWeight={700}>{order.branch}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2" color="text.secondary">Buyurtma turi</Typography>
              <Chip
                size="small"
                icon={order.orderType === 'delivery' ? <DirectionsBikeOutlined /> : <StoreOutlined />}
                label={order.orderType === 'delivery' ? 'Yetkazib berish' : 'Kelib olib ketish'}
                color="primary"
                variant="outlined"
                sx={{ height: 24, fontSize: '0.7rem' }}
              />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" color="text.secondary">Taxminiy vaqt</Typography>
              <Typography variant="body2" fontWeight={700} color="secondary">{eta}</Typography>
            </Box>
          </Box>

          <Divider sx={{ borderStyle: 'dashed', mb: 2 }} />

          {/* Items */}
          <Typography fontWeight={700} fontSize="0.875rem" sx={{ mb: 1.5 }}>Buyurtma tarkibi:</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mb: 2 }}>
            {order.items.map((item, i) => (
              <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">
                  {item.menuItem.name} {item.spicySauce ? '🌶️' : ''} × {item.quantity}
                </Typography>
                <Typography variant="body2" fontWeight={600}>
                  {(item.menuItem.price * item.quantity).toLocaleString()} so'm
                </Typography>
              </Box>
            ))}
          </Box>

          <Divider sx={{ borderStyle: 'dashed', mb: 2 }} />

          {/* Total */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography color="text.secondary">To'lov usuli</Typography>
            <Typography fontWeight={600}>{order.paymentMethod === 'cash' ? '💵 Naqd pul' : '💳 Karta'}</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography fontWeight={800} fontSize="1rem">JAMI:</Typography>
            <Typography fontWeight={900} color="primary" fontSize="1.2rem">
              {order.total.toLocaleString()} so'm
            </Typography>
          </Box>

          {/* QR Placeholder */}
          <Paper
            variant="outlined"
            sx={{
              mt: 2, p: 2, borderRadius: 3, textAlign: 'center',
              border: '2px dashed', borderColor: 'divider',
            }}
          >
            <Box
              sx={{
                width: 80, height: 80, mx: 'auto', mb: 1,
                background: 'repeating-linear-gradient(45deg, #f0f0f0, #f0f0f0 4px, #e0e0e0 4px, #e0e0e0 8px)',
                borderRadius: 2,
              }}
            />
            <Typography variant="caption" color="text.disabled">QR Kod</Typography>
          </Paper>

          <Typography variant="caption" color="text.disabled" textAlign="center" display="block" sx={{ mt: 2 }}>
            Rahmat! G'uncha HotFood ni tanlayotganingiz uchun 🔥
          </Typography>

          <Button
            fullWidth
            variant="contained"
            size="large"
            onClick={closeReceipt}
            sx={{ mt: 2.5, borderRadius: 3, py: 1.5, fontWeight: 800 }}
          >
            Yopish
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
