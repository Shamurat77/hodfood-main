import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import TrendingUpOutlined from '@mui/icons-material/TrendingUpOutlined';
import ShoppingBagOutlined from '@mui/icons-material/ShoppingBagOutlined';
import StorefrontOutlined from '@mui/icons-material/StorefrontOutlined';
import EmojiEventsOutlined from '@mui/icons-material/EmojiEventsOutlined';
import BarChartOutlined from '@mui/icons-material/BarChartOutlined';
import { motion } from 'framer-motion';
import { useStore } from '../../store/useStore';
import { BRANCHES } from '../../data/menuData';
import type { StatsFilter } from '../../types';

function isInPeriod(date: Date, filter: StatsFilter): boolean {
  const now = new Date();
  const diff = (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24);
  if (filter === 'daily') return diff < 1;
  if (filter === 'weekly') return diff < 7;
  return diff < 30;
}

const RANK_CONFIG = [
  { emoji: '👑', label: 'Oltin toj', bg: 'linear-gradient(135deg, #FFD700, #FFA500)', border: '#FFD700', textColor: '#7A4900' },
  { emoji: '🥈', label: 'Kumush toj', bg: 'linear-gradient(135deg, #C0C0C0, #A8A8A8)', border: '#C0C0C0', textColor: '#555' },
  { emoji: '🥉', label: 'Bronza', bg: 'linear-gradient(135deg, #CD7F32, #A0522D)', border: '#CD7F32', textColor: '#5C3011' },
];

export default function Dashboard() {
  const { orders, statsFilter, setStatsFilter, statsBranch, setStatsBranch } = useStore();

  const filteredOrders = orders.filter((o) => {
    const inPeriod = isInPeriod(o.createdAt, statsFilter);
    const inBranch = statsBranch === 'all' || o.branch === statsBranch;
    return inPeriod && inBranch;
  });

  const totalRevenue = filteredOrders.reduce((s, o) => s + o.total, 0);
  const totalCount = filteredOrders.length;

  // Branch leaderboard (all time for ranking, filtered for display)
  const leaderboard = BRANCHES.map((b) => {
    const branchOrders = filteredOrders.filter((o) => o.branch === b);
    return { name: b, revenue: branchOrders.reduce((s, o) => s + o.total, 0), count: branchOrders.length };
  }).sort((a, b) => b.revenue - a.revenue);

  const topBranch = leaderboard[0]?.name ?? 'N/A';
  const maxRevenue = Math.max(...leaderboard.map((b) => b.revenue), 1);

  const PERIOD_LABEL = { daily: 'Bugun', weekly: 'Bu hafta', monthly: 'Bu oy' };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Typography fontWeight={900} fontSize="1.5rem">Boshqaruv paneli</Typography>

        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Time filter */}
          <ToggleButtonGroup
            value={statsFilter}
            exclusive
            onChange={(_, v) => v && setStatsFilter(v as StatsFilter)}
            size="small"
            sx={{ '& .MuiToggleButton-root': { px: 2, fontWeight: 700, fontSize: '0.8rem', borderRadius: 2 } }}
          >
            <ToggleButton value="daily">Kunlik</ToggleButton>
            <ToggleButton value="weekly">Haftalik</ToggleButton>
            <ToggleButton value="monthly">Oylik</ToggleButton>
          </ToggleButtonGroup>

          {/* Branch filter */}
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <Select
              value={statsBranch}
              onChange={(e) => setStatsBranch(e.target.value)}
              sx={{ borderRadius: 2, fontWeight: 600, fontSize: '0.85rem' }}
            >
              <MenuItem value="all">Umumiy</MenuItem>
              {BRANCHES.map((b) => <MenuItem key={b} value={b}>{b}</MenuItem>)}
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/* Summary cards */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(3, 1fr)' }, gap: 2, mb: 3 }}>
        {[
          {
            label: `${PERIOD_LABEL[statsFilter]} savdo`,
            value: `${totalRevenue.toLocaleString()} so'm`,
            icon: <TrendingUpOutlined />,
            gradient: 'linear-gradient(135deg, #E60000 0%, #B30000 100%)',
            sub: `${totalCount} buyurtma`,
          },
          {
            label: 'Jami buyurtmalar',
            value: totalCount,
            icon: <ShoppingBagOutlined />,
            gradient: 'linear-gradient(135deg, #FF6B00 0%, #CC5500 100%)',
            sub: `${statsFilter === 'daily' ? 'bugun' : statsFilter === 'weekly' ? 'bu hafta' : 'bu oy'}`,
          },
          {
            label: 'Eng faol filial',
            value: topBranch,
            icon: <StorefrontOutlined />,
            gradient: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
            sub: `${leaderboard[0]?.count ?? 0} buyurtma`,
          },
        ].map((card, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Paper
              sx={{
                background: card.gradient,
                borderRadius: 3,
                p: 2.5,
                color: '#fff',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <Box sx={{ position: 'absolute', top: -10, right: -10, opacity: 0.15, fontSize: '5rem' }}>
                {card.icon}
              </Box>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {card.label}
              </Typography>
              <Typography fontWeight={900} fontSize={{ xs: '1.3rem', md: '1.6rem' }} sx={{ mt: 0.5 }}>
                {card.value}
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.75)' }}>{card.sub}</Typography>
            </Paper>
          </motion.div>
        ))}
      </Box>

      {/* Charts row */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
        {/* Bar chart */}
        <Paper variant="outlined" sx={{ borderRadius: 3, p: 2.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2.5 }}>
            <BarChartOutlined color="primary" />
            <Typography fontWeight={700}>Filiallar bo'yicha savdo</Typography>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {leaderboard.map((branch) => {
              const pct = maxRevenue > 0 ? Math.max(4, (branch.revenue / maxRevenue) * 100) : 4;
              return (
                <Box key={branch.name}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="body2" fontWeight={600}>{branch.name}</Typography>
                    <Typography variant="body2" color="text.secondary">{branch.revenue.toLocaleString()} so'm</Typography>
                  </Box>
                  <Box sx={{ bgcolor: 'grey.100', borderRadius: 4, overflow: 'hidden', height: 10 }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
                      style={{
                        height: '100%',
                        background: 'linear-gradient(90deg, #E60000, #FF6B00)',
                        borderRadius: 4,
                      }}
                    />
                  </Box>
                </Box>
              );
            })}
          </Box>
        </Paper>

        {/* Leaderboard */}
        <Paper variant="outlined" sx={{ borderRadius: 3, p: 2.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <EmojiEventsOutlined color="warning" />
            <Typography fontWeight={700}>Filiallar reytingi</Typography>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {leaderboard.map((branch, idx) => {
              const rank = RANK_CONFIG[idx];
              return (
                <motion.div
                  key={branch.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Paper
                    elevation={0}
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      border: rank ? `2px solid ${rank.border}` : '1px solid',
                      borderColor: rank ? rank.border : 'divider',
                      background: rank ? rank.bg : 'transparent',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                    }}
                  >
                    <Typography fontSize="1.5rem" sx={{ lineHeight: 1 }}>
                      {rank ? rank.emoji : `#${idx + 1}`}
                    </Typography>
                    <Box sx={{ flex: 1 }}>
                      <Typography fontWeight={800} fontSize="0.9rem" sx={{ color: rank ? rank.textColor : 'text.primary' }}>
                        {branch.name}
                      </Typography>
                      {rank && (
                        <Typography variant="caption" sx={{ color: rank.textColor, opacity: 0.8 }}>{rank.label}</Typography>
                      )}
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography fontWeight={900} fontSize="0.9rem" sx={{ color: rank ? rank.textColor : 'text.primary' }}>
                        {branch.revenue.toLocaleString()}
                      </Typography>
                      <Typography variant="caption" sx={{ color: rank ? rank.textColor : 'text.secondary', opacity: 0.8 }}>
                        so'm
                      </Typography>
                    </Box>
                  </Paper>
                </motion.div>
              );
            })}
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}
