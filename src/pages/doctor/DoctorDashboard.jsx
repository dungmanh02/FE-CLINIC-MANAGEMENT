import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCurrentUserAPI } from '../../services/authService';
import { createAppointmentAPI, getAllAppointmentsAPI, getAppointmentDetailsAPI, confirmAppointmentAPI, cancelAppointmentAPI, deleteAppointmentAPI } from '../../services/appointmentService'; 
import '../../style/base.css';
import '../../style/components.css';
import '../../style/doctor.css';

const DoctorDashboard = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({});

  // STATE DANH SÁCH LỊCH HẸN
  const [appointments, setAppointments] = useState([]);
  const [isLoadingAppointments, setIsLoadingAppointments] = useState(false);

  // STATE XEM CHI TIẾT LỊCH HẸN CỦA BÁC SĨ
  const [apptDetails, setApptDetails] = useState(null);
  const [isApptDetailModalOpen, setIsApptDetailModalOpen] = useState(false);

  // 1. Lấy thông tin Bác sĩ
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await getCurrentUserAPI();
        setUser(response.data?.data || response.data);
      } catch (error) { console.error("Lỗi lấy thông tin:", error); }
    };
    fetchUserData();
  }, []);

  // 2. LẤY DANH SÁCH LỊCH HẸN TỪ API
  const fetchAppointments = async () => {
    setIsLoadingAppointments(true);
    try {
      const response = await getAllAppointmentsAPI(0, 10);
      const data = response.data?.data?.content || response.data?.data || [];
      setAppointments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Lỗi tải lịch hẹn:", error);
    } finally {
      setIsLoadingAppointments(false); // ✅ Sửa chính tả chuẩn finally không lỗi đỏ nữa
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleViewAppointmentDetails = async (id) => {
    try {
      const response = await getAppointmentDetailsAPI(id);
      setApptDetails(response.data?.data || response.data);
      setIsApptDetailModalOpen(true);
    } catch (error) {
      alert("Không tìm thấy thông tin chi tiết của cuộc hẹn này!");
    }
  };

  const handleCreateAppointment = async () => {
    try {
      const payload = {
        patientId: parseInt(formData.patientId),
        doctorId: user?.id || user?.userId || 0,
        appointmentDate: formData.appointmentDate,
        startTime: formData.startTime.length === 5 ? formData.startTime + ":00" : formData.startTime,
        symptoms: formData.symptoms || "Tái khám"
      };
      await createAppointmentAPI(payload);
      alert("🎉 Tạo lịch hẹn thành công!");
      setIsModalOpen(false);
      setFormData({});
      fetchAppointments();
    } catch (error) {
      alert("Tạo lịch thất bại. Vui lòng thử lại!");
    }
  };

  const handleConfirmAppointment = async (id) => {
    if (window.confirm("Bạn muốn xác nhận lịch hẹn này?")) {
      try {
        await confirmAppointmentAPI(id);
        alert("✅ Đã xác nhận lịch hẹn!");
        fetchAppointments();
      } catch (error) {
        alert("Lỗi khi xác nhận lịch hẹn!");
      }
    }
  };

  const handleCancelAppointment = async (id) => {
    const reason = window.prompt("Vui lòng nhập lý do hủy lịch:");
    if (reason === null) return;
    try {
      await cancelAppointmentAPI(id, { reason: reason || "Bác sĩ bận đột xuất" });
      alert("🛑 Đã hủy lịch hẹn!");
      fetchAppointments();
    } catch (error) {
      alert("Lỗi khi hủy lịch hẹn!");
    }
  };

  // 🚀 HÀM BÁC SĨ XÓA LỊCH HẸN KHỎI GIAO DIỆN / DB
  const handleDeleteAppointment = async (id) => {
    if (window.confirm(`🗑️ Bác sĩ muốn xóa hẳn cuộc hẹn mã số #${id} này không?`)) {
      try {
        await deleteAppointmentAPI(id);
        alert("🗑️ Đã xóa lịch hẹn thành công!");
        fetchAppointments(); // Load lại bảng
      } catch (error) {
        alert("Xóa lịch hẹn thất bại. Vui lòng thử lại!");
      }
    }
  };

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <div className="logo">
          <span className="logo-icon">  ✚  </span>
          <span className="logo-text">Medi<span className="text-primary">Pro</span></span>
        </div>
        <nav className="nav-menu">
          <Link to="/doctor/dashboard" className="nav-item active"><span className="icon">  📊  </span> Tổng quan</Link>
          <Link to="/doctor/appointments" className="nav-item"><span className="icon">  📅  </span> Lịch hẹn</Link>
          <Link to="#" className="nav-item"><span className="icon">  👤  </span> Bệnh nhân</Link>
          <Link to="#" className="nav-item"><span className="icon">  💊  </span> Đơn thuốc</Link>
          <Link to="#" className="nav-item"><span className="icon">  📈  </span> Thống kê</Link>
        </nav>
        <div className="sidebar-footer">
          <a href="/" className="nav-item logout" onClick={handleLogout}><span className="icon">  🚪  </span> Đăng xuất</a>
        </div>
      </aside>

      <main className="main-content">
        <header className="main-header">
          <div className="search-bar"><span className="search-icon">  🔍  </span><input type="text" placeholder="Tìm kiếm bệnh nhân (ID, Tên)..." /></div>
          <div className="user-profile">
            <span className="notification-icon">🔔  <span className="badge">3</span></span>
            <img src="https://api.dicebear.com/8.x/adventurer/svg?seed=NVA" alt="Avatar Bác sĩ" className="avatar" />
            <div className="user-info">
              <span className="user-name">BS. {user ? user.fullName : 'Đang tải...'}</span>
              <span className="user-role">ID: {user?.id || user?.userId || 'N/A'}</span>
            </div>
            <span className="dropdown-icon">▼</span>
          </div>
        </header>

        <div className="page-content">
          <h1 className="page-title">Chào buổi sáng, BS. {user?.fullName?.split(' ').pop() || ''}!</h1>
          <p className="page-subtitle">Dưới đây là tổng quan lịch làm việc hôm nay của bạn.</p>
          <div className="bento-grid">
            <div className="card stat-card blue">
              <div className="card-icon">  健全  </div>
              <div className="stat-info"><span className="stat-label">Tổng bệnh nhân</span><span className="stat-value">1,250</span></div>
              <span className="stat-change positive">+2% tháng này</span>
            </div>
            <div className="card stat-card teal">
              <div className="card-icon">  📅  </div>
              <div className="stat-info"><span className="stat-label">Lịch hẹn hôm nay</span><span className="stat-value">{appointments.length || 18}</span></div>
              <span className="stat-change">4 ca đã xong</span>
            </div>

            {/* DANH SÁCH LỊCH HẸN */}
            <div className="card appointment-card">
              <div className="card-header">
                <h2 className="card-title">Lịch hẹn sắp tới</h2>
                <button className="btn-primary" onClick={() => setIsModalOpen(true)} style={{ marginLeft: '15px', padding: '5px 10px', fontSize: '14px' }}>+ Thêm lịch hẹn</button>
                <Link to="/doctor/appointments" className="view-all">Xem tất cả →</Link>
              </div>
              <div className="appointment-list">
                {isLoadingAppointments ? (
                  <p style={{padding: '20px', textAlign: 'center', color: '#64748b'}}>Đang tải dữ liệu lịch hẹn...</p>
                ) : appointments.length > 0 ? (
                  appointments.map((appt, index) => (
                    <div className="appointment-item status-pending" key={appt.id || index}>
                      <img src={`https://api.dicebear.com/8.x/adventurer/svg?seed=${appt.patientId || index}`} alt="Patient" className="patient-avatar" />
                      <div className="appointment-details">
                        <span className="patient-name">{appt.patientName || `BN mã số: ${appt.patientId}`}</span>
                        <span className="appointment-time">{appt.appointmentDate} | {appt.startTime}</span>
                      </div>
                      <span className={`status-badge ${appt.status === 'PENDING' ? 'pending' : (appt.status === 'CANCELLED' ? 'cancelled' : 'confirmed')}`}>
                        {appt.status || 'Chờ khám'}
                      </span>
                      
                      {/* BỘ NÚT THAO TÁC ĐẦY ĐỦ CỦA BÁC SĨ */}
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', justifyContent: 'flex-end', marginLeft: 'auto' }}>
                        <button className="btn-action secondary" onClick={() => handleViewAppointmentDetails(appt.id)} style={{ background: '#3b82f6', color: 'white', border: 'none' }}>Chi tiết</button>
                        
                        {appt.status === 'PENDING' && (
                          <button className="btn-action" onClick={() => handleConfirmAppointment(appt.id)} style={{ background: '#10b981', color: 'white', border: 'none' }}>Xác nhận</button>
                        )}
                        
                        {appt.status !== 'CANCELLED' && (
                           <button className="btn-action" onClick={() => handleCancelAppointment(appt.id)} style={{ background: '#f59e0b', color: 'white', border: 'none' }}>Hủy</button>
                        )}

                        {/* 🚀 NÚT XÓA MỚI THÊM CHO BÁC SĨ */}
                        <button className="btn-action" onClick={() => handleDeleteAppointment(appt.id)} style={{ background: '#ef4444', color: 'white', border: 'none' }}>Xóa</button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{padding: '20px', textAlign: 'center', color: '#64748b'}}>Hôm nay bác sĩ chưa có lịch hẹn nào.</div>
                )}
              </div>
            </div>

            {/* BIỂU ĐỒ XU HƯỚNG BỆNH GIỮ NGUYÊN */}
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

      {/* MODAL TẠO LỊCH GIỮ NGUYÊN */}
      {isModalOpen && (
        <div style={{ display: 'flex', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', width: '400px', display: 'flex', flexDirection: 'column', gap: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
            <h3> ➕  Tạo lịch cho Bệnh nhân</h3>
            <input type="number" placeholder="Nhập ID Bệnh nhân *" value={formData.patientId || ''} onChange={e => setFormData({...formData, patientId: e.target.value})} style={{padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1'}} required />
            <input type="date" value={formData.appointmentDate || ''} onChange={e => setFormData({...formData, appointmentDate: e.target.value})} style={{padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1'}} required />
            <input type="time" value={formData.startTime || ''} onChange={e => setFormData({...formData, startTime: e.target.value})} style={{padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1'}} required />
            <input type="text" placeholder="Triệu chứng/Lý do" value={formData.symptoms || ''} onChange={e => setFormData({...formData, symptoms: e.target.value})} style={{padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1'}} />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
              <button onClick={() => setIsModalOpen(false)}>Hủy</button>
              <button onClick={handleCreateAppointment} style={{ backgroundColor: '#0f6eff', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px' }}>Lưu</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL CHI TIẾT */}
      {isApptDetailModalOpen && apptDetails && (
        <div style={{ display: 'flex', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', zIndex: 11000 }}>
          <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', width: '400px', display: 'flex', flexDirection: 'column', gap: '15px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
            <h3 style={{ margin: 0, color: '#0f172a', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' }}>📄 Chi tiết cuộc hẹn #{apptDetails.id}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '15px', color: '#334155', textAlign: 'left' }}>
              <p style={{ margin: 0 }}><strong>👤 Bệnh nhân:</strong> {apptDetails.patientName || 'Chưa cập nhật'}</p>
              <p style={{ margin: 0 }}><strong>👨‍⚕️ Bác sĩ:</strong> {apptDetails.doctorName || 'Chưa cập nhật'}</p>
              <p style={{ margin: 0 }}><strong>📅 Ngày đặt lịch:</strong> {apptDetails.appointmentDate}</p>
              <p style={{ margin: 0 }}><strong>⏰ Khung giờ khám:</strong> {apptDetails.startTime}</p>
              <p style={{ margin: 0 }}><strong>📌 Trạng thái:</strong> {apptDetails.status}</p>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
              <button onClick={() => setIsApptDetailModalOpen(false)} style={{padding: '8px 20px', backgroundColor: '#e2e8f0', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold'}}>Đóng lại</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorDashboard;