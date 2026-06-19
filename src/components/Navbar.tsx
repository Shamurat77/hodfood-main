import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import ShoppingCartOutlined from '@mui/icons-material/ShoppingCartOutlined';
import PersonOutline from '@mui/icons-material/PersonOutline';
import StorefrontOutlined from '@mui/icons-material/StorefrontOutlined';
import AdminPanelSettingsOutlined from '@mui/icons-material/AdminPanelSettingsOutlined';
import LocalFireDepartmentOutlined from '@mui/icons-material/LocalFireDepartmentOutlined';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { useStore } from '../store/useStore';
import type { AppMode } from '../types';

const MODES: { key: AppMode; label: string; icon: React.ReactNode }[] = [
  { key: 'customer', label: 'Foydalanuvchi', icon: <PersonOutline /> },
  { key: 'branch', label: 'Filial', icon: <StorefrontOutlined /> },
  { key: 'admin', label: 'Admin', icon: <AdminPanelSettingsOutlined /> },
];

export default function Navbar() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { mode, setMode, cart, setCartOpen, customerTab, user, setLoginModalOpen, setProfileOpen, setCurrentBranch, mobileMenuOpen, setMobileMenuOpen } = useStore();
  const totalItems = cart.reduce((s, c) => s + c.quantity, 0);

  const handleModeChange = (newMode: AppMode) => {
    setMode(newMode);
    if (newMode === 'branch') setCurrentBranch(null);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          background: 'linear-gradient(135deg, #E60000 0%, #B30000 100%)',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <Toolbar sx={{ px: { xs: 2, md: 3 }, minHeight: { xs: 60, md: 64 } }}>
          {/* Hamburger (mobile only) */}
          {isMobile && (
            <IconButton
              color="inherit"
              edge="start"
              onClick={() => setMobileMenuOpen(true)}
              sx={{ mr: 1 }}
            >
              <MenuIcon />
            </IconButton>
          )}

          {/* Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexGrow: isMobile ? 1 : 0 }}>
            <LocalFireDepartmentOutlined sx={{ color: '#FFD700', fontSize: 28 }} />
            <Typography
              variant="h6"
              sx={{ fontWeight: 900, color: '#fff', letterSpacing: '-0.5px', fontSize: { xs: '1rem', md: '1.2rem' } }}
            >
              G'uncha <span style={{ color: '#FFD700' }}>HotFood</span>
            </Typography>
          </Box>

          {/* Desktop Mode Toggle */}
          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 0.5, mx: 'auto', bgcolor: 'rgba(0,0,0,0.2)', borderRadius: 3, p: 0.5 }}>
              {MODES.map(({ key, label }) => (
                <Button
                  key={key}
                  onClick={() => handleModeChange(key)}
                  variant={mode === key ? 'contained' : 'text'}
                  size="small"
                  sx={{
                    color: mode === key ? '#1a1a1a' : 'rgba(255,255,255,0.85)',
                    bgcolor: mode === key ? '#FFD700 !important' : 'transparent',
                    px: 2,
                    py: 0.75,
                    borderRadius: 2,
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    '&:hover': { bgcolor: mode === key ? '#FFD700' : 'rgba(255,255,255,0.15)' },
                  }}
                >
                  {label.toUpperCase()}
                </Button>
              ))}
            </Box>
          )}

          {/* Right: Cart + Auth */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: isMobile ? 0 : 'auto' }}>
            {mode === 'customer' && customerTab === 'menu' && (
              <IconButton
                color="inherit"
                onClick={() => setCartOpen(true)}
                sx={{ bgcolor: 'rgba(255,255,255,0.15)', '&:hover': { bgcolor: 'rgba(255,255,255,0.25)' } }}
              >
                <Badge badgeContent={totalItems} color="warning" max={99}>
                  <ShoppingCartOutlined />
                </Badge>
              </IconButton>
            )}
            {mode === 'customer' && (
              user ? (
                <IconButton onClick={() => setProfileOpen(true)} sx={{ p: 0.5 }}>
                  <Avatar
                    src={user.avatar}
                    sx={{ width: 34, height: 34, border: '2px solid #FFD700' }}
                  >
                    {user.name[0]}
                  </Avatar>
                </IconButton>
              ) : (
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => setLoginModalOpen(true)}
                  sx={{
                    color: '#fff',
                    borderColor: 'rgba(255,255,255,0.5)',
                    '&:hover': { borderColor: '#fff', bgcolor: 'rgba(255,255,255,0.1)' },
                    fontSize: '0.75rem',
                    px: 1.5,
                  }}
                  startIcon={<AccountCircle fontSize="small" />}
                >
                  {isMobile ? 'Kirish' : 'Kirish'}
                </Button>
              )
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        PaperProps={{ sx: { width: 280, borderRadius: '0 20px 20px 0' } }}
      >
        <Box sx={{ background: 'linear-gradient(135deg, #E60000 0%, #B30000 100%)', p: 3, color: '#fff' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <LocalFireDepartmentOutlined sx={{ color: '#FFD700' }} />
            <Typography fontWeight={900} fontSize="1.1rem">
              G'uncha <span style={{ color: '#FFD700' }}>HotFood</span>
            </Typography>
          </Box>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
            Eng mazali tezkor ovqat!
          </Typography>
        </Box>

        <Box sx={{ p: 2 }}>
          <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ px: 1 }}>
            REJIM TANLASH
          </Typography>
          <List disablePadding sx={{ mt: 0.5 }}>
            {MODES.map(({ key, label, icon }) => (
              <ListItem key={key} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  selected={mode === key}
                  onClick={() => handleModeChange(key)}
                  sx={{
                    borderRadius: 2,
                    '&.Mui-selected': { bgcolor: 'primary.main', color: '#fff', '& .MuiListItemIcon-root': { color: '#fff' } },
                    '&.Mui-selected:hover': { bgcolor: 'primary.dark' },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 36, color: mode === key ? '#fff' : 'text.secondary' }}>{icon}</ListItemIcon>
                  <ListItemText primary={label} primaryTypographyProps={{ fontWeight: 700 }} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>

        <Divider />
        {mode === 'customer' && (
          <Box sx={{ p: 2 }}>
            {user ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 1.5, bgcolor: 'grey.50', borderRadius: 2 }}>
                <Avatar src={user.avatar} sx={{ width: 40, height: 40, border: '2px solid', borderColor: 'primary.main' }}>
                  {user.name[0]}
                </Avatar>
                <Box>
                  <Typography fontWeight={700} fontSize="0.875rem">{user.name}</Typography>
                  <Typography variant="caption" color="text.secondary">{user.email}</Typography>
                </Box>
              </Box>
            ) : (
              <Button
                fullWidth
                variant="contained"
                onClick={() => { setLoginModalOpen(true); setMobileMenuOpen(false); }}
                startIcon={<AccountCircle />}
                sx={{ mt: 0.5 }}
              >
                Google orqali kirish
              </Button>
            )}
          </Box>
        )}
      </Drawer>
    </>
  );
}
