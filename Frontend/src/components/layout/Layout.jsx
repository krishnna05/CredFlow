import { Outlet, Navigate } from 'react-router-dom';
import Header from './Header';
import useAuth from '../../hooks/useAuth';
import { Toaster } from 'react-hot-toast';

const Layout = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 bg-slate-800 rounded-full mb-4"></div>
          <div className="h-4 w-32 bg-slate-800 rounded"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    // 1. Updated Container Classes
    <div className="min-h-screen w-full bg-slate-950 font-sans selection:bg-indigo-500/30 text-slate-200">
      
      {/* 2. ADDED: Background Effects */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[800px] h-[800px] bg-indigo-600/20 rounded-full blur-[120px] mix-blend-screen animate-pulse duration-1000" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[100px] mix-blend-screen" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
      </div>

      <Header />

      {/* 3. Updated Main: Added relative and z-10 to sit above background */}
      <main className="pt-28 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
        <div className="animate-in fade-in duration-500 slide-in-from-bottom-4">
          <Outlet />
        </div>
      </main>

      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#1e293b', // darker slate for toasts
            color: '#fff',
            borderRadius: '12px',
            border: '1px solid #334155'
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