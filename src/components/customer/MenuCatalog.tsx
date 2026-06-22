import { useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Fab from '@mui/material/Fab';
import Badge from '@mui/material/Badge';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ShoppingCartOutlined from '@mui/icons-material/ShoppingCartOutlined';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../store/useStore';
import { CATEGORY_LABELS, CATEGORY_EMOJIS } from '../../data/menuData';
import type { Category, MenuItem } from '../../types';

const CATEGORIES: (Category | 'all')[] = ['all', 'hotdog', 'burger', 'snack', 'drink'];
const CATEGORY_ALL_LABEL = 'Barchasi';

function MenuCard({ item }: { item: MenuItem }) {
  const { addToCart, removeFromCart, cart } = useStore();
  const [spicy, setSpicy] = useState(false);

  const cartCount = cart
    .filter((c) => c.menuItem.id === item.id && c.spicySauce === spicy)
    .reduce((s, c) => s + c.quantity, 0);

  const emoji = CATEGORY_EMOJIS[item.category];
  const hasImage = !!item.image;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      style={{ height: '100%' }}
    >
      <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'visible' }}>

        {/* Rasm yoki Emoji */}
        <Box
          sx={{
            position: 'relative',
            borderRadius: '16px 16px 0 0',
            overflow: 'hidden',
            height: 140,
            flexShrink: 0,
          }}
        >
          {hasImage ? (
            /* Yuklangan rasm */
            <Box
              component="img"
              src={item.image}
              alt={item.name}
              onError={(e) => {
                // Rasm yuklanmasa emoji ga qaytamiz
                const target = e.currentTarget as HTMLImageElement;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent) {
                  parent.style.background = 'linear-gradient(135deg, #FFF5F0 0%, #FFE5E5 100%)';
                  parent.style.display = 'flex';
                  parent.style.alignItems = 'center';
                  parent.style.justifyContent = 'center';
                  parent.style.fontSize = '3rem';
                  parent.innerHTML = emoji;
                }
              }}
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
              }}
            />
          ) : (
            /* Rasm yo'q — emoji */
            <Box
              sx={{
                width: '100%',
                height: '100%',
                background: 'linear-gradient(135deg, #FFF5F0 0%, #FFE5E5 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '3rem',
              }}
            >
              {emoji}
            </Box>
          )}

          {/* Savat badge */}
          {cartCount > 0 && (
            <Badge
              badgeContent={cartCount}
              color="error"
              sx={{ position: 'absolute', top: 10, right: 10 }}
            />
          )}
        </Box>

        <CardContent sx={{ flex: 1, pb: 0, pt: 1.5, px: 2 }}>
          <Typography
            variant="body2"
            fontWeight={700}
            sx={{ lineHeight: 1.3, mb: 0.5, fontSize: '0.875rem' }}
          >
            {item.name}
          </Typography>
          <Typography color="primary" fontWeight={800} fontSize="1rem">
            {item.price.toLocaleString()} so'm
          </Typography>
          {item.category === 'hotdog' && (
            <FormControlLabel
              control={
                <Checkbox
                  size="small"
                  checked={spicy}
                  onChange={(e) => setSpicy(e.target.checked)}
                  color="error"
                  sx={{ p: 0.5 }}
                />
              }
              label={
                <Typography variant="caption" sx={{ fontSize: '0.7rem', color: 'text.secondary' }}>
                  🌶️ Achchiq sous
                </Typography>
              }
              sx={{ mt: 0.5, ml: -0.5 }}
            />
          )}
        </CardContent>

        <CardActions sx={{ px: 2, pb: 2, pt: 1 }}>
          {cartCount === 0 ? (
            <Button
              fullWidth
              variant="contained"
              size="small"
              onClick={() => addToCart(item, spicy)}
              startIcon={<AddIcon />}
              sx={{ borderRadius: 2, py: 0.8, fontSize: '0.8rem' }}
            >
              Savatga
            </Button>
          ) : (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
              }}
            >
              <IconButton
                size="small"
                onClick={() => removeFromCart(item.id, spicy)}
                sx={{ bgcolor: 'grey.100', '&:hover': { bgcolor: 'grey.200' } }}
              >
                <RemoveIcon fontSize="small" />
              </IconButton>
              <Typography fontWeight={800} fontSize="1.1rem">
                {cartCount}
              </Typography>
              <IconButton
                size="small"
                onClick={() => addToCart(item, spicy)}
                sx={{
                  bgcolor: 'primary.main',
                  color: '#fff',
                  '&:hover': { bgcolor: 'primary.dark' },
                }}
              >
                <AddIcon fontSize="small" />
              </IconButton>
            </Box>
          )}
        </CardActions>
      </Card>
    </motion.div>
  );
}

export default function MenuCatalog() {
  const { menuItems, activeCategory, setActiveCategory, cart, setCartOpen, setCheckoutOpen } =
    useStore();
  const totalItems = cart.reduce((s, c) => s + c.quantity, 0);
  const totalPrice = cart.reduce((s, c) => s + c.menuItem.price * c.quantity, 0);

  const filtered =
    activeCategory === 'all'
      ? menuItems
      : menuItems.filter((m) => m.category === activeCategory);

  return (
    <Box sx={{ pb: totalItems > 0 ? 10 : 2 }}>
      {/* Category Filter */}
      <Box
        sx={{
          display: 'flex',
          gap: 1,
          overflowX: 'auto',
          pb: 1,
          pt: 0.5,
          px: 0,
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': { display: 'none' },
        }}
      >
        {CATEGORIES.map((cat) => (
          <Chip
            key={cat}
            label={`${CATEGORY_EMOJIS[cat]} ${cat === 'all' ? CATEGORY_ALL_LABEL : CATEGORY_LABELS[cat]}`}
            onClick={() => setActiveCategory(cat)}
            color={activeCategory === cat ? 'primary' : 'default'}
            variant={activeCategory === cat ? 'filled' : 'outlined'}
            sx={{ flexShrink: 0, fontWeight: 700, fontSize: '0.8rem', height: 36 }}
          />
        ))}
      </Box>

      {/* Menyu bo'sh bo'lsa */}
      {filtered.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 10 }}>
          <Typography fontSize="3rem">🍽️</Typography>
          <Typography color="text.secondary" fontWeight={600} mt={1}>
            Mahsulotlar yuklanmoqda...
          </Typography>
        </Box>
      )}

      {/* Grid */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: 'repeat(2, 1fr)',
            sm: 'repeat(3, 1fr)',
            md: 'repeat(4, 1fr)',
            lg: 'repeat(5, 1fr)',
          },
          gap: { xs: 1.5, sm: 2 },
          mt: 2,
        }}
      >
        <AnimatePresence mode="popLayout">
          {filtered.map((item) => (
            <MenuCard key={item.id} item={item} />
          ))}
        </AnimatePresence>
      </Box>

      {/* Sticky Cart */}
      <AnimatePresence>
        {totalItems > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1200 }}
          >
            <Paper
              elevation={8}
              sx={{
                background: 'linear-gradient(135deg, #E60000 0%, #B30000 100%)',
                borderRadius: '20px 20px 0 0',
                px: 3,
                py: 2,
              }}
            >
              <Box
                sx={{ maxWidth: 600, mx: 'auto', display: 'flex', alignItems: 'center', gap: 2 }}
              >
                <Box
                  onClick={() => setCartOpen(true)}
                  sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1, cursor: 'pointer' }}
                >
                  <Fab
                    size="small"
                    sx={{
                      bgcolor: 'rgba(255,255,255,0.2)',
                      color: '#fff',
                      minWidth: 40,
                      width: 40,
                      height: 40,
                      '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' },
                    }}
                  >
                    <Badge badgeContent={totalItems} color="warning">
                      <ShoppingCartOutlined fontSize="small" />
                    </Badge>
                  </Fab>
                  <Typography fontWeight={700} color="#fff" fontSize="0.9rem">
                    {totalItems} ta mahsulot
                  </Typography>
                  <Typography
                    fontWeight={900}
                    sx={{ color: '#FFD700', fontSize: '1.1rem', ml: 'auto' }}
                  >
                    {totalPrice.toLocaleString()} so'm
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  onClick={() => setCheckoutOpen(true)}
                  sx={{
                    bgcolor: '#FFD700',
                    color: '#1a1a1a',
                    '&:hover': { bgcolor: '#FFC200' },
                    fontWeight: 800,
                    px: 2.5,
                    py: 1,
                    borderRadius: 3,
                    flexShrink: 0,
                  }}
                >
                  Buyurtma
                </Button>
              </Box>
            </Paper>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
}