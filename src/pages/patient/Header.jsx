import React from 'react';
import { useNavigate } from 'react-router-dom';

const Header = ({ 
  dropdownRef, searchTerm, setSearchTerm, showDropdown, setShowDropdown, 
  isSearching, apiError, searchResults, user 
}) => {
  const navigate = useNavigate();

  return (
    <header className="main-header">
      <div className="search-container" style={{ position: 'relative', flex: 1, maxWidth: '400px' }} ref={dropdownRef}>
        <div className="search-bar" style={{ width: '100%', margin: 0 }}>
          <span> 🔍 </span>
          <input
            type="text"
            placeholder="Tìm kiếm bác sĩ, chuyên khoa..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => { if (searchTerm) setShowDropdown(true); }}
          />
        </div>
        {showDropdown && (
          <div className="search-dropdown" style={{
            position: 'absolute', top: '110%', left: 0, width: '100%',
            backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px',
            zIndex: 9999, maxHeight: '300px', overflowY: 'auto',
            boxShadow: '0 10px 25px -5px rgba(0,0,0,0.2)'
          }}>
            {isSearching ? (
              <div style={{ padding: '12px', textAlign: 'center', color: '#64748b' }}> ⏳ Đang tìm kiếm...</div>
            ) : apiError ? (
              <div style={{ padding: '12px', textAlign: 'center', color: '#ef4444' }}> ⛔ Lỗi quyền truy cập! (Bệnh nhân chưa được cấp quyền gọi API Search)</div>
            ) : searchResults.length > 0 ? (
              searchResults.map(doc => (
                <div
                  key={doc.id || doc.userId}
                  style={{ padding: '12px 16px', borderBottom: '1px solid #f1f5f9', cursor: 'pointer', display: 'flex', flexDirection: 'column' }}
                  onClick={() => navigate(`/patient/appointments`)}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <strong style={{ color: '#0f172a' }}>{doc.fullName}</strong>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>Khoa: {doc.specialization || 'Chưa cập nhật'} | ID Bác sĩ: <strong style={{color:'#ef4444'}}>{doc.id || doc.userId}</strong></span>
                </div>
              ))
            ) : (
              <div style={{ padding: '12px', textAlign: 'center', color: '#ef4444' }}>Không tìm thấy bác sĩ nào!</div>
            )}
          </div>
        )}
      </div>
      <div className="user-profile" onClick={() => navigate('/patient/profile')} style={{ cursor: 'pointer' }}>
        <span className="notification-icon"> 🔔 <span className="badge">2</span></span>
        <img src={user?.avatarUrl || "https://api.dicebear.com/8.x/avataaars/svg?seed=PatientHappy&backgroundColor=0f6eff"} alt="Avatar" className="avatar" />
        <div className="user-info">
          <span className="user-name">{user ? user.fullName : 'Đang tải...'}</span>
          <span className="user-role">Mã BN: P-{user?.id || user?.userId || '1024'}</span>
        </div>
        <span className="dropdown-icon">▼</span>
      </div>
    </header>
  );
};

export default Header;