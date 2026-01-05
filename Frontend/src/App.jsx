import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import Layout from './components/layout/Layout';

// Pages
import LandingPage from './pages/front/LandingPage'; // Make sure LandingPage.jsx is saved here
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

import Dashboard from './pages/dashboard/Dashboard';
import BusinessProfile from './pages/onboarding/BusinessProfile';
import InvoiceList from './pages/invoices/InvoiceList';
import InvoiceDetail from './pages/invoices/InvoiceDetail';
import UploadPage from './pages/upload/UploadPage';
import AuditLogs from './pages/history/AuditLogs';
import AnalyticsPage from './pages/analytics/AnalyticsPage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NotificationProvider>
          <Routes>
            {/* ================= PUBLIC ROUTES ================= */}
            
            {/* 1. First land on Landing Page */}
            <Route path="/" element={<LandingPage />} />
            
            {/* 2. Then Signup or Login */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* ================= PROTECTED ROUTES ================= */}
            {/* Only accessible if logged in (Layout checks for user) */}
            <Route element={<Layout />}>
              
              {/* 3. If Logged In -> Dashboard */}
              <Route path="/dashboard" element={<Dashboard />} />
              
              <Route path="/onboarding" element={<BusinessProfile />} />
              <Route path="/invoices" element={<InvoiceList />} />
              <Route path="/invoices/:id" element={<InvoiceDetail />} />
              <Route path="/upload" element={<UploadPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/history" element={<AuditLogs />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
            
          </Routes>
        </NotificationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;