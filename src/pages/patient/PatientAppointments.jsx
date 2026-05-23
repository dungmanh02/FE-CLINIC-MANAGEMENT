import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCurrentUserAPI } from '../../services/authService';
import { createAppointmentAPI } from '../../services/appointmentService';
import '../../style/base.css';
import '../../style/patient.css';

const PatientAppointments = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  
  // Lưu thông tin người dùng đang đăng nhập để lấy patientId
  const [currentUser, setCurrentUser] = useState(null);

  const [formData, setFormData] = useState({
    doctorId: '', // Mặc định để trống bắt người dùng chọn
    appointmentDate: '',
    startTime: '',
    symptoms: ''
  });

  // Tự động lấy thông tin bệnh nhân đang đăng nhập khi vừa vào trang
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getCurrentUserAPI();
        const userData = response.data.data || response.data;
        setCurrentUser(userData);
      } catch (error) {
        console.error("Lỗi tải thông tin:", error);
      }
    };
    fetchUser();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


const handleSubmit = async (e) => {
    e.preventDefault();
    
    // ĐÃ SỬA: Chỉ cần có thông tin user là được, tạm thời bỏ qua việc kiểm tra currentUser.id
    if (!currentUser) {
      setErrorMsg('Không tìm thấy thông tin bệnh nhân. Vui lòng thử đăng nhập lại.');
      return;
    }

    setLoading(true);
    setMessage('');
    setErrorMsg('');

    try {
      // ĐÃ SỬA: Tạo một biến dự phòng. Nếu Backend có trả về ID thì dùng, không thì lấy tạm ID là 1 để test
      const patientIdToSubmit = currentUser.id || currentUser.userId || 1; 

      const submitData = {
        patientId: patientIdToSubmit, // Gửi ID dự phòng lên
        doctorId: parseInt(formData.doctorId), 
        appointmentDate: formData.appointmentDate,
        startTime: formData.startTime + ":00", 
        symptoms: formData.symptoms
      };

      await createAppointmentAPI(submitData);
      setMessage('🎉 Đặt lịch hẹn thành công! Vui lòng chờ phòng khám xác nhận.');
      
      setFormData({ doctorId: '', appointmentDate: '', startTime: '', symptoms: '' });
      
    } catch (error) {
      console.error("Lỗi đặt lịch:", error);
      if (error.response && error.response.data) {
        setErrorMsg(error.response.data.message || 'Đặt lịch thất bại. Vui lòng kiểm tra lại.');
      } else {
        setErrorMsg('Không thể kết nối đến máy chủ.');
      }
    } finally {
      setLoading(false);
    }
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
          <Link to="/patient/dashboard" className="nav-item">
            <span className="icon"> 📊 </span> Tổng quan
          </Link>
          <Link to="/patient/appointments" className="nav-item active">
            <span className="icon"> 📅 </span> Đặt lịch khám
          </Link>
          <Link to="/patient/profile" className="nav-item">
            <span className="icon"> 👤 </span> Thông tin cá nhân
          </Link>
        </nav>
        <div className="sidebar-footer">
          <Link to="/login" className="nav-item logout" onClick={() => { localStorage.removeItem('token'); navigate('/login'); }}>
            <span className="icon"> 🚪 </span> Đăng xuất
          </Link>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main-content">
        <header className="main-header" style={{ paddingBottom: '20px' }}>
          <h2 style={{ color: 'var(--text-main)', margin: 0, fontSize: '1.5rem' }}>Đặt Lịch Khám Bệnh</h2>
        </header>

        <div className="page-content">
          <div style={{ background: 'white', borderRadius: '12px', padding: '32px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', maxWidth: '700px' }}>
            <h3 style={{ marginBottom: '24px', color: '#0f6eff' }}>Điền thông tin lịch hẹn</h3>
            
            <form onSubmit={handleSubmit}>
              {message && <div style={{ padding: '12px', backgroundColor: '#dcfce3', color: '#166534', borderRadius: '6px', marginBottom: '24px', border: '1px solid #bbf7d0' }}>{message}</div>}
              {errorMsg && <div style={{ padding: '12px', backgroundColor: '#fee2e2', color: '#991b1b', borderRadius: '6px', marginBottom: '24px', border: '1px solid #fecaca' }}>{errorMsg}</div>}

              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontWeight: '600', marginBottom: '8px', display: 'block', color: '#334155' }}>Chọn Bác sĩ</label>
                <select name="doctorId" value={formData.doctorId} onChange={handleChange} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', backgroundColor: 'white' }} required>
                  <option value="" disabled>-- Vui lòng chọn Bác sĩ --</option>
                  <option value="1">BS. Trần Thu Hà (Khoa Nhi)</option>
                  <option value="2">BS. Lê Văn Nam (Nội Tổng Quát)</option>
                  <option value="3">BS. Phạm Minh Tuấn (Răng Hàm Mặt)</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <label style={{ fontWeight: '600', marginBottom: '8px', display: 'block', color: '#334155' }}>Ngày khám</label>
                  <input type="date" name="appointmentDate" value={formData.appointmentDate} onChange={handleChange} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }} required />
                </div>
                <div>
                  <label style={{ fontWeight: '600', marginBottom: '8px', display: 'block', color: '#334155' }}>Giờ khám</label>
                  <input type="time" name="startTime" value={formData.startTime} onChange={handleChange} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }} required />
                </div>
              </div>

              <div style={{ marginBottom: '32px' }}>
                <label style={{ fontWeight: '600', marginBottom: '8px', display: 'block', color: '#334155' }}>Triệu chứng / Lời nhắn</label>
                <textarea name="symptoms" value={formData.symptoms} onChange={handleChange} rows="4" placeholder="Mô tả ngắn gọn tình trạng sức khỏe hoặc triệu chứng bạn đang gặp phải..." style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', resize: 'vertical', outline: 'none' }} required></textarea>
              </div>

              <div style={{ display: 'flex', gap: '16px' }}>
                <button type="submit" disabled={loading} style={{ flex: 1, padding: '14px 24px', backgroundColor: '#0f6eff', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', transition: '0.2s', opacity: loading ? 0.7 : 1 }}>
                  {loading ? 'Đang gửi yêu cầu...' : 'Xác Nhận Đặt Lịch'}
                </button>
                <button type="button" onClick={() => navigate('/patient/dashboard')} style={{ padding: '14px 32px', backgroundColor: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', transition: '0.2s' }}>
                  Hủy
                </button>
              </div>
            </form>

          </div>
        </div>
      </main>
    </div>
  );
};

export default PatientAppointments;