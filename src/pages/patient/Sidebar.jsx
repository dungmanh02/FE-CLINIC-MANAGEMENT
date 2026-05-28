import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = ({ handleLogout, setIsDrugModalOpen }) => {
  return (
    <aside className="sidebar">
      <div className="logo">
        <span className="logo-icon"> ✚ </span>
        <span className="logo-text">Medi<span className="text-primary">Pro</span></span>
      </div>
      <nav className="nav-menu">
        <Link to="/patient/dashboard" className="nav-item active">
          <span className="icon"> 📊 </span> Tổng quan
        </Link>
        <Link to="/patient/profile" className="nav-item">
          <span className="icon"> 👤 </span> Thông tin cá nhân
        </Link>
        <Link to="#" className="nav-item" onClick={() => setIsDrugModalOpen(true)}>
          <span className="icon"> 💊 </span> Tra cứu giá thuốc
        </Link>
      </nav>
      <div className="sidebar-footer">
        <Link to="/" className="nav-item logout" onClick={handleLogout}>
          <span className="icon"> 🚪 </span> Đăng xuất
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;