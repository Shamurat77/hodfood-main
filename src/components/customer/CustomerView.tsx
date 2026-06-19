import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import MenuBookOutlined from '@mui/icons-material/MenuBookOutlined';
import HistoryOutlined from '@mui/icons-material/HistoryOutlined';
import { useStore } from '../../store/useStore';
import MenuCatalog from './MenuCatalog';
import Cart from './Cart';
import CheckoutForm from './CheckoutForm';
import SMSModal from './SMSModal';
import OrderReceipt from './OrderReceipt';
import GoogleLoginModal from './GoogleLoginModal';
import UserProfile from './UserProfile';
import OrderHistory from './OrderHistory';

export default function CustomerView() {
  const { customerTab, setCustomerTab } = useStore();

  return (
    <Container maxWidth="lg" sx={{ px: { xs: 1.5, sm: 3 }, pt: 2 }}>
      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs
          value={customerTab}
          onChange={(_, v) => setCustomerTab(v)}
          textColor="primary"
          indicatorColor="primary"
          sx={{ '& .MuiTab-root': { minHeight: 44, py: 1 } }}
        >
          <Tab
            value="menu"
            label="Menyu"
            icon={<MenuBookOutlined fontSize="small" />}
            iconPosition="start"
          />
          <Tab
            value="history"
            label="Xaridlar tarixi"
            icon={<HistoryOutlined fontSize="small" />}
            iconPosition="start"
          />
        </Tabs>
      </Box>

      {customerTab === 'menu' && <MenuCatalog />}
      {customerTab === 'history' && <OrderHistory />}

      <Cart />
      <CheckoutForm />
      <SMSModal />
      <OrderReceipt />
      <GoogleLoginModal />
      <UserProfile />
    </Container>
  );
}
