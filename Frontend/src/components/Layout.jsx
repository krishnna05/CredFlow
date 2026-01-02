import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { Menu } from "lucide-react";
import "./Layout.css"; // We will add layout specific CSS here

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-layout">
      {/* Mobile Overlay */}
      <div 
        className={`mobile-overlay ${sidebarOpen ? "active" : ""}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar Component */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <main className="main-content">
        {/* Mobile Header Trigger */}
        <div className="mobile-header">
           <div className="brand-lockup">
              <div className="logo-box">C</div>
              <span className="brand-name">CredFlow</span>
           </div>
           <button onClick={() => setSidebarOpen(true)} className="menu-trigger">
              <Menu size={24} color="#fff"/>
           </button>
        </div>

        {/* Page Content Rendered Here */}
        <Outlet />
      </main>
    </div>
  );
}