import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/layout/Layout';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

import Dashboard from './pages/dashboard/Dashboard';
import BusinessProfile from './pages/onboarding/BusinessProfile';
import InvoiceList from './pages/invoices/InvoiceList';
import InvoiceDetail from './pages/invoices/InvoiceDetail';
import UploadPage from './pages/upload/UploadPage';

const Analytics = () => <div className="p-8 text-center text-gray-500">Analytics Module Coming Soon</div>;
const History = () => <div className="p-8 text-center text-gray-500">Audit Logs & History Coming Soon</div>;

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<Layout />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/onboarding" element={<BusinessProfile />} />

            <Route path="/invoices" element={<InvoiceList />} />
            <Route path="/invoices/:id" element={<InvoiceDetail />} />
            <Route path="/upload" element={<UploadPage />} />

            <Route path="/analytics" element={<Analytics />} />
            <Route path="/history" element={<History />} />
          </Route>

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;