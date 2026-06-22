import { useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import Chip from '@mui/material/Chip'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Divider from '@mui/material/Divider'
import HistoryOutlined from '@mui/icons-material/HistoryOutlined'
import FilterListOutlined from '@mui/icons-material/FilterListOutlined'
import { useStore } from '../../store/useStore'
import { BRANCHES, STATUS_LABELS } from '../../data/menuData'
import type { OrderStatus } from '../../types'

const STATUS_COLORS: Record<
  OrderStatus,
  'info' | 'warning' | 'secondary' | 'success'
> = {
  new: 'info',
  preparing: 'warning',
  onway: 'secondary',
  completed: 'success'
}

export default function GlobalHistory () {
  const { orders } = useStore()
  const [filterBranch, setFilterBranch] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')

  const filtered = orders
    .filter(o => filterBranch === 'all' || o.branch === filterBranch)
    .filter(o => filterStatus === 'all' || o.status === filterStatus)
    .slice()
    .reverse()

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <HistoryOutlined color='primary' />
        <Typography fontWeight={900} fontSize='1.5rem'>
          Xaridlar tarixi
        </Typography>
        <Chip
          label={filtered.length}
          size='small'
          sx={{ fontWeight: 800, ml: 0.5 }}
        />
      </Box>

      {/* Filters */}
      <Paper
        variant='outlined'
        sx={{
          p: 2,
          borderRadius: 3,
          mb: 2,
          display: 'flex',
          gap: 2,
          flexWrap: 'wrap',
          alignItems: 'center'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FilterListOutlined fontSize='small' color='action' />
          <Typography variant='body2' fontWeight={700} color='text.secondary'>
            Filter:
          </Typography>
        </Box>
        <FormControl size='small' sx={{ minWidth: 150 }}>
          <InputLabel>Filial</InputLabel>
          <Select
            value={filterBranch}
            label='Filial'
            onChange={e => setFilterBranch(e.target.value)}
            sx={{ borderRadius: 2 }}
          >
            <MenuItem value='all'>Barcha filiallar</MenuItem>
            {BRANCHES.map(b => (
              <MenuItem key={b} value={b}>
                {b}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl size='small' sx={{ minWidth: 160 }}>
          <InputLabel>Holat</InputLabel>
          <Select
            value={filterStatus}
            label='Holat'
            onChange={e => setFilterStatus(e.target.value)}
            sx={{ borderRadius: 2 }}
          >
            <MenuItem value='all'>Barcha holatlar</MenuItem>
            {Object.entries(STATUS_LABELS).map(([k, v]) => (
              <MenuItem key={k} value={k}>
                {v}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Paper>

      {filtered.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <HistoryOutlined sx={{ fontSize: 56, color: 'grey.200', mb: 2 }} />
          <Typography color='text.secondary'>Buyurtmalar topilmadi</Typography>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {filtered.map(order => (
            <Paper
              key={order.id}
              variant='outlined'
              sx={{ borderRadius: 3, overflow: 'hidden' }}
            >
              <Box
                sx={{
                  px: 2.5,
                  py: 1.5,
                  bgcolor: 'grey.50',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: 1
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    flexWrap: 'wrap'
                  }}
                >
                  <Typography fontWeight={800}>#{order.id}</Typography>
                  <Chip
                    label={order.branch}
                    size='small'
                    color='warning'
                    variant='outlined'
                    sx={{ height: 22, fontSize: '0.7rem', fontWeight: 700 }}
                  />
                  <Typography variant='caption' color='text.secondary'>
                    {order.createdAt.toLocaleDateString('uz-UZ')}
                  </Typography>
                </Box>
                <Chip
                  label={STATUS_LABELS[order.status]}
                  color={STATUS_COLORS[order.status]}
                  size='small'
                  sx={{ fontWeight: 700, height: 24 }}
                />
              </Box>
              <Box sx={{ px: 2.5, py: 1.5 }}>
                <Typography variant='body2' fontWeight={700} sx={{ mb: 0.5 }}>
                  {order.customerName} • {order.phone}
                </Typography>
                <Typography
                  variant='caption'
                  color='text.secondary'
                  display='block'
                  sx={{ mb: 0.5 }}
                >
                  📍 {order.address}
                </Typography>
                {order.items.map((item, i) => (
                  <Box
                    key={i}
                    sx={{ display: 'flex', justifyContent: 'space-between' }}
                  >
                    <Typography variant='caption' color='text.secondary'>
                      {item.menuItem.name} {item.spicySauce ? '🌶️' : ''} ×{' '}
                      {item.quantity}
                    </Typography>
                    <Typography variant='caption'>
                      {(item.menuItem.price * item.quantity).toLocaleString()}{' '}
                      so'm
                    </Typography>
                  </Box>
                ))}
                <Divider sx={{ my: 0.5 }} />
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <Typography variant='caption' color='text.secondary'>
                    {order.paymentMethod === 'cash' ? '💵 Naqd' : '💳 Karta'} •{' '}
                    {order.orderType === 'delivery'
                      ? '🚴 Yetkazib berish'
                      : '🏪 Olib ketish'}
                  </Typography>
                  <Typography fontWeight={900} color='primary'>
                    {order.total.toLocaleString()} so'm
                  </Typography>
                </Box>
              </Box>
            </Paper>
          ))}
        </Box>
      )}
    </Box>
  )
}
