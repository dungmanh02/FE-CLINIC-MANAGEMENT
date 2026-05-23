import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCurrentUserAPI } from '../../services/authService';
import { searchDoctorsAPI } from '../../services/adminService';
import { createAppointmentAPI, getAllAppointmentsAPI, getAppointmentDetailsAPI, cancelAppointmentAPI, deleteAppointmentAPI } from '../../services/appointmentService'; 
import '../../style/base.css';
import '../../style/patient.css';

const PatientDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // STATE TÌM KIẾM BÁC SĨ
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [apiError, setApiError] = useState(false);
  const dropdownRef = useRef(null);

  // STATE LỊCH HẸN
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [appointments, setAppointments] = useState([]);
  const [isLoadingAppointments, setIsLoadingAppointments] = useState(false);

  // STATE PHỤC VỤ XEM CHI TIẾT LỊCH HẸN CỦA BỆNH NHÂN
  const [apptDetails, setApptDetails] = useState(null);
  const [isApptDetailModalOpen, setIsApptDetailModalOpen] = useState(false);

  // 1. Lấy thông tin Bệnh nhân đang đăng nhập
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await getCurrentUserAPI();
        setUser(response.data?.data || response.data);
      } catch (error) {
        console.error("Lỗi lấy thông tin người dùng:", error);
      }
    };
    fetchUserData();
  }, []);

  // 2. Lấy danh sách lịch hẹn từ API
  const fetchAppointments = async () => {
    setIsLoadingAppointments(true);
    try {
      const response = await getAllAppointmentsAPI(0, 10);
      const data = response.data?.data?.content || response.data?.data || [];
      setAppointments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Lỗi tải lịch hẹn:", error);
    } finally {
      setIsLoadingAppointments(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // 3. Xử lý tìm kiếm bác sĩ kèm Debounce
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchTerm.trim() !== '') {
        setIsSearching(true);
        setShowDropdown(true);
        setApiError(false);
        try {
          const response = await searchDoctorsAPI(searchTerm);
          const actualDoctorArray = response.data?.data?.doctors || response.data?.data?.doctorList || response.data?.data?.content || response.data?.data || [];
          setSearchResults(Array.isArray(actualDoctorArray) ? actualDoctorArray : []);
        } catch (error) {
          console.error("Lỗi tìm kiếm bác sĩ:", error);
          setSearchResults([]);
          setApiError(true);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
        setShowDropdown(false);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Xử lý click ra ngoài để ẩn dropdown tìm kiếm bác sĩ
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem('token');
    alert('Đăng xuất khỏi MediPro. Hẹn gặp lại bạn!');
    navigate('/login');
  };

  const handleFeatureNotReady = (featureName) => {
    alert(` 🚀  Chức năng "${featureName}" đang được phát triển!`);
  };

  // Gọi API lấy dữ liệu chi tiết lịch hẹn
  const handleViewAppointmentDetails = async (id) => {
    try {
      const response = await getAppointmentDetailsAPI(id);
      setApptDetails(response.data?.data || response.data);
      setIsApptDetailModalOpen(true);
    } catch (error) {
      alert("Không tìm thấy thông tin chi tiết lịch khám!");
    }
  };

  // Gọi API tạo mới lịch hẹn (Form đặt lịch nhanh)
  const handleCreateAppointment = async () => {
    try {
      const payload = {
        patientId: user?.id || user?.userId || 0,
        doctorId: parseInt(formData.doctorId),
        appointmentDate: formData.appointmentDate,
        startTime: formData.startTime.length === 5 ? formData.startTime + ":00" : formData.startTime,
        symptoms: formData.symptoms || "Kiểm tra sức khỏe"
      };
      await createAppointmentAPI(payload);
      alert(" 🎉  Đặt lịch hẹn thành công!");
      setIsModalOpen(false);
      setFormData({});
      fetchAppointments();
    } catch (error) {
      alert("Đặt lịch thất bại. Vui lòng kiểm tra lại ID Bác sĩ!");
    }
  };

  // Gọi API hủy lịch hẹn dành cho Bệnh nhân
  const handleCancelAppointment = async (id) => {
    const reason = window.prompt("Nhập lý do bạn muốn hủy lịch hẹn:");
    if (reason === null) return;

    try {
      await cancelAppointmentAPI(id, { reason: reason || "Người bệnh có việc bận cá nhân" });
      alert("🛑 Bạn đã hủy lịch hẹn thành công!");
      fetchAppointments();
    } catch (error) {
      alert("Hủy lịch hẹn thất bại. Vui lòng thử lại!");
    }
  };

  // 🚀 HÀM BỆNH NHÂN BẤM XÓA HOÀN TOÀN LỊCH HẸN KHỎI DB
  const handlePatientDeleteAppointment = async (id) => {
    if (window.confirm("🗑️ Bạn muốn xóa vĩnh viễn thẻ lịch hẹn này khỏi danh sách hiển thị không?")) {
      try {
        await deleteAppointmentAPI(id);
        alert("🗑️ Xóa lịch hẹn thành công!");
        fetchAppointments(); // Reload danh sách
      } catch (error) {
        alert("Xóa lịch hẹn thất bại. Vui lòng thử lại!");
      }
    }
  };

  return (
    <div className="dashboard-container">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="logo">
          <span className="logo-icon">  ✚  </span>
          <span className="logo-text">Medi<span className="text-primary">Pro</span></span>
        </div>
        <nav className="nav-menu">
          <Link to="/patient/dashboard" className="nav-item active">
            <span className="icon">  📊  </span> Tổng quan
          </Link>
          <Link to="/patient/appointments" className="nav-item">
            <span className="icon">  📅  </span> Đặt lịch khám
          </Link>
          <Link to="/patient/profile" className="nav-item">
            <span className="icon">  👤  </span> Thông tin cá nhân
          </Link>
          <Link to="#" className="nav-item" onClick={() => handleFeatureNotReady('Đơn thuốc')}>
            <span className="icon">  💊  </span> Đơn thuốc
          </Link>
        </nav>
        <div className="sidebar-footer">
          <Link to="/" className="nav-item logout" onClick={handleLogout}>
            <span className="icon">  🚪  </span> Đăng xuất
          </Link>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main-content">
        <header className="main-header">
          <div className="search-container" style={{ position: 'relative', flex: 1, maxWidth: '400px' }} ref={dropdownRef}>
            <div className="search-bar" style={{ width: '100%', margin: 0 }}>
              <span>  🔍  </span>
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
                  <div style={{ padding: '12px', textAlign: 'center', color: '#64748b' }}> ⏳  Đang tìm kiếm...</div>
                ) : apiError ? (
                  <div style={{ padding: '12px', textAlign: 'center', color: '#ef4444' }}> ⛔  Lỗi quyền truy cập! (Bệnh nhân chưa được cấp quyền gọi API Search)</div>
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
            <span className="notification-icon">  🔔  <span className="badge">2</span></span>
            <img src={user?.avatarUrl || "https://api.dicebear.com/8.x/avataaars/svg?seed=PatientHappy&backgroundColor=0f6eff"} alt="Avatar" className="avatar" />
            <div className="user-info">
              <span className="user-name">{user ? user.fullName : 'Đang tải...'}</span>
              <span className="user-role">Mã BN: P-{user?.id || user?.userId || '1024'}</span>
            </div>
            <span className="dropdown-icon">▼</span>
          </div>
        </header>

        <div className="page-content">
          <h1 className="page-title">Chào mừng {user?.fullName || 'bạn'}, đã sẵn sàng chăm sóc sức khỏe hôm nay?  💙  </h1>
          <p className="page-subtitle">Quản lý lịch hẹn, theo dõi tư vấn và hồ sơ y tế tập trung.</p>
          
          <div className="patient-dashboard-grid">
            <div className="appointments-section">
              <div className="section-header">
                <h2>Lịch hẹn của bạn</h2>
                <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <button className="btn-primary" onClick={() => setIsModalOpen(true)}>+ Đặt lịch nhanh</button>
                  <Link to="/patient/appointments" className="view-link">Xem tất cả →</Link>
                </div>
              </div>

              <div className="appointment-list">
                {isLoadingAppointments ? (
                  <p style={{ padding: '20px', textAlign: 'center', color: '#64748b' }}>Đang tải dữ liệu lịch hẹn...</p>
                ) : appointments.length > 0 ? (
                  appointments.map((appt, index) => (
                    <div className="appointment-card" key={appt.id || index}>
                      <div className="doctor-info">
                        <img src={`https://api.dicebear.com/8.x/adventurer/svg?seed=${appt.doctorId || 'DrHa'}&backgroundColor=0f6eff`} className="doctor-avatar" alt="Doctor" />
                        <div className="doctor-details">
                          <h4>BS. {appt.doctorName || `Mã BS: ${appt.doctorId}`}</h4>
                          <span className="doctor-specialty">{appt.departmentName || 'Chuyên khoa'}</span>
                        </div>
                      </div>
                      <div className="appointment-meta">
                        <span className="appointment-time">  ⏰  {appt.appointmentDate} | {appt.startTime}</span>
                        <span className={`status-badge ${appt.status === 'PENDING' ? 'pending' : (appt.status === 'CANCELLED' ? 'cancelled' : 'confirmed')}`}>{appt.status || 'Đang diễn ra'}</span>
                      </div>
                      
                      {/* CỤM NÚT THAO TÁC CỦA BỆNH NHÂN ĐẦY ĐỦ */}
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button className="btn-primary" onClick={() => handleViewAppointmentDetails(appt.id)} style={{ padding: '6px 12px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '14px' }}>Chi tiết</button>
                        
                        {appt.status !== 'CANCELLED' && (
                          <button className="btn-cancel" onClick={() => handleCancelAppointment(appt.id)}>Hủy lịch</button>
                        )}

                        {/* 🚀 NÚT XÓA DÀNH CHO BỆNH NHÂN */}
                        <button className="btn-cancel" onClick={() => handlePatientDeleteAppointment(appt.id)} style={{ backgroundColor: '#dc2626', borderColor: '#dc2626' }}>Xóa</button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{ padding: '20px', textAlign: 'center', color: '#64748b' }}>
                    <p>Bạn chưa có lịch hẹn nào. Hãy ấn <strong>+ Đặt lịch nhanh</strong> để bắt đầu!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* MODAL ĐẶT LỊCH KHÁM NHANH */}
      {isModalOpen && (
        <div style={{ display: 'flex', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', width: '400px', display: 'flex', flexDirection: 'column', gap: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
            <h3 style={{ margin: 0, color: '#0f172a' }}> ➕  Đặt lịch khám mới</h3>
            <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>Gợi ý: Dùng thanh tìm kiếm ở trên để copy ID Bác sĩ bạn nhé!</p>
            <input type="number" placeholder="Nhập ID Bác sĩ *" value={formData.doctorId || ''} onChange={e => setFormData({...formData, doctorId: e.target.value})} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} required />
            <input type="date" value={formData.appointmentDate || ''} onChange={e => setFormData({...formData, appointmentDate: e.target.value})} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} required />
            <input type="time" value={formData.startTime || ''} onChange={e => setFormData({...formData, startTime: e.target.value})} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} required />
            <input type="text" placeholder="Triệu chứng/Lý do" value={formData.symptoms || ''} onChange={e => setFormData({...formData, symptoms: e.target.value})} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
              <button onClick={() => setIsModalOpen(false)} style={{ padding: '8px 16px', backgroundColor: '#e2e8f0', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Hủy</button>
              <button onClick={handleCreateAppointment} style={{ padding: '8px 16px', backgroundColor: '#0f6eff', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Xác nhận Đặt lịch</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL XEM CHI TIẾT LỊCH KHÁM */}
      {isApptDetailModalOpen && apptDetails && (
        <div style={{ display: 'flex', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', zIndex: 11000 }}>
          <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', width: '400px', display: 'flex', flexDirection: 'column', gap: '15px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
            <h3 style={{ margin: 0, color: '#0f172a', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' }}> 📄  Chi tiết lịch khám #{apptDetails.id}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '15px', color: '#334155', textAlign: 'left' }}>
              <p style={{ margin: 0 }}><strong> 👨‍⚕️  Bác sĩ điều trị:</strong> {apptDetails.doctorName || 'Chưa cập nhật'}</p>
              <p style={{ margin: 0 }}><strong> 👤  Bệnh nhân:</strong> {apptDetails.patientName || 'Chưa cập nhật'}</p>
              <p style={{ margin: 0 }}><strong> 📅  Ngày khám bệnh:</strong> {apptDetails.appointmentDate}</p>
              <p style={{ margin: 0 }}><strong> ⏰  Giờ đăng ký:</strong> {apptDetails.startTime}</p>
              <p style={{ margin: 0 }}><strong> 📌  Trạng thái lịch:</strong> <span className={`status-badge ${apptDetails.status === 'PENDING' ? 'pending' : (apptDetails.status === 'CANCELLED' ? 'cancelled' : 'confirmed')}`}>{apptDetails.status}</span></p>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
              <button onClick={() => setIsApptDetailModalOpen(false)} style={{ padding: '8px 16px', backgroundColor: '#e2e8f0', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Đóng lại</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientDashboard;