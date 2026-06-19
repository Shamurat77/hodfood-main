import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ShoppingCartOutlined from '@mui/icons-material/ShoppingCartOutlined';
import CloseIcon from '@mui/icons-material/Close';
import { useStore } from '../../store/useStore';

const CATEGORY_EMOJIS: Record<string, string> = { hotdog: '🌭', burger: '🍔', snack: '🍟', drink: '🥤' };

export default function Cart() {
  const { cart, cartOpen, setCartOpen, addToCart, removeFromCart, clearCart, setCheckoutOpen } = useStore();
  const total = cart.reduce((s, c) => s + c.menuItem.price * c.quantity, 0);

  return (
    <Drawer
      anchor="right"
      open={cartOpen}
      onClose={() => setCartOpen(false)}
      PaperProps={{ sx: { width: { xs: '100%', sm: 380 }, borderRadius: '20px 0 0 20px', display: 'flex', flexDirection: 'column' } }}
    >
      {/* Header */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #E60000 0%, #B30000 100%)',
          px: 2.5, py: 2,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <ShoppingCartOutlined sx={{ color: '#fff' }} />
          <Typography fontWeight={800} color="#fff" fontSize="1.1rem">Savat</Typography>
        </Box>
        <IconButton onClick={() => setCartOpen(false)} size="small" sx={{ color: '#fff', bgcolor: 'rgba(255,255,255,0.2)' }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* Items */}
      <Box sx={{ flex: 1, overflowY: 'auto', p: 2 }}>
        {cart.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <ShoppingCartOutlined sx={{ fontSize: 60, color: 'grey.200', mb: 2 }} />
            <Typography color="text.secondary" fontWeight={600}>Savat bo'sh</Typography>
            <Typography variant="body2" color="text.disabled" sx={{ mt: 0.5 }}>Menyu orqali mahsulot qo'shing</Typography>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {cart.map((item, i) => (
              <Paper key={i} variant="outlined" sx={{ p: 1.5, borderRadius: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Box sx={{ fontSize: '1.8rem', lineHeight: 1 }}>{CATEGORY_EMOJIS[item.menuItem.category]}</Box>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="body2" fontWeight={700} noWrap>{item.menuItem.name}</Typography>
                    {item.spicySauce && (
                      <Typography variant="caption" color="error" display="block">🌶️ Achchiq sous bilan</Typography>
                    )}
                    <Typography color="primary" fontWeight={800} fontSize="0.9rem">
                      {(item.menuItem.price * item.quantity).toLocaleString()} so'm
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <IconButton
                      size="small"
                      onClick={() => removeFromCart(item.menuItem.id, item.spicySauce)}
                      sx={{ bgcolor: 'grey.100', width: 28, height: 28 }}
                    >
                      {item.quantity === 1 ? <DeleteOutlineIcon sx={{ fontSize: 14 }} /> : <RemoveIcon sx={{ fontSize: 14 }} />}
                    </IconButton>
                    <Typography fontWeight={800} sx={{ minWidth: 20, textAlign: 'center', fontSize: '0.95rem' }}>
                      {item.quantity}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() => addToCart(item.menuItem, item.spicySauce)}
                      sx={{ bgcolor: 'primary.main', color: '#fff', width: 28, height: 28, '&:hover': { bgcolor: 'primary.dark' } }}
                    >
                      <AddIcon sx={{ fontSize: 14 }} />
                    </IconButton>
                  </Box>
                </Box>
              </Paper>
            ))}
          </Box>
        )}
      </Box>

      {/* Footer */}
      {cart.length > 0 && (
        <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography color="text.secondary" fontWeight={600}>Jami summa</Typography>
            <Typography color="primary" fontWeight={900} fontSize="1.2rem">
              {total.toLocaleString()} so'm
            </Typography>
          </Box>
          <Button
            fullWidth
            variant="contained"
            size="large"
            onClick={() => { setCartOpen(false); setCheckoutOpen(true); }}
            sx={{ borderRadius: 3, py: 1.5, fontSize: '1rem', fontWeight: 800, mb: 1 }}
          >
            Buyurtma berish →
          </Button>
          <Button
            fullWidth
            variant="text"
            color="inherit"
            size="small"
            onClick={clearCart}
            sx={{ color: 'text.disabled', fontSize: '0.75rem' }}
          >
            Savatni tozalash
          </Button>
        </Box>
      )}
    </Drawer>
  );
}
