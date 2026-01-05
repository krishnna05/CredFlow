import { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  PieChart,
  History,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import useAuth from '../../hooks/useAuth'; 
import clsx from 'clsx';

const NavItem = ({ to, icon: Icon, label, end = false, activePaths = [], onClick }) => {
  const location = useLocation();
  const isAdditionalPathActive = activePaths.some(path => location.pathname.startsWith(path));

  return (
    <NavLink
      to={to}
      end={end}
      onClick={onClick}
      className={({ isActive }) =>
        clsx(
          'flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 text-sm font-medium group relative overflow-hidden',
          'md:px-3 md:py-1.5 md:text-xs', 
          (isActive || isAdditionalPathActive)
            ? 'bg-[#D1F34B] text-gray-900 shadow-[0_2px_10px_rgba(209,243,75,0.3)] font-semibold'
            : 'text-gray-500 hover:bg-gray-100/80 hover:text-gray-900'
        )
      }
    >
      <Icon className="w-4 h-4 md:w-3.5 md:h-3.5 transition-transform group-hover:scale-110" />
      <span>{label}</span>
      
      <span className={clsx(
        "absolute bottom-0 left-0 h-full w-0.5 bg-gray-900 transition-all duration-300 opacity-0 group-hover:opacity-10 md:hidden",
      )} />
    </NavLink>
  );
};

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="fixed top-4 left-0 right-0 z-[100] flex flex-col items-center px-4 pointer-events-none">
      
      {/* MAIN NAVBAR */}
      <nav 
        className={clsx(
          "flex items-center justify-between w-full max-w-5xl transition-all duration-300 ease-in-out pointer-events-auto",
          "bg-white/90 backdrop-blur-xl border border-white/40",
          "rounded-2xl md:rounded-full px-3 py-1.5 md:py-2 shadow-xs shadow-gray-200/20",
          isMobileMenuOpen ? "rounded-b-none border-b-0" : ""
        )}
      >

        {/* Logo Section */}
        <div className="flex items-center pl-1 md:pl-3 pr-2 md:pr-4 group cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-7 h-7 md:w-8 md:h-8 bg-gray-900 rounded-full flex items-center justify-center mr-2 shadow-lg shadow-gray-900/20 transition-transform group-hover:scale-105">
            <span className="text-[#D1F34B] font-bold text-sm md:text-lg leading-none pt-0.5">C</span>
          </div>
          <span className="font-bold text-gray-900 tracking-tight text-base md:text-lg">CredFlow</span>
        </div>

        {/* Desktop Navigation Items */}
        <div className="hidden md:flex items-center bg-gray-100/50 rounded-full p-1 border border-white/20">
          <NavItem to="/dashboard" icon={LayoutDashboard} label="Overview" end activePaths={['/onboarding']} />
          <NavItem to="/invoices" icon={FileText} label="Payments" />
          <NavItem to="/upload" icon={PlusCircle} label="Services" />
          <NavItem to="/analytics" icon={PieChart} label="Analytics" />
          <NavItem to="/history" icon={History} label="History" />
        </div>

        {/* User Profile & Actions (Desktop) */}
        <div className="hidden md:flex items-center gap-3 pr-1 pl-3 border-l border-gray-200/60 ml-2">
          <div className="flex flex-col items-end text-right">
            <span className="text-xs font-bold text-gray-900 leading-tight">{user?.name || 'Business User'}</span>
            <span className="text-[10px] text-gray-500 uppercase tracking-wide font-medium">{user?.role || 'Admin'}</span>
          </div>

          <button
            onClick={handleLogout}
            className="group p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all duration-200 border border-transparent hover:border-red-100"
            title="Logout"
          >
            <LogOut className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
          </button>
        </div>

        {/* Mobile Menu Toggle & Avatar */}
        <div className="flex md:hidden items-center gap-2">
           <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-700 border border-gray-200">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
           </div>
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-full transition-colors active:scale-95"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* MOBILE MENU DROPDOWN */}
      <div 
        className={clsx(
          "w-full max-w-5xl bg-white/95 backdrop-blur-xl border border-t-0 border-white/40 shadow-xl shadow-gray-200/20 overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] pointer-events-auto md:hidden",
          "rounded-b-2xl mx-4",
          isMobileMenuOpen ? "max-h-[500px] opacity-100 py-2" : "max-h-0 opacity-0 py-0"
        )}
      >
        <div className="flex flex-col px-2 gap-1">
          <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1 px-4 mt-2">Menu</div>
          <NavItem to="/dashboard" icon={LayoutDashboard} label="Overview" end activePaths={['/onboarding']} />
          <NavItem to="/invoices" icon={FileText} label="Payments" />
          <NavItem to="/upload" icon={PlusCircle} label="Services" />
          <NavItem to="/analytics" icon={PieChart} label="Analytics" />
          <NavItem to="/history" icon={History} label="History" />
          
          <div className="h-px bg-gray-100 my-2 mx-4"></div>
          
          {/* Mobile User Section */}
          <div className="px-2 pb-2">
             <div className="flex items-center justify-between p-2 rounded-xl bg-gray-50 border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center text-[#D1F34B] font-bold text-xs">
                      {user?.name ? user.name.charAt(0).toUpperCase() : 'B'}
                  </div>
                  <div className="flex flex-col">
                      <span className="text-xs font-bold text-gray-900">{user?.name || 'Business'}</span>
                      <span className="text-[10px] text-gray-500">{user?.email || 'user@credflow.com'}</span>
                  </div>
                </div>
                <button 
                  onClick={handleLogout}
                  className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full"
                >
                  <LogOut className="w-4 h-4" />
                </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;