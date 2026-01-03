import { NavLink, useNavigate } from 'react-router-dom';
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

const NavItem = ({ to, icon: Icon, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      clsx(
        'flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 text-sm font-medium',
        isActive
          ? 'bg-accent text-primary shadow-sm'
          : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
      )
    }
  >
    <Icon className="w-4 h-4" />
    <span>{label}</span>
  </NavLink>
);

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4">
      <nav className="flex items-center justify-between w-full max-w-5xl bg-white/90 backdrop-blur-md px-2 py-2 rounded-full shadow-pill border border-gray-100">

        <div className="flex items-center pl-4 pr-6">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center mr-2">
            <span className="text-accent font-bold text-lg">C</span>
          </div>
          <span className="font-bold text-gray-900 tracking-tight">CredFlow</span>
        </div>

        <div className="flex items-center gap-1">
          <NavItem to="/dashboard" icon={LayoutDashboard} label="Overview" />
          <NavItem to="/invoices" icon={FileText} label="Payments" />
          <NavItem to="/upload" icon={PlusCircle} label="Services" />
          <NavItem to="/analytics" icon={PieChart} label="Analytics" />
          <NavItem to="/history" icon={History} label="History" />
        </div>

        <div className="flex items-center gap-3 pr-2 border-l border-gray-200 pl-4 ml-2">
          <div className="hidden md:flex flex-col items-end">
            <span className="text-xs font-semibold text-gray-900">{user?.name || 'Business'}</span>
            <span className="text-[10px] text-gray-500 uppercase tracking-wide">{user?.role}</span>
          </div>

          <button
            onClick={handleLogout}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Header;