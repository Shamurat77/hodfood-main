import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import CloseIcon from '@mui/icons-material/Close';
import LogoutIcon from '@mui/icons-material/Logout';
import ShoppingBagOutlined from '@mui/icons-material/ShoppingBagOutlined';
import { useStore } from '../../store/useStore';
import { STATUS_LABELS } from '../../data/menuData';

const STATUS_COLORS = {
  new: 'info',
  preparing: 'warning',
  onway: 'secondary',
  completed: 'success',
} as const;

export default function UserProfile() {
  const { profileOpen, setProfileOpen, user, logout, orders } = useStore();
  const userOrders = orders.filter((o) => o.status === 'completed').slice(-5).reverse();

  if (!user) return null;

  return (
    <Drawer
      anchor="right"
      open={profileOpen}
      onClose={() => setProfileOpen(false)}
      PaperProps={{ sx: { width: { xs: '100%', sm: 360 }, borderRadius: '20px 0 0 20px' } }}
    >
      {/* Header */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #E60000 0%, #B30000 100%)',
          p: 3,
          color: '#fff',
          position: 'relative',
        }}
      >
        <IconButton
          onClick={() => setProfileOpen(false)}
          size="small"
          sx={{ position: 'absolute', top: 12, right: 12, color: '#fff', bgcolor: 'rgba(255,255,255,0.2)', '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' } }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar
            src={user.avatar}
            sx={{ width: 60, height: 60, border: '3px solid #FFD700', fontSize: '1.5rem' }}
          >
            {user.name[0]}
          </Avatar>
          <Box>
            <Typography fontWeight={800} fontSize="1.1rem">{user.name}</Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>{user.email}</Typography>
            <Chip
              label="Doimiy mijoz"
              size="small"
              sx={{ mt: 0.5, bgcolor: '#FFD700', color: '#1a1a1a', fontWeight: 700, height: 22, fontSize: '0.7rem' }}
            />
          </Box>
        </Box>
      </Box>

      {/* Orders */}
      <Box sx={{ p: 2, flex: 1, overflow: 'auto' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <ShoppingBagOutlined sx={{ color: 'primary.main', fontSize: 20 }} />
          <Typography fontWeight={700}>Xaridlar tarixi</Typography>
        </Box>

        {userOrders.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 5 }}>
            <ShoppingBagOutlined sx={{ fontSize: 48, color: 'grey.300', mb: 1 }} />
            <Typography color="text.secondary" variant="body2">Hali xarid qilmadingiz</Typography>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {userOrders.map((order) => (
              <Paper key={order.id} variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography fontWeight={700} fontSize="0.875rem">#{order.id}</Typography>
                  <Chip
                    label={STATUS_LABELS[order.status]}
                    size="small"
                    color={STATUS_COLORS[order.status]}
                    sx={{ height: 22, fontSize: '0.7rem', fontWeight: 700 }}
                  />
                </Box>
                {order.items.slice(0, 2).map((item, i) => (
                  <Typography key={i} variant="caption" color="text.secondary" display="block">
                    {item.menuItem.name} {item.spicySauce ? '🌶️' : ''} × {item.quantity}
                  </Typography>
                ))}
                {order.items.length > 2 && (
                  <Typography variant="caption" color="text.secondary">+{order.items.length - 2} ta mahsulot</Typography>
                )}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1, pt: 1, borderTop: '1px solid', borderColor: 'divider' }}>
                  <Typography variant="caption" color="text.secondary">
                    {order.createdAt.toLocaleDateString('uz-UZ')}
                  </Typography>
                  <Typography fontWeight={700} color="primary" fontSize="0.875rem">
                    {order.total.toLocaleString()} so'm
                  </Typography>
                </Box>
              </Paper>
            ))}
          </Box>
        )}
      </Box>

      <Divider />
      <Box sx={{ p: 2 }}>
        <Button
          fullWidth
          variant="outlined"
          color="error"
          onClick={logout}
          startIcon={<LogoutIcon />}
        >
          Chiqish
        </Button>
      </Box>
    </Drawer>
  );
}
