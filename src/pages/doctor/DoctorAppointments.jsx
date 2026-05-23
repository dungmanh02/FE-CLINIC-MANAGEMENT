import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCurrentUserAPI } from '../../services/authService';
import { getAllAppointmentsAPI } from '../../services/appointmentService';
import '../../style/base.css';
import '../../style/components.css';
import '../../style/doctor.css';

const DoctorAppointments = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  
  // STATE DANH SÁCH LỊCH HẸN
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await getCurrentUserAPI();
        setUser(response.data?.data || response.data);
      } catch (error) { console.error("Lỗi:", error); }
    };
    fetchUserData();
  }, []);

  // GỌI API LẤY LỊCH HẸN CHO TRANG NÀY
  useEffect(() => {
    const fetchAppointments = async () => {
      setIsLoading(true);
      try {
        const response = await getAllAppointmentsAPI(0, 50); // Lấy 50 lịch
        const data = response.data?.data?.content || response.data?.data || [];
        setAppointments(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Lỗi tải lịch hẹn:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem('token');
    navigate('/login');
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
          <Link to="/doctor/dashboard" className="nav-item">
            <span className="icon"> 📊 </span> Tổng quan
          </Link>
          <Link to="/doctor/appointments" className="nav-item active">
            <span className="icon"> 📅 </span> Lịch hẹn
          </Link>
          <Link to="#" className="nav-item"><span className="icon"> 👤 </span> Bệnh nhân</Link>
          <Link to="#" className="nav-item"><span className="icon"> 📈 </span> Thống kê</Link>
        </nav>
        <div className="sidebar-footer">
          <a href="/" className="nav-item logout" onClick={handleLogout}><span className="icon"> 🚪 </span> Đăng xuất</a>
        </div>
      </aside>

      <main className="main-content">
        <header className="main-header">
          <div className="search-bar">
            <span className="search-icon"> 🔍 </span>
            <input type="text" placeholder="Tìm tên bệnh nhân..." />
          </div>
          <div className="user-profile">
            <img src="https://api.dicebear.com/8.x/adventurer/svg?seed=Doc" alt="Avatar" className="avatar" />
            <div className="user-info">
              <span className="user-name">BS. {user?.fullName || 'Đang tải...'}</span>
            </div>
          </div>
        </header>

        <div className="page-content">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h1 className="page-title">Danh sách lịch hẹn</h1>
            <input type="date" style={{ padding: '8px 16px', border: '1px solid #cbd5e1', borderRadius: '8px' }} />
          </div>

          <div className="admin-card">
            <table className="data-table" style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ color: '#64748b', fontSize: '13px', textTransform: 'uppercase', borderBottom: '1px solid #f1f5f9' }}>
                  <th style={{ padding: '16px' }}>Bệnh nhân</th>
                  <th style={{ padding: '16px' }}>Thời gian</th>
                  <th style={{ padding: '16px' }}>Triệu chứng</th>
                  <th style={{ padding: '16px' }}>Trạng thái</th>
                  <th style={{ padding: '16px' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr><td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>Đang tải dữ liệu...</td></tr>
                ) : appointments.length > 0 ? (
                  appointments.map((appt, idx) => (
                    <tr key={appt.id || idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '16px' }}>
                        <div style={{ fontWeight: 'bold', color: '#0f172a', marginBottom: '4px' }}>
                          {appt.patientName || `Bệnh nhân #${appt.patientId}`}
                        </div>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>ID: {appt.patientId}</div>
                      </td>
                      <td style={{ padding: '16px' }}>{appt.startTime} - {appt.appointmentDate}</td>
                      <td style={{ padding: '16px', color: '#475569' }}>{appt.symptoms || 'Không có mô tả'}</td>
                      <td style={{ padding: '16px' }}>
                        <span className={`status-badge ${appt.status === 'PENDING' ? 'pending' : 'processing'}`}>
                          {appt.status || 'Chờ khám'}
                        </span>
                      </td>
                      <td style={{ padding: '16px' }}>
                        <button className="btn-primary" style={{ padding: '8px 16px', borderRadius: '20px', fontSize: '14px' }}>Khám</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="5" style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>Bạn không có lịch hẹn nào.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DoctorAppointments;