import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
// Lùi lại 2 thư mục để gọi CSS
import '../../style/base.css';
import '../../style/components.css';
import '../../style/doctor.css';

const DoctorAppointments = () => {
  const navigate = useNavigate();

  // Hàm xử lý đăng xuất
  const handleLogout = (e) => {
    e.preventDefault();
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
          {/* Cập nhật Link để trỏ đúng về trang Dashboard */}
          <Link to="/doctor/dashboard" className="nav-item">
            <span className="icon">📊</span> Tổng quan
          </Link>
          <Link to="/doctor/appointments" className="nav-item active">
            <span className="icon">📅</span> Lịch hẹn
          </Link>
          <Link to="#" className="nav-item">
            <span className="icon">👤</span> Bệnh nhân
          </Link>
          <Link to="#" className="nav-item">
            <span className="icon">📈</span> Thống kê
          </Link>
        </nav>
        <div className="sidebar-footer">
          <Link to="/" className="nav-item logout" onClick={handleLogout}>
            🚪 Đăng xuất
          </Link>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main-content">
        <header className="main-header">
          <div className="search-bar">
            <span className="search-icon">🔍</span>
            <input type="text" placeholder="Tìm tên bệnh nhân..." />
          </div>
          <div className="user-profile">
            <img src="https://api.dicebear.com/8.x/adventurer/svg?seed=NVA" className="avatar" alt="Avatar Bác sĩ" />
            <span className="user-name">BS. Nguyễn Văn A</span>
          </div>
        </header>

        <div className="page-content">
          <div className="card-header" style={{ marginBottom: '20px' }}>
            <h1 className="page-title">Danh sách lịch hẹn</h1>
            <input type="date" className="custom-input" style={{ width: '200px' }} />
          </div>
          
          <div className="card">
            <table className="modern-table">
              <thead>
                <tr>
                  <th>Bệnh nhân</th>
                  <th>Thời gian</th>
                  <th>Triệu chứng</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><b>Nguyễn Văn Mạnh</b><br /><small>ID: 1005</small></td>
                  <td>09:30 - Hôm nay</td>
                  <td>Đau bụng dưới...</td>
                  <td><span className="status-badge pending">Chờ khám</span></td>
                  <td>
                    {/* Nút điều hướng sang trang khám bệnh */}
                    <button className="btn-action" onClick={() => navigate('/doctor/exam')}>Khám</button>
                  </td>
                </tr>
                <tr>
                  <td><b>Lê Thị Vệ</b><br /><small>ID: 1002</small></td>
                  <td>10:00 - Hôm nay</td>
                  <td>Ho khan, sốt</td>
                  <td><span className="status-badge processing">Đang khám</span></td>
                  <td>
                    <button className="btn-action" onClick={() => navigate('/doctor/exam')}>Tiếp tục</button>
                  </td>
                </tr>
              </tbody>
            </table>
            
            <div className="pagination">
              <button className="page-btn">«</button>
              <button className="page-btn active">1</button>
              <button className="page-btn">2</button>
              <button className="page-btn">»</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DoctorAppointments;