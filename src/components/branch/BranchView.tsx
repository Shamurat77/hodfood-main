import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import ArrowBackIos from '@mui/icons-material/ArrowBackIos';
import DashboardOutlined from '@mui/icons-material/DashboardOutlined';
import HistoryOutlined from '@mui/icons-material/HistoryOutlined';
import StorefrontOutlined from '@mui/icons-material/StorefrontOutlined';
import { motion } from 'framer-motion';
import { useStore } from '../../store/useStore';
import BranchSelector from './BranchSelector';
import KanbanBoard from './KanbanBoard';
import BranchHistory from './BranchHistory';

export default function BranchView() {
  const { currentBranch, setCurrentBranch, branchTab, setBranchTab, orders } = useStore();

  if (!currentBranch) return <BranchSelector />;

  const activeCount = orders.filter((o) => o.branch === currentBranch && o.status !== 'completed').length;

  return (
    <Container maxWidth="lg" sx={{ px: { xs: 1.5, sm: 3 }, pt: 2 }}>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        {/* Branch Header */}
        <Paper
          elevation={0}
          sx={{
            background: 'linear-gradient(135deg, #E60000 0%, #FF6B00 100%)',
            borderRadius: 3,
            p: 2.5,
            mb: 2.5,
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Button
            size="small"
            onClick={() => setCurrentBranch(null)}
            startIcon={<ArrowBackIos fontSize="small" />}
            sx={{ color: 'rgba(255,255,255,0.8)', minWidth: 'auto', '&:hover': { color: '#fff', bgcolor: 'rgba(255,255,255,0.15)' } }}
          >
            Filiallar
          </Button>
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <StorefrontOutlined sx={{ fontSize: 28 }} />
              <Typography fontWeight={900} fontSize="1.3rem">{currentBranch} filiali</Typography>
            </Box>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>
              Toshkent shahri
            </Typography>
          </Box>
          {activeCount > 0 && (
            <Chip
              label={`${activeCount} faol buyurtma`}
              sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: '#fff', fontWeight: 700, animation: 'pulse 2s infinite' }}
            />
          )}
        </Paper>

        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2.5 }}>
          <Tabs value={branchTab} onChange={(_, v) => setBranchTab(v)} textColor="primary" indicatorColor="primary">
            <Tab
              value="orders"
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                  <DashboardOutlined fontSize="small" />
                  Faol buyurtmalar
                  {activeCount > 0 && (
                    <Chip label={activeCount} color="error" size="small" sx={{ height: 18, fontSize: '0.65rem', fontWeight: 800 }} />
                  )}
                </Box>
              }
            />
            <Tab
              value="history"
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                  <HistoryOutlined fontSize="small" />
                  Xaridlar tarixi
                </Box>
              }
            />
          </Tabs>
        </Box>

        {branchTab === 'orders' && <KanbanBoard branch={currentBranch} />}
        {branchTab === 'history' && <BranchHistory branch={currentBranch} />}
      </motion.div>
    </Container>
  );
}
