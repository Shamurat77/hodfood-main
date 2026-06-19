import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useStore } from './store/useStore';
import theme from './theme';
import Navbar from './components/Navbar';
import CustomerView from './components/customer/CustomerView';
import BranchView from './components/branch/BranchView';
import AdminView from './components/admin/AdminView';

function App() {
  const { mode } = useStore();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        {mode === 'customer' && <CustomerView />}
        {mode === 'branch' && <BranchView />}
        {mode === 'admin' && <AdminView />}
      </div>
    </ThemeProvider>
  );
}

export default App;
