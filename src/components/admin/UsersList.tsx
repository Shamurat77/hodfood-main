import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import CloseIcon from '@mui/icons-material/Close';
import PeopleOutlined from '@mui/icons-material/PeopleOutlined';
import SearchOutlined from '@mui/icons-material/SearchOutlined';
import ShoppingBagOutlined from '@mui/icons-material/ShoppingBagOutlined';
import { useStore } from '../../store/useStore';
import { STATUS_LABELS } from '../../data/menuData';
import type { OrderStatus } from '../../types';

const STATUS_COLORS: Record<OrderStatus, 'info' | 'warning' | 'secondary' | 'success'> = {
  new: 'info', preparing: 'warning', onway: 'secondary', completed: 'success',
};

export default function UsersList() {
  const { appUsers, orders, selectedUserModal, setSelectedUserModal } = useStore();
  const [search, setSearch] = useState('');

  const filtered = appUsers.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  // Modal uchun tanlangan user va uning buyurtmalari
  const selectedUser = appUsers.find((u) => u.email === selectedUserModal) ?? null;
  const userOrders = selectedUser
    ? orders
        .filter((o) => o.userEmail === selectedUser.email)
        .slice()
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    : [];

  return (
    <Box>
      {/* Sarlavha */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
        <PeopleOutlined color="primary" />
        <Typography fontWeight={900} fontSize="1.5rem">Foydalanuvchilar</Typography>
        <Chip
          label={appUsers.length}
          size="small"
          color="primary"
          sx={{ fontWeight: 800, height: 24, ml: 0.5 }}
        />
      </Box>

      {/* Qidiruv */}
      <TextField
        fullWidth
        size="small"
        placeholder="Ism yoki email bo'yicha qidirish..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchOutlined fontSize="small" color="action" />
            </InputAdornment>
          ),
        }}
        sx={{ mb: 2.5, '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
      />

      {/* Bo'sh holat */}
      {filtered.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 10 }}>
          <PeopleOutlined sx={{ fontSize: 56, color: 'grey.200', mb: 2 }} />
          <Typography color="text.secondary" fontWeight={600}>
            {search ? 'Foydalanuvchi topilmadi' : "Hali hech kim ro'yxatdan o'tmagan"}
          </Typography>
        </Box>
      )}

      {/* Ro'yxat */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {filtered.map((u) => (
          <Paper
            key={u.email}
            variant="outlined"
            onClick={() => setSelectedUserModal(u.email)}
            sx={{
              p: 2,
              borderRadius: 3,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              transition: 'all 0.2s',
              '&:hover': { borderColor: 'primary.main', boxShadow: '0 4px 16px rgba(230,0,0,0.1)' },
            }}
          >
            <Avatar
              src={u.avatar}
              sx={{ width: 48, height: 48, border: '2px solid', borderColor: 'primary.light' }}
            >
              {u.name[0]}
            </Avatar>

            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography fontWeight={800} noWrap>{u.name}</Typography>
              <Typography variant="caption" color="text.secondary" noWrap display="block">
                {u.email}
              </Typography>
              {u.lastSeen && (
                <Typography variant="caption" color="text.disabled">
                  Oxirgi kirish:{' '}
                  {new Date(u.lastSeen).toLocaleDateString('uz-UZ', {
                    day: '2-digit', month: '2-digit', year: 'numeric',
                  })}
                </Typography>
              )}
            </Box>

            <Box sx={{ textAlign: 'right', flexShrink: 0 }}>
              <Typography fontWeight={900} color="primary" fontSize="1rem">
                {u.totalSpent.toLocaleString()} so'm
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {u.totalOrders} ta buyurtma
              </Typography>
            </Box>

            <Chip
              label={u.totalOrders > 0 ? 'Faol' : 'Yangi'}
              size="small"
              color={u.totalOrders > 0 ? 'success' : 'default'}
              sx={{ fontWeight: 700, height: 22, fontSize: '0.7rem' }}
            />
          </Paper>
        ))}
      </Box>

      {/* ── FOYDALANUVCHI TARIXI MODALI ───────────────────── */}
      <Dialog
        open={!!selectedUserModal}
        onClose={() => setSelectedUserModal(null)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 4, maxHeight: '85vh' } }}
      >
        {selectedUser && (
          <>
            <DialogTitle
              sx={{
                background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
                color: '#fff',
                pb: 2,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar
                    src={selectedUser.avatar}
                    sx={{ width: 52, height: 52, border: '2px solid #FFD700' }}
                  >
                    {selectedUser.name[0]}
                  </Avatar>
                  <Box>
                    <Typography fontWeight={900} fontSize="1rem">
                      {selectedUser.name}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                      {selectedUser.email}
                    </Typography>
                  </Box>
                </Box>
                <IconButton
                  size="small"
                  onClick={() => setSelectedUserModal(null)}
                  sx={{ color: '#fff', bgcolor: 'rgba(255,255,255,0.15)' }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Box>

              {/* Statistika */}
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: 1,
                  mt: 2,
                }}
              >
                {[
                  { label: 'Jami buyurtma', value: selectedUser.totalOrders },
                  {
                    label: 'Jami sarflagan',
                    value: `${selectedUser.totalSpent.toLocaleString()} so'm`,
                  },
                  {
                    label: "O'rtacha chek",
                    value:
                      selectedUser.totalOrders > 0
                        ? `${Math.round(selectedUser.totalSpent / selectedUser.totalOrders).toLocaleString()} so'm`
                        : '—',
                  },
                ].map(({ label, value }) => (
                  <Box
                    key={label}
                    sx={{
                      bgcolor: 'rgba(255,255,255,0.1)',
                      borderRadius: 2,
                      p: 1.5,
                      textAlign: 'center',
                    }}
                  >
                    <Typography fontWeight={800} color="#FFD700" fontSize="0.95rem">
                      {value}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                      {label}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </DialogTitle>

            <DialogContent sx={{ pt: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <ShoppingBagOutlined color="primary" fontSize="small" />
                <Typography fontWeight={800}>Xaridlar tarixi</Typography>
                <Chip
                  label={userOrders.length}
                  size="small"
                  sx={{ fontWeight: 800, height: 20, fontSize: '0.7rem' }}
                />
              </Box>

              {userOrders.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 6 }}>
                  <ShoppingBagOutlined sx={{ fontSize: 48, color: 'grey.200', mb: 1 }} />
                  <Typography color="text.secondary">Hali buyurtma yo'q</Typography>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  {userOrders.map((order) => (
                    <Paper key={order.id} variant="outlined" sx={{ borderRadius: 3, overflow: 'hidden' }}>
                      <Box
                        sx={{
                          px: 2, py: 1.2,
                          bgcolor: 'grey.50',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          flexWrap: 'wrap',
                          gap: 1,
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
                          <Typography fontWeight={800} fontSize="0.85rem">
                            #{order.id}
                          </Typography>
                          <Chip
                            label={order.branch}
                            size="small"
                            color="warning"
                            variant="outlined"
                            sx={{ height: 20, fontSize: '0.65rem', fontWeight: 700 }}
                          />
                          <Typography variant="caption" color="text.secondary">
                            {order.createdAt.toLocaleDateString('uz-UZ')}
                          </Typography>
                        </Box>
                        <Chip
                          label={STATUS_LABELS[order.status]}
                          color={STATUS_COLORS[order.status]}
                          size="small"
                          sx={{ fontWeight: 700, height: 22 }}
                        />
                      </Box>

                      <Box sx={{ px: 2, py: 1.2 }}>
                        {order.items.map((item, i) => (
                          <Box
                            key={i}
                            sx={{ display: 'flex', justifyContent: 'space-between' }}
                          >
                            <Typography variant="caption" color="text.secondary">
                              {item.menuItem.name} {item.spicySauce ? '🌶️' : ''} ×{' '}
                              {item.quantity}
                            </Typography>
                            <Typography variant="caption">
                              {(item.menuItem.price * item.quantity).toLocaleString()} so'm
                            </Typography>
                          </Box>
                        ))}
                        <Divider sx={{ my: 0.8 }} />
                        <Box
                          sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                        >
                          <Typography variant="caption" color="text.secondary">
                            {order.paymentMethod === 'cash' ? '💵 Naqd' : '💳 Karta'} •{' '}
                            {order.orderType === 'delivery' ? '🚴 Yetkazib berish' : '🏪 Olib ketish'}
                          </Typography>
                          <Typography fontWeight={900} color="primary" fontSize="0.9rem">
                            {order.total.toLocaleString()} so'm
                          </Typography>
                        </Box>
                      </Box>
                    </Paper>
                  ))}
                </Box>
              )}
            </DialogContent>
          </>
        )}
      </Dialog>
    </Box>
  );
}