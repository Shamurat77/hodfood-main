import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import StorefrontOutlined from '@mui/icons-material/StorefrontOutlined';
import ArrowForwardIos from '@mui/icons-material/ArrowForwardIos';
import CloseIcon from '@mui/icons-material/Close';
import { useStore } from '../../store/useStore';
import { BRANCHES, STATUS_LABELS } from '../../data/menuData';
import type { OrderStatus } from '../../types';

const STATUS_COLORS: Record<OrderStatus, 'info' | 'warning' | 'secondary' | 'success'> = {
  new: 'info', preparing: 'warning', onway: 'secondary', completed: 'success',
};

export default function BranchesList() {
  const { orders, selectedBranchModal, setSelectedBranchModal } = useStore();

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
        <StorefrontOutlined color="primary" />
        <Typography fontWeight={900} fontSize="1.5rem">Filiallar</Typography>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 2 }}>
        {BRANCHES.map((branch) => {
          const all = orders.filter((o) => o.branch === branch);
          const active = all.filter((o) => o.status !== 'completed');
          const completed = all.filter((o) => o.status === 'completed');
          const revenue = all.reduce((s, o) => s + o.total, 0);

          return (
            <Paper key={branch} variant="outlined" sx={{ borderRadius: 3, overflow: 'hidden', '&:hover': { borderColor: 'primary.main', boxShadow: '0 4px 20px rgba(230,0,0,0.1)' }, transition: 'all 0.2s' }}>
              <Box sx={{ px: 2.5, py: 2, bgcolor: active.length > 0 ? 'error.50' : 'grey.50', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <StorefrontOutlined color="primary" fontSize="small" />
                  <Typography fontWeight={800}>{branch} filiali</Typography>
                </Box>
                {active.length > 0 && (
                  <Chip
                    label={`${active.length} faol`}
                    color="error"
                    size="small"
                    sx={{ fontWeight: 700, height: 22, animation: 'pulse 2s infinite' }}
                  />
                )}
              </Box>
              <Box sx={{ px: 2.5, py: 2 }}>
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, mb: 2 }}>
                  {[
                    { label: 'Faol', value: active.length, color: 'error.main' },
                    { label: 'Yakunlangan', value: completed.length, color: 'success.main' },
                    { label: "Daromad", value: `${(revenue / 1000).toFixed(0)}K`, color: 'primary.main' },
                  ].map(({ label, value, color }) => (
                    <Box key={label} sx={{ textAlign: 'center', bgcolor: 'grey.50', borderRadius: 2, py: 1 }}>
                      <Typography fontWeight={800} sx={{ color, fontSize: '1rem' }}>{value}</Typography>
                      <Typography variant="caption" color="text.secondary">{label}</Typography>
                    </Box>
                  ))}
                </Box>
                <Button
                  fullWidth
                  variant="outlined"
                  size="small"
                  endIcon={<ArrowForwardIos fontSize="small" />}
                  onClick={() => setSelectedBranchModal(branch)}
                  sx={{ borderRadius: 2 }}
                >
                  Faol buyurtmalarni ko'rish
                </Button>
              </Box>
            </Paper>
          );
        })}
      </Box>

      {/* Branch Active Orders Modal */}
      <Dialog
        open={!!selectedBranchModal}
        onClose={() => setSelectedBranchModal(null)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 4, maxHeight: '80vh' } }}
      >
        <DialogTitle sx={{ background: 'linear-gradient(135deg, #E60000, #B30000)', color: '#fff', pb: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography fontWeight={800}>{selectedBranchModal} — Faol buyurtmalar</Typography>
            <IconButton size="small" onClick={() => setSelectedBranchModal(null)} sx={{ color: '#fff', bgcolor: 'rgba(255,255,255,0.2)' }}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          {(() => {
            const active = orders.filter((o) => o.branch === selectedBranchModal && o.status !== 'completed');
            if (active.length === 0) {
              return <Typography color="text.secondary" textAlign="center" py={4}>Faol buyurtma yo'q</Typography>;
            }
            return (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {active.map((order) => (
                  <Paper key={order.id} variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography fontWeight={800}>#{order.id}</Typography>
                      <Chip
                        label={STATUS_LABELS[order.status]}
                        color={STATUS_COLORS[order.status]}
                        size="small"
                        sx={{ fontWeight: 700, height: 24 }}
                      />
                    </Box>
                    <Typography variant="body2" fontWeight={600}>{order.customerName} • {order.phone}</Typography>
                    {order.items.map((item, i) => (
                      <Typography key={i} variant="caption" color="text.secondary" display="block">
                        {item.menuItem.name} {item.spicySauce ? '🌶️' : ''} × {item.quantity}
                      </Typography>
                    ))}
                    <Divider sx={{ my: 0.5 }} />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="caption" color="text.secondary">
                        {order.orderType === 'delivery' ? '🚴 Yetkazib berish' : '🏪 Olib ketish'}
                      </Typography>
                      <Typography fontWeight={900} color="primary">{order.total.toLocaleString()} so'm</Typography>
                    </Box>
                  </Paper>
                ))}
              </Box>
            );
          })()}
        </DialogContent>
      </Dialog>
    </Box>
  );
}
