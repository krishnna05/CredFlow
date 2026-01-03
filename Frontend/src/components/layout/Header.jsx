import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  PieChart,
  History,
  LogOut
} from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import clsx from 'clsx';

const NavItem = ({ to, icon: Icon, label, end = false, activePaths = [] }) => {
  const location = useLocation();
  const isAdditionalPathActive = activePaths.some(path => location.pathname.startsWith(path));

  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        clsx(
          'flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all duration-300 text-xs font-semibold',
          (isActive || isAdditionalPathActive)
            ? 'bg-[#D1F34B] text-gray-900 shadow-[0_0_10px_rgba(209,243,75,0.4)] scale-105 transform'
            : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
        )
      }
    >
      <Icon className="w-3.5 h-3.5" />
      <span>{label}</span>
    </NavLink>
  );
};

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
      <nav className="flex items-center justify-between w-full max-w-4xl bg-white/80 backdrop-blur-xl px-2 py-1.5 rounded-full shadow-xl border border-white/50 pointer-events-auto">

        {/* Logo Section */}
        <div className="flex items-center pl-3 pr-4">
          <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center mr-2.5 shadow-md">
            <span className="text-[#D1F34B] font-bold text-base">C</span>
          </div>
          <span className="font-bold text-gray-900 tracking-tight text-base">CredFlow</span>
        </div>

        {/* Navigation Items */}
        <div className="hidden md:flex items-center gap-0.5">
          <NavItem to="/dashboard" icon={LayoutDashboard} label="Overview" end activePaths={['/onboarding']} />
          <NavItem to="/invoices" icon={FileText} label="Payments" />
          <NavItem to="/upload" icon={PlusCircle} label="Services" />
          <NavItem to="/analytics" icon={PieChart} label="Analytics" />
          <NavItem to="/history" icon={History} label="History" />
        </div>

        {/* User Profile & Logout */}
        <div className="flex items-center gap-2 pr-1 border-l border-gray-200 pl-3 ml-1">
          <div className="hidden lg:flex flex-col items-end">
            <span className="text-xs font-bold text-gray-900 leading-tight">{user?.name || 'Business'}</span>
            <span className="text-[10px] text-gray-500 uppercase tracking-wide font-medium">{user?.role}</span>
          </div>

          <button
            onClick={handleLogout}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors duration-200"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Header;