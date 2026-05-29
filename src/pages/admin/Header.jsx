import React from 'react';

const Header = ({ searchTerm, setSearchTerm }) => {
  return (
    <header className="main-header">
      <div className="search-bar">
        <span> 🔍 </span>
        <input type="text" placeholder="Tìm kiếm bác sĩ trên Server..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
      </div>
      <div className="user-profile">
        <img src="https://api.dicebear.com/8.x/avataaars/svg?seed=AdminMaster&backgroundColor=0f6eff" alt="Avatar" className="avatar" />
        <div className="user-info">
          <span className="user-name">Quản trị viên</span>
          <span className="user-role">Super Admin</span>
        </div>
      </div>
    </header>
  );
};
export default Header;