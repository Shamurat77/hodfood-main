import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import DashboardOutlined from '@mui/icons-material/DashboardOutlined';
import TapasOutlined from '@mui/icons-material/TapasOutlined';
import StorefrontOutlined from '@mui/icons-material/StorefrontOutlined';
import HistoryOutlined from '@mui/icons-material/HistoryOutlined';
import ShieldOutlined from '@mui/icons-material/ShieldOutlined';
import MenuIcon from '@mui/icons-material/Menu';
import { useState } from 'react';
import { useStore } from '../../store/useStore';
import Dashboard from './Dashboard';
import MenuManagement from './MenuManagement';
import BranchesList from './BranchesList';
import GlobalHistory from './GlobalHistory';
import type { AdminSection } from '../../types';

const SIDEBAR_WIDTH = 240;

const SECTIONS: { key: AdminSection; label: string; icon: React.ReactNode }[] = [
  { key: 'dashboard', label: 'Boshqaruv paneli', icon: <DashboardOutlined /> },
  { key: 'menu', label: 'Menyuni tahrirlash', icon: <TapasOutlined /> },
  { key: 'branches', label: 'Filiallar', icon: <StorefrontOutlined /> },
  { key: 'history', label: 'Xaridlar tarixi', icon: <HistoryOutlined /> },
];

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const { adminSection, setAdminSection } = useStore();
  return (
    <Box sx={{ width: SIDEBAR_WIDTH, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box
        sx={{
          background: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 100%)',
          p: 2.5,
          color: '#fff',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
          <ShieldOutlined sx={{ color: '#FFD700', fontSize: 22 }} />
          <Typography fontWeight={900} fontSize="0.95rem" color="#fff">Super Admin Panel</Typography>
        </Box>
        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>G'uncha HotFood</Typography>
      </Box>

      <Box sx={{ flex: 1, bgcolor: '#1a1a2e', p: 1.5 }}>
        <List disablePadding sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          {SECTIONS.map(({ key, label, icon }) => (
            <ListItem key={key} disablePadding>
              <ListItemButton
                selected={adminSection === key}
                onClick={() => { setAdminSection(key); onClose?.(); }}
                sx={{
                  borderRadius: 2,
                  color: adminSection === key ? '#fff' : 'rgba(255,255,255,0.5)',
                  '&.Mui-selected': {
                    bgcolor: 'rgba(230,0,0,0.8)',
                    color: '#fff',
                    '& .MuiListItemIcon-root': { color: '#fff' },
                    '&:hover': { bgcolor: 'rgba(230,0,0,0.9)' },
                  },
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.08)' },
                }}
              >
                <ListItemIcon sx={{ minWidth: 36, color: adminSection === key ? '#fff' : 'rgba(255,255,255,0.5)' }}>
                  {icon}
                </ListItemIcon>
                <ListItemText
                  primary={label}
                  primaryTypographyProps={{ fontWeight: 600, fontSize: '0.85rem' }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );
}

export default function AdminView() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { adminSection } = useStore();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const SectionComponent = {
    dashboard: Dashboard,
    menu: MenuManagement,
    branches: BranchesList,
    history: GlobalHistory,
  }[adminSection];

  return (
    <Box sx={{ display: 'flex', minHeight: 'calc(100vh - 64px)' }}>
      {/* Desktop sidebar */}
      {!isMobile && (
        <Box sx={{ width: SIDEBAR_WIDTH, flexShrink: 0 }}>
          <Box sx={{ position: 'sticky', top: 64, height: 'calc(100vh - 64px)', overflow: 'auto' }}>
            <SidebarContent />
          </Box>
        </Box>
      )}

      {/* Mobile sidebar */}
      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{ sx: { width: SIDEBAR_WIDTH, borderRadius: '0 16px 16px 0' } }}
      >
        <SidebarContent onClose={() => setDrawerOpen(false)} />
      </Drawer>

      {/* Main content */}
      <Box sx={{ flex: 1, overflow: 'auto', bgcolor: 'background.default' }}>
        <Container maxWidth="xl" sx={{ px: { xs: 1.5, sm: 3 }, py: 3 }}>
          {isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <IconButton onClick={() => setDrawerOpen(true)} size="small" sx={{ bgcolor: 'primary.main', color: '#fff', '&:hover': { bgcolor: 'primary.dark' } }}>
                <MenuIcon />
              </IconButton>
              <Typography variant="caption" color="text.secondary" fontWeight={600}>
                {SECTIONS.find((s) => s.key === adminSection)?.label}
              </Typography>
            </Box>
          )}
          <SectionComponent />
        </Container>
      </Box>
    </Box>
  );
}
