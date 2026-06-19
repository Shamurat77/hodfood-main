import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import ShoppingBagOutlined from '@mui/icons-material/ShoppingBagOutlined';
import { useStore } from '../../store/useStore';

const STATUS_COLORS = {
  new: 'info', preparing: 'warning', onway: 'secondary', completed: 'success',
} as const;

const STATUS_LABELS: Record<string, string> = {
  new: 'Yangi', preparing: 'Tayyorlanmoqda', onway: "Yo'lda", completed: 'Yakunlandi',
};

export default function OrderHistory() {
  const { orders } = useStore();
  const history = orders.filter((o) => o.status === 'completed').slice().reverse();

  if (history.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 10 }}>
        <ShoppingBagOutlined sx={{ fontSize: 64, color: 'grey.200', mb: 2 }} />
        <Typography fontWeight={700} color="text.secondary">Xaridlar tarixi bo'sh</Typography>
        <Typography variant="body2" color="text.disabled" sx={{ mt: 0.5 }}>Hali buyurtma berilmagan</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography fontWeight={800} fontSize="1.2rem">Xaridlar tarixi</Typography>
      {history.map((order) => (
        <Paper key={order.id} variant="outlined" sx={{ borderRadius: 3, overflow: 'hidden' }}>
          <Box sx={{ px: 2.5, py: 1.5, bgcolor: 'grey.50', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box>
              <Typography fontWeight={800} fontSize="0.9rem">#{order.id}</Typography>
              <Typography variant="caption" color="text.secondary">
                {order.createdAt.toLocaleDateString('uz-UZ')} • {order.branch}
              </Typography>
            </Box>
            <Chip
              label={STATUS_LABELS[order.status]}
              color={STATUS_COLORS[order.status]}
              size="small"
              sx={{ fontWeight: 700, height: 24 }}
            />
          </Box>
          <Box sx={{ px: 2.5, py: 1.5 }}>
            {order.items.map((item, i) => (
              <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', py: 0.3 }}>
                <Typography variant="body2" color="text.secondary">
                  {item.menuItem.name} {item.spicySauce ? '🌶️' : ''} × {item.quantity}
                </Typography>
                <Typography variant="body2">{(item.menuItem.price * item.quantity).toLocaleString()} so'm</Typography>
              </Box>
            ))}
            <Divider sx={{ my: 1 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="caption" color="text.secondary">
                {order.paymentMethod === 'cash' ? '💵 Naqd' : '💳 Karta'} •{' '}
                {order.orderType === 'delivery' ? '🚴 Yetkazib berish' : '🏪 Olib ketish'}
              </Typography>
              <Typography fontWeight={900} color="primary">{order.total.toLocaleString()} so'm</Typography>
            </Box>
          </Box>
        </Paper>
      ))}
    </Box>
  );
}
