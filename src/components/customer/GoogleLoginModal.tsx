import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { useStore } from '../../store/useStore';
import { motion } from 'framer-motion';
import { auth, googleProvider, db } from '../../firebase'; // db qo'shildi
import { signInWithPopup } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'; // Firestore funksiyalari qo'shildi

export default function GoogleLoginModal() {
  const { loginModalOpen, setLoginModalOpen, login } = useStore();

  const handleGoogleLogin = async () => {
    try {
      // 1. Google orqali avtorizatsiya
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // 2. Foydalanuvchi ma'lumotlarini tayyorlash
      const userData = {
        name: user.displayName || 'Foydalanuvchi',
        email: user.email || '',
        avatar: user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`,
        lastLogin: serverTimestamp(), // Qachon kirganini belgilab qo'yamiz
      };

      // 3. Firestore 'users' kolleksiyasiga saqlash (ID sifatida user.uid ishlatamiz)
      // { merge: true } — agar foydalanuvchi oldin kirgan bo'lsa, ma'lumotlarini ustidan yozib yubormaydi
      await setDoc(doc(db, 'users', user.uid), userData, { merge: true });

      // 4. Mahalliy (Zustand) store'ga saqlash
      login({
        ...userData,
        lastLogin: new Date().toISOString() // Lokal state uchun sana matn formatida bo'lgani yaxshi
      } as any);

    } catch (error) {
      console.error("Google orqali kirishda xatolik:", error);
      alert("Tizimga kirishda bekor qilindi yoki xatolik yuz berdi.");
    }
  };

  return (
    <Dialog
      open={loginModalOpen}
      onClose={() => setLoginModalOpen(false)}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        component: motion.div,
        initial: { scale: 0.9, opacity: 0 },
        animate: { scale: 1, opacity: 1 },
        transition: { duration: 0.2 },
        sx: { borderRadius: 4 },
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography fontWeight={700} fontSize="1.1rem">Tizimga kirish</Typography>
          <IconButton size="small" onClick={() => setLoginModalOpen(false)}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ pt: 2, pb: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3, textAlign: 'center' }}>
          Buyurtma berish va xaridlar tarixini ko'rish uchun profilingizga kiring
        </Typography>
        
        <Button
          variant="outlined"
          fullWidth
          onClick={handleGoogleLogin}
          sx={{ 
            py: 1.5, 
            borderRadius: 2, 
            color: 'text.primary', 
            borderColor: 'grey.300',
            textTransform: 'none',
            fontWeight: 600,
            fontSize: '1rem',
            '&:hover': { bgcolor: 'grey.50', borderColor: 'grey.400' }
          }}
          startIcon={
            <Box
              component="img"
              src="https://www.google.com/favicon.ico"
              alt="Google"
              sx={{ width: 24, height: 24, mr: 1 }}
            />
          }
        >
          Google orqali kirish
        </Button>
      </DialogContent>
    </Dialog>
  );
}