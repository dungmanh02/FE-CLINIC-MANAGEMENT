import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
// Lùi lại 2 thư mục (../../) để vào thư mục style
import '../../style/base.css';
import '../../style/components.css';
import '../../style/doctor.css';

const DoctorDashboard = () => {
  const navigate = useNavigate();

  // Hàm xử lý đăng xuất
  const handleLogout = (e) => {
    e.preventDefault();
    // Xóa dữ liệu phiên đăng nhập nếu có (sau này làm API sẽ cần)
    // Chuyển hướng về trang login
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="logo">
          <span className="logo-icon">✚</span>
          <span className="logo-text">Medi<span className="text-primary">Pro</span></span>
        </div>
        <nav className="nav-menu">
          <Link to="/doctor/dashboard" className="nav-item active">
            <span className="icon">📊</span> Tổng quan
          </Link>
          <Link to="/doctor/appointments" className="nav-item">
            <span className="icon">📅</span> Lịch hẹn
          </Link>
          <Link to="#" className="nav-item">
            <span className="icon">👤</span> Bệnh nhân
          </Link>
          <Link to="#" className="nav-item">
            <span className="icon">💊</span> Đơn thuốc
          </Link>
          <Link to="#" className="nav-item">
            <span className="icon">📈</span> Thống kê
          </Link>
        </nav>
        <div className="sidebar-footer">
          <a href="/" className="nav-item logout" onClick={handleLogout}>
            <span className="icon">🚪</span> Đăng xuất
          </a>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main-content">
        {/* HEADER */}
        <header className="main-header">
          <div className="search-bar">
            <span className="search-icon">🔍</span>
            <input type="text" placeholder="Tìm kiếm bệnh nhân (ID, Tên)..." />
          </div>
          <div className="user-profile">
            <span className="notification-icon">
              🔔 <span className="badge">3</span>
            </span>
            <img 
              src="https://api.dicebear.com/8.x/adventurer/svg?seed=NVA" 
              alt="Avatar Bác sĩ" 
              className="avatar" 
            />
            <div className="user-info">
              <span className="user-name">BS. Nguyễn Văn A</span>
              <span className="user-role">Khoa Nội tổng hợp</span>
            </div>
            <span className="dropdown-icon">▼</span>
          </div>
        </header>

        {/* DASHBOARD CONTENT */}
        <div className="page-content">
          <h1 className="page-title">Chào buổi sáng, Bác sĩ A!</h1>
          <p className="page-subtitle">Dưới đây là tổng quan lịch làm việc hôm nay của bạn.</p>
          
          <div className="bento-grid">
            {/* Thống kê 1 */}
            <div className="card stat-card blue">
              <div className="card-icon">👥</div>
              <div className="stat-info">
                <span className="stat-label">Tổng bệnh nhân</span>
                <span className="stat-value">1,250</span>
              </div>
              <span className="stat-change positive">+2% tháng này</span>
            </div>

            {/* Thống kê 2 */}
            <div className="card stat-card teal">
              <div className="card-icon">📅</div>
              <div className="stat-info">
                <span className="stat-label">Lịch hẹn hôm nay</span>
                <span className="stat-value">18</span>
              </div>
              <span className="stat-change">4 ca đã xong</span>
            </div>

            {/* Danh sách lịch hẹn */}
            <div className="card appointment-card">
              <div className="card-header">
                <h2 className="card-title">Lịch hẹn sắp tới</h2>
                <Link to="#" className="view-all">Xem tất cả →</Link>
              </div>
              <div className="appointment-list">
                <div className="appointment-item status-processing">
                  <img src="https://api.dicebear.com/8.x/adventurer/svg?seed=LTV" alt="Patient" className="patient-avatar" />
                  <div className="appointment-details">
                    <span className="patient-name">Lê Thị Vệ</span>
                    <span className="appointment-time">09:00 - 09:30 | ID: 1002</span>
                  </div>
                  <span className="status-badge processing">Đang khám</span>
                  <button className="btn-action">Khám</button>
                </div>
                
                <div className="appointment-item status-pending">
                  <img src="https://api.dicebear.com/8.x/adventurer/svg?seed=NVM" alt="Patient" className="patient-avatar" />
                  <div className="appointment-details">
                    <span className="patient-name">Nguyễn Văn Mạnh</span>
                    <span className="appointment-time">09:30 - 10:00 | ID: 1005</span>
                  </div>
                  <span className="status-badge pending">Chờ khám</span>
                  <button className="btn-action secondary">Gọi</button>
                </div>
                
                <div className="appointment-item status-pending">
                  <img src="https://api.dicebear.com/8.x/adventurer/svg?seed=TPT" alt="Patient" className="patient-avatar" />
                  <div className="appointment-details">
                    <span className="patient-name">Trần Phương Thảo</span>
                    <span className="appointment-time">10:00 - 10:30 | ID: 1008</span>
                  </div>
                  <span className="status-badge pending">Chờ khám</span>
                  <button className="btn-action secondary">Gọi</button>
                </div>
              </div>
            </div>

            {/* Biểu đồ xu hướng */}
            <div className="card trend-card">
              <h2 className="card-title">Xu hướng bệnh (Tháng 4)</h2>
              <div className="chart-placeholder">
                <div className="chart-bar-group">
                  <div className="chart-bar" style={{ height: '80%' }}><span>Viêm họng</span></div>
                  <div className="chart-bar" style={{ height: '60%' }}><span>Sốt siêu vi</span></div>
                  <div className="chart-bar" style={{ height: '40%' }}><span>Dị ứng</span></div>
                  <div className="chart-bar" style={{ height: '25%' }}><span>Khác</span></div>
                </div>
              </div>
            </div>
          </div> 
        </div>
      </main>
    </div>
  );
};

export default DoctorDashboard;