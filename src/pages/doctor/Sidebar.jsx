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
        <Link to="/doctor/dashboard" className="nav-item active"><span className="icon"> 📊 </span> Tổng quan</Link>
        <Link to="/doctor/appointments" className="nav-item"><span className="icon"> 📅 </span> Lịch hẹn</Link>
        <Link to="#" className="nav-item"><span className="icon"> 👤 </span> Bệnh nhân</Link>
        <Link to="#" className="nav-item" onClick={() => setIsDrugModalOpen(true)}>
          <span className="icon"> 💊 </span> Danh mục thuốc
        </Link>
        <Link to="#" className="nav-item"><span className="icon"> 📈 </span> Thống kê</Link>
      </nav>
      <div className="sidebar-footer">
        <a href="/" className="nav-item logout" onClick={handleLogout}><span className="icon"> 🚪 </span> Đăng xuất</a>
      </div>
    </aside>
  );
};
export default Sidebar;