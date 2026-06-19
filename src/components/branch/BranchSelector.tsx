import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import StorefrontOutlined from '@mui/icons-material/StorefrontOutlined';
import ArrowForwardIos from '@mui/icons-material/ArrowForwardIos';
import { motion } from 'framer-motion';
import { useStore } from '../../store/useStore';
import { BRANCHES } from '../../data/menuData';

const BRANCH_INFO: Record<string, { area: string; color: string }> = {
  Chilonzor: { area: "Toshkent, Chilonzor tumani", color: '#E60000' },
  Yunusobod: { area: "Toshkent, Yunusobod tumani", color: '#FF6B00' },
  Sergeli: { area: "Toshkent, Sergeli tumani", color: '#E60000' },
  Olmazor: { area: "Toshkent, Olmazor tumani", color: '#FF6B00' },
};

export default function BranchSelector() {
  const { setCurrentBranch, orders } = useStore();

  return (
    <Container maxWidth="sm" sx={{ pt: 4 }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <StorefrontOutlined sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
          <Typography fontWeight={900} fontSize="1.6rem" gutterBottom>Filiallar</Typography>
          <Typography color="text.secondary">Boshqarmoqchi bo'lgan filialni tanlang</Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {BRANCHES.map((branch, idx) => {
            const activeOrders = orders.filter((o) => o.branch === branch && o.status !== 'completed').length;
            const info = BRANCH_INFO[branch];

            return (
              <motion.div
                key={branch}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    borderRadius: 3,
                    overflow: 'hidden',
                    border: '1px solid',
                    borderColor: 'divider',
                    cursor: 'pointer',
                    '&:hover': { borderColor: 'primary.main', boxShadow: '0 4px 20px rgba(230,0,0,0.15)' },
                    transition: 'all 0.2s',
                  }}
                  onClick={() => setCurrentBranch(branch)}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box
                      sx={{
                        width: 8,
                        alignSelf: 'stretch',
                        background: `linear-gradient(180deg, ${info.color} 0%, ${info.color}99 100%)`,
                        flexShrink: 0,
                      }}
                    />
                    <Box sx={{ flex: 1, px: 2.5, py: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box>
                          <Typography fontWeight={800} fontSize="1.1rem">{branch} filiali</Typography>
                          <Typography variant="caption" color="text.secondary">{info.area}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {activeOrders > 0 && (
                            <Chip
                              label={`${activeOrders} faol`}
                              size="small"
                              color="error"
                              sx={{ height: 22, fontSize: '0.7rem', fontWeight: 700, animation: 'pulse 2s infinite' }}
                            />
                          )}
                          <ArrowForwardIos sx={{ fontSize: 14, color: 'text.disabled' }} />
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </Paper>
              </motion.div>
            );
          })}
        </Box>
      </motion.div>
    </Container>
  );
}
