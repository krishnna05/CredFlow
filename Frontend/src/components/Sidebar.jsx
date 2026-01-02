import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { 
  LayoutDashboard, 
  FileText, 
  Wallet, 
  ShieldAlert, 
  Bell, 
  Settings, 
  HelpCircle, 
  LogOut, 
  X 
} from "lucide-react";
import "./Sidebar.css";

export default function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useAuth();

  return (
    <aside className={`sidebar-column ${isOpen ? "mobile-open" : ""}`}>
      {/* Header */}
      <div className="sidebar-header">
        <div className="brand-lockup">
          <div className="logo-box">C</div>
          <span className="brand-name">CredFlow</span>
        </div>
        <button className="mobile-close" onClick={onClose}>
          <X size={20} />
        </button>
      </div>

      {/* Content */}
      <div className="sidebar-content">
        <div className="nav-group-label">MAIN MENU</div>
        <nav className="nav-links">
          <NavLink 
            to="/dashboard" 
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
            onClick={onClose}
          >
            <LayoutDashboard size={20} /> <span>Dashboard</span>
          </NavLink>

          <NavLink 
            to="/invoices" 
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
            onClick={onClose}
          >
            <FileText size={20} /> <span>Invoices</span>
          </NavLink>

          <NavLink 
            to="/financing" 
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
            onClick={onClose}
          >
            <Wallet size={20} /> <span>Financing</span>
          </NavLink>

          <NavLink 
            to="/risk" 
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
            onClick={onClose}
          >
            <ShieldAlert size={20} /> <span>Risk & Fraud</span>
          </NavLink>
        </nav>

        <div className="nav-group-label">SYSTEM</div>
        <nav className="nav-links">
          <NavLink 
            to="/notifications" 
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
            onClick={onClose}
          >
            <Bell size={20} /> <span>Notifications</span>
            <span className="nav-badge">3</span>
          </NavLink>
          <NavLink 
            to="/settings" 
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
            onClick={onClose}
          >
            <Settings size={20} /> <span>Settings</span>
          </NavLink>
          <NavLink 
            to="/support" 
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
            onClick={onClose}
          >
            <HelpCircle size={20} /> <span>Support</span>
          </NavLink>
        </nav>
      </div>

      {/* Footer */}
      <div className="sidebar-footer">
        <div className="user-card">
          <div className="avatar">
            {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
          </div>
          <div className="user-meta">
            <span className="name">{user?.name || "User"}</span>
            <span className="role">
              {user?.role === "admin" ? "Administrator" : "Business Account"}
            </span>
          </div>
          <button className="logout-btn" onClick={logout} title="Logout">
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}