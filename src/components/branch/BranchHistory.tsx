import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import HistoryOutlined from '@mui/icons-material/HistoryOutlined';
import { useStore } from '../../store/useStore';

interface Props { branch: string }

export default function BranchHistory({ branch }: Props) {
  const { orders } = useStore();
  const completed = orders.filter((o) => o.branch === branch && o.status === 'completed').slice().reverse();

  if (completed.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 10 }}>
        <HistoryOutlined sx={{ fontSize: 56, color: 'grey.200', mb: 2 }} />
        <Typography fontWeight={700} color="text.secondary">Yakunlangan buyurtmalar yo'q</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <HistoryOutlined color="primary" />
        <Typography fontWeight={800} fontSize="1.2rem">Xaridlar tarixi — {branch}</Typography>
        <Chip label={completed.length} color="success" size="small" sx={{ fontWeight: 800, height: 24 }} />
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {completed.map((order) => (
          <Paper key={order.id} variant="outlined" sx={{ borderRadius: 3, overflow: 'hidden' }}>
            <Box sx={{ px: 2.5, py: 1.5, bgcolor: 'grey.50', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography fontWeight={800} fontSize="0.9rem">#{order.id}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {order.createdAt.toLocaleDateString('uz-UZ')} • {order.customerName}
                </Typography>
              </Box>
              <Chip label="Yakunlandi" color="success" size="small" sx={{ fontWeight: 700, height: 24 }} />
            </Box>
            <Box sx={{ px: 2.5, py: 1.5 }}>
              <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.5 }}>
                📍 {order.address}
              </Typography>
              {order.items.map((item, i) => (
                <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="caption" color="text.secondary">
                    {item.menuItem.name} {item.spicySauce ? '🌶️' : ''} × {item.quantity}
                  </Typography>
                  <Typography variant="caption">{(item.menuItem.price * item.quantity).toLocaleString()} so'm</Typography>
                </Box>
              ))}
              <Divider sx={{ my: 0.5 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="caption" color="text.secondary">
                  {order.paymentMethod === 'cash' ? '💵 Naqd' : '💳 Karta'}
                </Typography>
                <Typography fontWeight={900} color="primary">{order.total.toLocaleString()} so'm</Typography>
              </Box>
            </Box>
          </Paper>
        ))}
      </Box>
    </Box>
  );
}
