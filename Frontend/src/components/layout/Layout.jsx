import { Outlet, Navigate } from 'react-router-dom';
import Header from './Header';
import useAuth from '../../hooks/useAuth';
import { Toaster } from 'react-hot-toast';

const Layout = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 bg-gray-300 rounded-full mb-4"></div>
          <div className="h-4 w-32 bg-gray-300 rounded"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-background font-sans text-primary">
      <Header />

      <main className="pt-28 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="animate-in fade-in duration-500 slide-in-from-bottom-4">
          <Outlet />
        </div>
      </main>

      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#1F2937',
            color: '#fff',
            borderRadius: '8px',
          },
          success: {
            iconTheme: {
              primary: '#D1F34B',
              secondary: '#1F2937',
            },
          },
        }}
      />
    </div>
  );
};

export default Layout;