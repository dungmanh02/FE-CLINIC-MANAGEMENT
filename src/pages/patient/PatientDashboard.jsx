import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCurrentUserAPI } from '../../services/authService';
import '../../style/base.css';
import '../../style/patient.css';

const PatientDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await getCurrentUserAPI();
        const userData = response.data.data || response.data;
        setUser(userData);
      } catch (error) {
        console.error("Lỗi lấy thông tin người dùng:", error);
      }
    };
    fetchUserData();
  }, []);

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem('token');
    alert('Đăng xuất khỏi MediPro. Hẹn gặp lại bạn!');
    navigate('/login');
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      alert(`🔎 Tìm kiếm: "${e.target.value.trim()}"\nTính năng đang cập nhật.`);
    }
  };

  const handleFeatureNotReady = (featureName) => {
    alert(`🚀 Chức năng "${featureName}" đang được phát triển!`);
  };

  return (
    <div className="dashboard-container">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="logo">
          <span className="logo-icon"> ✚ </span>
          <span className="logo-text">Medi<span className="text-primary">Pro</span></span>
        </div>
        <nav className="nav-menu">
          <Link to="/patient/dashboard" className="nav-item active">
            <span className="icon"> 📊 </span> Tổng quan
          </Link>
          
          {/* ĐÃ SỬA: Đổi tên thành Đặt lịch khám và nối link sang trang Appointments */}
          <Link to="/patient/appointments" className="nav-item">
            <span className="icon"> 📅 </span> Đặt lịch khám
          </Link>

          <Link to="/patient/profile" className="nav-item">
            <span className="icon"> 👤 </span> Thông tin cá nhân
          </Link>
          <Link to="#" className="nav-item" onClick={() => handleFeatureNotReady('Đơn thuốc')}>
            <span className="icon"> 💊 </span> Đơn thuốc
          </Link>
        </nav>
        <div className="sidebar-footer">
          <Link to="/" className="nav-item logout" onClick={handleLogout}>
            <span className="icon"> 🚪 </span> Đăng xuất
          </Link>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main-content">
        <header className="main-header">
          <div className="search-bar">
            <span> 🔍 </span>
            <input type="text" placeholder="Tìm kiếm bác sĩ, chuyên khoa..." onKeyDown={handleSearch} />
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

        <div className="page-content">
          <h1 className="page-title">Chào mừng {user?.fullName || 'bạn'}, đã sẵn sàng chăm sóc sức khỏe hôm nay? 💙 </h1>
          <p className="page-subtitle">Quản lý lịch hẹn, theo dõi tư vấn và hồ sơ y tế tập trung.</p>

          <div className="patient-dashboard-grid">
            <div className="appointments-section">
              <div className="section-header">
                <h2>Lịch hẹn của bạn</h2>
                {/* ĐÃ SỬA: Nút Xem tất cả nối link sang trang Appointments */}
                <Link to="/patient/appointments" className="view-link">Xem tất cả →</Link>
              </div>
              <div className="appointment-list">
                <div className="appointment-card">
                  <div className="doctor-info">
                    <img src="https://api.dicebear.com/8.x/adventurer/svg?seed=DrHa&backgroundColor=0f6eff" className="doctor-avatar" alt="Doctor" />
                    <div className="doctor-details">
                      <h4>BS. Trần Thu Hà</h4>
                      <span className="doctor-specialty">Chuyên khoa Nhi</span>
                    </div>
                  </div>
                  <div className="appointment-meta">
                    <span className="appointment-time"> ⏰ Hôm nay, 09:00 - 09:30</span>
                    <span className="status-badge status-confirmed">Đang diễn ra</span>
                  </div>
                  <button className="btn-cancel" onClick={() => alert('Hủy lịch hẹn?')}>Hủy lịch</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PatientDashboard;