import { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import LocationOnOutlined from '@mui/icons-material/LocationOnOutlined';
import CircularProgress from '@mui/material/CircularProgress';
import { YMaps, Map, Placemark, ZoomControl, GeolocationControl } from '@pbe/react-yandex-maps';

interface Props {
  onSelect: (address: string) => void;
  onClose: () => void;
}

export default function MapModal({ onSelect, onClose }: Props) {
  const [ymaps, setYmaps] = useState<any>(null);
  const [coords, setCoords] = useState<number[]>([41.2995, 69.2401]); // Odatiy joy: Toshkent markazi
  const [address, setAddress] = useState<string>('');
  const [loading, setLoading] = useState(false);

  // Xaritada biror joy bosilganda
  const handleMapClick = (e: any) => {
    const clickedCoords = e.get('coords');
    setCoords(clickedCoords);
    fetchAddress(clickedCoords);
  };

  // Koordinata orqali manzil matnini topish (Geocoding)
  const fetchAddress = (coordinates: number[]) => {
    if (!ymaps) return;
    setLoading(true);
    ymaps.geocode(coordinates).then((res: any) => {
      const firstGeoObject = res.geoObjects.get(0);
      if (firstGeoObject) {
        // Yandex qaytargan to'liq manzil
        const fullAddress = firstGeoObject.getAddressLine();
        // O'zbekiston, Toshkent degan yozuvlarni olib tashlab, faqat ko'cha/uy qoldiramiz
        const cleanAddress = fullAddress
          .replace("Oʻzbekiston, Toshkent, ", "")
          .replace("Узбекистан, Ташкент, ", "")
          .replace("Oʻzbekiston, ", "")
          .replace("Узбекистан, ", "");
        
        setAddress(cleanAddress);
      } else {
        setAddress("Manzil aniqlanmadi");
      }
      setLoading(false);
    }).catch(() => {
      setAddress("Tarmoqda xatolik yuz berdi");
      setLoading(false);
    });
  };

  return (
    <Dialog open onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 4, overflow: 'hidden' } }}>
      <DialogTitle sx={{ pb: 1.5, boxShadow: '0 2px 10px rgba(0,0,0,0.05)', zIndex: 10 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LocationOnOutlined color="error" />
            <Typography fontWeight={800} fontSize="1.1rem">Xaritadan belgilash</Typography>
          </Box>
          <IconButton size="small" onClick={onClose}><CloseIcon fontSize="small" /></IconButton>
        </Box>
      </DialogTitle>
      
      <DialogContent sx={{ p: 0, display: 'flex', flexDirection: 'column' }}>
        {/* Yandex Xaritasi */}
        <Box sx={{ width: '100%', height: 400, position: 'relative' }}>
          <YMaps query={{ lang: 'uz_UZ' as any, load: 'geocode' }}>
            <Map
              defaultState={{ center: [41.2995, 69.2401], zoom: 12 }}
              state={{ center: coords, zoom: 15 }}
              width="100%"
              height="100%"
              onClick={handleMapClick}
              onLoad={(y) => setYmaps(y)}
              modules={['geocode']}
            >
              <ZoomControl options={{ position: { right: 10, top: 50 } }} />
              <GeolocationControl options={{ position: { right: 10, top: 10 } }} />
              {coords && (
                <Placemark 
                  geometry={coords} 
                  options={{ preset: 'islands#redDotIcon' }}
                />
              )}
            </Map>
          </YMaps>
        </Box>

        {/* Tanlangan manzilni ko'rsatish */}
        <Box sx={{ p: 2.5, bgcolor: 'grey.50', minHeight: 90, display: 'flex', alignItems: 'center', borderTop: '1px solid', borderColor: 'divider' }}>
          {loading ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <CircularProgress size={24} color="error" />
              <Typography variant="body2" color="text.secondary" fontWeight={600}>Manzil aniqlanmoqda...</Typography>
            </Box>
          ) : (
            <Box>
              <Typography variant="caption" color="text.secondary" fontWeight={700} display="block" mb={0.5} textTransform="uppercase">
                Aniqlangan manzil:
              </Typography>
              <Typography variant="body1" fontWeight={700} color={address ? 'text.primary' : 'text.disabled'}>
                {address || "Xaritadan o'z manzilingizni ustiga bosing 👆"}
              </Typography>
            </Box>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2.5, bgcolor: 'grey.50', pt: 0 }}>
        <Button onClick={onClose} color="inherit" sx={{ fontWeight: 700 }}>Bekor qilish</Button>
        <Button 
          onClick={() => onSelect(address)} 
          variant="contained" 
          disabled={!address || loading}
          sx={{ borderRadius: 2, px: 4, fontWeight: 800, bgcolor: 'error.main', '&:hover': { bgcolor: 'error.dark' } }}
        >
          Shu manzilni tasdiqlash
        </Button>
      </DialogActions>
    </Dialog>
  );
}