import { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import Slide from '@mui/material/Slide';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import type { TransitionProps } from '@mui/material/transitions';
import CloseIcon from '@mui/icons-material/Close';
import LocationOnOutlined from '@mui/icons-material/LocationOnOutlined';
import CreditCardOutlined from '@mui/icons-material/CreditCardOutlined';
import LocalAtmOutlined from '@mui/icons-material/LocalAtmOutlined';
import DirectionsBikeOutlined from '@mui/icons-material/DirectionsBikeOutlined';
import StoreOutlined from '@mui/icons-material/StoreOutlined';
import React from 'react';
import { useStore } from '../../store/useStore';
import { BRANCHES } from '../../data/menuData';
import MapModal from './MapModal';

const SlideUp = React.forwardRef(function SlideUp(
  props: TransitionProps & { children: React.ReactElement },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function CheckoutForm() {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const { cart, checkoutOpen, setCheckoutOpen, initiateSMS, orderType, setOrderType } = useStore();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [branch, setBranch] = useState(BRANCHES[0]);
  const [payment, setPayment] = useState<'cash' | 'card'>('cash');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [mapOpen, setMapOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const total = cart.reduce((s, c) => s + c.menuItem.price * c.quantity, 0);

  function formatCardNumber(val: string) {
    const digits = val.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(.{4})/g, '$1 ').trim();
  }

  function formatExpiry(val: string) {
    const digits = val.replace(/\D/g, '').slice(0, 4);
    if (digits.length >= 2) return digits.slice(0, 2) + '/' + digits.slice(2);
    return digits;
  }

  function validate() {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = 'Ismingizni kiriting';
    if (!phone.trim() || phone.replace(/\D/g, '').length < 9) e.phone = "To'g'ri telefon raqam kiriting";
    if (orderType === 'delivery' && !address.trim()) e.address = 'Manzil kiriting';
    if (payment === 'card') {
      if (cardNumber.replace(/\s/g, '').length < 16) e.cardNumber = "Karta raqami to'liq kiriting";
      if (expiry.length < 5) e.expiry = 'Muddatni kiriting (MM/YY)';
    }
    return e;
  }

  function handleSubmit() {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    
    // Xato bergan qismni to'g'riladik (undefined o'rniga "")
    initiateSMS({
      items: cart,
      customerName: name,
      phone: '+998' + phone,
      address: orderType === 'pickup' ? `${branch} filiali (kelib olib ketish)` : address,
      orderType,
      paymentMethod: payment,
      cardNumber: payment === 'card' ? cardNumber : "",
      expiryDate: payment === 'card' ? expiry : "",
      branch,
      total,
    });
    setErrors({});
  }

  function handleClose() {
    setCheckoutOpen(false);
    setErrors({});
  }

  return (
    <>
      <Dialog
        open={checkoutOpen}
        onClose={handleClose}
        fullScreen={fullScreen}
        maxWidth="sm"
        fullWidth
        TransitionComponent={fullScreen ? SlideUp : undefined}
        PaperProps={{ sx: { ...(fullScreen ? { borderRadius: 0 } : { borderRadius: 4 }), maxHeight: '90vh' } }}
      >
        <DialogTitle sx={{ pb: 1, background: 'linear-gradient(135deg, #E60000 0%, #B30000 100%)', color: '#fff' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography fontWeight={800} fontSize="1.1rem">Buyurtmani rasmiylashtirish</Typography>
            <IconButton onClick={handleClose} size="small" sx={{ color: '#fff', bgcolor: 'rgba(255,255,255,0.2)' }}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ p: 2.5, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Order Type */}
          <FormControl>
            <FormLabel sx={{ fontWeight: 700, color: 'text.primary', mb: 1, fontSize: '0.875rem' }}>Buyurtma turi</FormLabel>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
              {[
                { val: 'delivery', label: 'Yetkazib berish', icon: <DirectionsBikeOutlined /> },
                { val: 'pickup', label: 'Kelib olib ketish', icon: <StoreOutlined /> },
              ].map(({ val, label, icon }) => (
                <Paper
                  key={val}
                  onClick={() => setOrderType(val as 'delivery' | 'pickup')}
                  variant="outlined"
                  sx={{
                    p: 1.5,
                    cursor: 'pointer',
                    borderRadius: 3,
                    borderColor: orderType === val ? 'primary.main' : 'divider',
                    borderWidth: orderType === val ? 2 : 1,
                    bgcolor: orderType === val ? 'primary.50' : 'background.paper',
                    transition: 'all 0.15s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  <Box sx={{ color: orderType === val ? 'primary.main' : 'text.secondary' }}>{icon}</Box>
                  <Typography variant="body2" fontWeight={700} color={orderType === val ? 'primary.main' : 'text.primary'}>
                    {label}
                  </Typography>
                </Paper>
              ))}
            </Box>
          </FormControl>

          {/* Branch */}
          <FormControl fullWidth>
            <InputLabel sx={{ fontSize: '0.875rem' }}>Filial tanlash</InputLabel>
            <Select
              value={branch}
              label="Filial tanlash"
              onChange={(e) => setBranch(e.target.value as string)}
              sx={{ borderRadius: 3 }}
            >
              {BRANCHES.map((b) => (
                <MenuItem key={b} value={b}>{b} filiali</MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Name */}
          <TextField
            label="Ism"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={!!errors.name}
            helperText={errors.name}
            fullWidth
            size="small"
            placeholder="Ismingizni kiriting"
          />

          {/* Phone with +998 */}
          <TextField
            label="Telefon raqam"
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/[^0-9\s]/g, '').slice(0, 9))}
            error={!!errors.phone}
            helperText={errors.phone}
            fullWidth
            size="small"
            placeholder="XX XXX XX XX"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Typography fontWeight={700} color="text.secondary" fontSize="0.875rem">+998</Typography>
                </InputAdornment>
              ),
            }}
          />

          {/* Address (delivery only) */}
          {orderType === 'delivery' && (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                label="Manzil"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                error={!!errors.address}
                helperText={errors.address}
                fullWidth
                size="small"
                placeholder="Ko'cha, uy raqami..."
              />
              <Button
                variant="outlined"
                onClick={() => setMapOpen(true)}
                sx={{ flexShrink: 0, borderRadius: 3, px: 1.5, minWidth: 'auto', borderColor: 'divider', color: 'error.main' }}
                title="Xaritadan belgilash"
              >
                <LocationOnOutlined />
              </Button>
            </Box>
          )}

          {/* Payment */}
          <FormControl>
            <FormLabel sx={{ fontWeight: 700, color: 'text.primary', mb: 1, fontSize: '0.875rem' }}>To'lov usuli</FormLabel>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
              {[
                { val: 'cash', label: 'Naqd pul', icon: <LocalAtmOutlined /> },
                { val: 'card', label: 'Karta', icon: <CreditCardOutlined /> },
              ].map(({ val, label, icon }) => (
                <Paper
                  key={val}
                  onClick={() => setPayment(val as 'cash' | 'card')}
                  variant="outlined"
                  sx={{
                    p: 1.5, cursor: 'pointer', borderRadius: 3,
                    borderColor: payment === val ? 'primary.main' : 'divider',
                    borderWidth: payment === val ? 2 : 1,
                    bgcolor: payment === val ? 'primary.50' : 'background.paper',
                    transition: 'all 0.15s',
                    display: 'flex', alignItems: 'center', gap: 1,
                  }}
                >
                  <Box sx={{ color: payment === val ? 'primary.main' : 'text.secondary' }}>{icon}</Box>
                  <Typography variant="body2" fontWeight={700} color={payment === val ? 'primary.main' : 'text.primary'}>
                    {label}
                  </Typography>
                </Paper>
              ))}
            </Box>
            {payment === 'card' && (
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, ml: 0.5 }}>Payme / Click / Uzcard / Humo</Typography>
            )}
          </FormControl>

          {/* Card Details */}
          {payment === 'card' && (
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 3, bgcolor: 'info.50', borderColor: 'info.200' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                <CreditCardOutlined color="info" fontSize="small" />
                <Typography fontWeight={700} color="info.dark" fontSize="0.875rem">Karta ma'lumotlari</Typography>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <TextField
                  label="Karta raqami"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                  error={!!errors.cardNumber}
                  helperText={errors.cardNumber}
                  placeholder="XXXX XXXX XXXX XXXX"
                  fullWidth
                  size="small"
                  inputProps={{ maxLength: 19 }}
                />
                <TextField
                  label="Amal qilish muddati"
                  value={expiry}
                  onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                  error={!!errors.expiry}
                  helperText={errors.expiry}
                  placeholder="MM/YY"
                  fullWidth
                  size="small"
                  inputProps={{ maxLength: 5 }}
                />
              </Box>
            </Paper>
          )}

          <Divider />

          {/* Summary */}
          <Paper variant="outlined" sx={{ p: 2, borderRadius: 3, bgcolor: 'grey.50' }}>
            <Typography fontWeight={700} fontSize="0.875rem" sx={{ mb: 1 }}>Buyurtma:</Typography>
            {cart.map((c, i) => (
              <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', py: 0.3 }}>
                <Typography variant="body2" color="text.secondary">
                  {c.menuItem.name} {c.spicySauce ? '🌶️' : ''} × {c.quantity}
                </Typography>
                <Typography variant="body2" fontWeight={600}>
                  {(c.menuItem.price * c.quantity).toLocaleString()} so'm
                </Typography>
              </Box>
            ))}
            <Divider sx={{ my: 1 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography fontWeight={800}>Jami:</Typography>
              <Typography fontWeight={900} color="primary">{total.toLocaleString()} so'm</Typography>
            </Box>
          </Paper>
        </DialogContent>

        <DialogActions sx={{ px: 2.5, pb: 2.5, flexDirection: 'column', gap: 1 }}>
          <Button
            fullWidth
            variant="contained"
            size="large"
            onClick={handleSubmit}
            sx={{ borderRadius: 3, py: 1.5, fontWeight: 800, fontSize: '1rem' }}
          >
            {payment === 'card' ? 'Tasdiqlash va SMS yuborish →' : 'Buyurtmani tasdiqlash →'}
          </Button>
        </DialogActions>
      </Dialog>

      {mapOpen && (
        <MapModal
          onSelect={(addr) => { setAddress(addr); setMapOpen(false); }}
          onClose={() => setMapOpen(false)}
        />
      )}
    </>
  );
}