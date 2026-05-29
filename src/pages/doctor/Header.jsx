import React from 'react';

const Header = ({ user }) => {
  return (
    <header className="main-header">
      <div className="search-bar"><span className="search-icon"> 🔍 </span><input type="text" placeholder="Tìm kiếm bệnh nhân (ID, Tên)..." /></div>
      <div className="user-profile">
        <span className="notification-icon"> 🔔  <span className="badge">3</span></span>
        <img src="https://api.dicebear.com/8.x/adventurer/svg?seed=NVA" alt="Avatar Bác sĩ" className="avatar" />
        <div className="user-info">
          <span className="user-name">BS. {user ? user.fullName : 'Đang tải...'}</span>
          <span className="user-role">ID: {user?.id || user?.userId || 'N/A'}</span>
        </div>
        <span className="dropdown-icon">▼</span>
      </div>
    </header>
  );
};
export default Header;