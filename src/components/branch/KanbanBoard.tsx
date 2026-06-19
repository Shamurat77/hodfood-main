import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import LocalFireDepartmentOutlined from '@mui/icons-material/LocalFireDepartmentOutlined';
import CheckCircleOutlined from '@mui/icons-material/CheckCircleOutlined';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../store/useStore';
import type { Order, OrderStatus } from '../../types';

interface Column {
  status: OrderStatus;
  label: string;
  nextLabel: string;
  nextStatus: OrderStatus | 'complete';
  color: string;
  bgColor: string;
  borderColor: string;
}

const COLUMNS: Column[] = [
  { status: 'new', label: 'Yangi', nextLabel: 'Tayyorlashni boshlash', nextStatus: 'preparing', color: '#1565C0', bgColor: '#E3F2FD', borderColor: '#90CAF9' },
  { status: 'preparing', label: 'Tayyorlanmoqda', nextLabel: "Yo'lga jo'natish", nextStatus: 'onway', color: '#E65100', bgColor: '#FFF3E0', borderColor: '#FFCC80' },
  { status: 'onway', label: "Yo'lda", nextLabel: 'Yetkazildi ✓', nextStatus: 'complete', color: '#6A1B9A', bgColor: '#F3E5F5', borderColor: '#CE93D8' },
];

function OrderCard({ order, nextLabel, nextStatus }: { order: Order; nextLabel: string; nextStatus: OrderStatus | 'complete' }) {
  const { updateOrderStatus } = useStore();

  function handleNext() {
    if (nextStatus === 'complete') {
      updateOrderStatus(order.id, 'completed');
    } else {
      updateOrderStatus(order.id, nextStatus);
    }
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.2 }}
    >
      <Paper
        variant="outlined"
        sx={{ p: 2, borderRadius: 3, bgcolor: '#fff', '&:hover': { boxShadow: '0 2px 12px rgba(0,0,0,0.1)' }, transition: 'box-shadow 0.2s' }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography fontWeight={800} fontSize="0.875rem">#{order.id}</Typography>
          <Typography variant="caption" color="text.disabled">
            {order.createdAt.toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })}
          </Typography>
        </Box>
        <Typography fontWeight={700} fontSize="0.875rem">{order.customerName}</Typography>
        <Typography variant="caption" color="text.secondary" display="block">{order.phone}</Typography>

        <Divider sx={{ my: 1 }} />

        <Box sx={{ mb: 1 }}>
          {order.items.map((item, i) => (
            <Typography key={i} variant="caption" color="text.secondary" display="block">
              {item.menuItem.name}
              {item.spicySauce && <span style={{ color: '#E60000' }}> 🌶️</span>} × {item.quantity}
            </Typography>
          ))}
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography fontWeight={900} color="primary" fontSize="0.9rem">
            {order.total.toLocaleString()} so'm
          </Typography>
          <Button
            size="small"
            variant={nextStatus === 'complete' ? 'contained' : 'outlined'}
            color={nextStatus === 'complete' ? 'success' : 'primary'}
            onClick={handleNext}
            startIcon={nextStatus === 'complete' ? <CheckCircleOutlined fontSize="small" /> : undefined}
            sx={{ borderRadius: 2, fontSize: '0.7rem', py: 0.5, px: 1.5 }}
          >
            {nextLabel}
          </Button>
        </Box>
      </Paper>
    </motion.div>
  );
}

interface Props { branch: string }

export default function KanbanBoard({ branch }: Props) {
  const { orders } = useStore();
  const activeOrders = orders.filter((o) => o.branch === branch && o.status !== 'completed');

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
        <LocalFireDepartmentOutlined color="error" />
        <Typography fontWeight={800} fontSize="1.2rem">Faol buyurtmalar</Typography>
        <Chip label={activeOrders.length} color="error" size="small" sx={{ fontWeight: 800, height: 24 }} />
      </Box>

      {/* Kanban columns - scrollable on mobile */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '280px 280px 280px', md: 'repeat(3, 1fr)' },
          gap: 2,
          overflowX: { xs: 'auto', md: 'visible' },
          pb: { xs: 2, md: 0 },
          scrollbarWidth: 'thin',
        }}
      >
        {COLUMNS.map((col) => {
          const colOrders = activeOrders.filter((o) => o.status === col.status);
          return (
            <Box
              key={col.status}
              sx={{
                bgcolor: col.bgColor,
                border: '1px solid',
                borderColor: col.borderColor,
                borderRadius: 3,
                p: 2,
                minHeight: 200,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Typography fontWeight={800} sx={{ color: col.color }}>{col.label}</Typography>
                <Chip
                  label={colOrders.length}
                  size="small"
                  sx={{ bgcolor: '#fff', fontWeight: 700, height: 22, fontSize: '0.75rem', color: col.color }}
                />
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <AnimatePresence>
                  {colOrders.length === 0 ? (
                    <Typography variant="caption" color="text.disabled" textAlign="center" sx={{ py: 4, display: 'block' }}>
                      Buyurtma yo'q
                    </Typography>
                  ) : (
                    colOrders.map((order) => (
                      <OrderCard
                        key={order.id}
                        order={order}
                        nextLabel={col.nextLabel}
                        nextStatus={col.nextStatus}
                      />
                    ))
                  )}
                </AnimatePresence>
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
