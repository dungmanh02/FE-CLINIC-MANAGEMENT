import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createDoctorAPI } from '../../services/adminService';
import '../../style/base.css';
// Bạn có thể tạo thêm file admin.css nếu cần, hoặc dùng tạm base.css

const AdminCreateDoctor = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Khởi tạo state chứa đủ 10 trường theo chuẩn Swagger
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    fullName: '',
    phone: '',
    email: '',
    gender: 'MALE', // Giá trị mặc định
    dateOfBirth: '',
    departmentId: '', // Sẽ ép kiểu số khi gửi
    specialization: '',
    experienceYears: '' // Sẽ ép kiểu số khi gửi
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setErrorMsg('');

    try {
      // Đóng gói và ép kiểu dữ liệu chuẩn xác 100% theo Backend yêu cầu
      const submitData = {
        ...formData,
        departmentId: parseInt(formData.departmentId), // Ép sang số nguyên
        experienceYears: parseInt(formData.experienceYears) // Ép sang số nguyên
      };

      await createDoctorAPI(submitData);
      
      setMessage('🎉 Chúc mừng! Đã thêm bác sĩ mới thành công vào hệ thống.');
      // Xóa trắng form sau khi thêm thành công
      setFormData({
        username: '', password: '', fullName: '', phone: '', email: '', 
        gender: 'MALE', dateOfBirth: '', departmentId: '', specialization: '', experienceYears: ''
      });

    } catch (error) {
      console.error("Lỗi tạo bác sĩ:", error);
      if (error.response && error.response.data) {
        setErrorMsg(error.response.data.message || 'Thêm bác sĩ thất bại. Vui lòng kiểm tra lại thông tin.');
      } else {
        setErrorMsg('Không thể kết nối đến máy chủ. Hoặc bạn không có quyền Admin!');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container" style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      
      {/* Tạm thời để 1 cái Sidebar đơn giản cho Admin, sau này bạn có thể tách ra Component riêng */}
      <aside className="sidebar" style={{ width: '260px', backgroundColor: 'white', padding: '20px', borderRight: '1px solid #e2e8f0' }}>
        <div className="logo" style={{ marginBottom: '40px', fontSize: '1.5rem', fontWeight: 'bold' }}>
          <span style={{ color: '#0f6eff' }}>Medi</span>Pro <span style={{ fontSize: '1rem', color: '#ef4444' }}>ADMIN</span>
        </div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
           <div style={{ padding: '12px', background: '#eff6ff', color: '#0f6eff', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>➕ Thêm Bác Sĩ</div>
           <div onClick={() => { localStorage.removeItem('token'); navigate('/login'); }} style={{ padding: '12px', color: '#64748b', cursor: 'pointer', marginTop: 'auto' }}>🚪 Đăng xuất</div>
        </nav>
      </aside>

      <main style={{ flex: 1, padding: '40px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', background: 'white', padding: '32px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
          <h2 style={{ margin: '0 0 24px 0', color: '#1e293b' }}>Tạo Hồ Sơ Bác Sĩ Mới</h2>
          
          {message && <div style={{ padding: '16px', backgroundColor: '#dcfce3', color: '#166534', borderRadius: '8px', marginBottom: '24px' }}>{message}</div>}
          {errorMsg && <div style={{ padding: '16px', backgroundColor: '#fee2e2', color: '#991b1b', borderRadius: '8px', marginBottom: '24px' }}>{errorMsg}</div>}

          <form onSubmit={handleSubmit}>
            
            <h4 style={{ color: '#0f6eff', borderBottom: '2px solid #eff6ff', paddingBottom: '8px', marginBottom: '20px' }}>1. Thông tin tài khoản</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '32px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#475569' }}>Tên đăng nhập *</label>
                <input type="text" name="username" value={formData.username} onChange={handleChange} required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#475569' }}>Mật khẩu *</label>
                <input type="password" name="password" value={formData.password} onChange={handleChange} required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
              </div>
            </div>

            <h4 style={{ color: '#0f6eff', borderBottom: '2px solid #eff6ff', paddingBottom: '8px', marginBottom: '20px' }}>2. Thông tin cá nhân</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '32px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#475569' }}>Họ và tên *</label>
                <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#475569' }}>Email *</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#475569' }}>Số điện thoại *</label>
                <input type="text" name="phone" value={formData.phone} onChange={handleChange} required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#475569' }}>Ngày sinh *</label>
                <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#475569' }}>Giới tính</label>
                <select name="gender" value={formData.gender} onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: 'white' }}>
                  <option value="MALE">Nam</option>
                  <option value="FEMALE">Nữ</option>
                  <option value="OTHER">Khác</option>
                </select>
              </div>
            </div>

            <h4 style={{ color: '#0f6eff', borderBottom: '2px solid #eff6ff', paddingBottom: '8px', marginBottom: '20px' }}>3. Thông tin chuyên môn</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '32px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#475569' }}>Phòng khoa (ID) *</label>
                <input type="number" name="departmentId" value={formData.departmentId} onChange={handleChange} required placeholder="Ví dụ: 1" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#475569' }}>Số năm kinh nghiệm *</label>
                <input type="number" name="experienceYears" value={formData.experienceYears} onChange={handleChange} required placeholder="Ví dụ: 5" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#475569' }}>Chuyên môn / Học vị *</label>
                <input type="text" name="specialization" value={formData.specialization} onChange={handleChange} required placeholder="Ví dụ: Thạc sĩ, Chuyên khoa II..." style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
              </div>
            </div>

            <button type="submit" disabled={loading} style={{ width: '100%', padding: '14px', backgroundColor: '#0f6eff', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer', opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Đang tạo dữ liệu...' : 'Xác Nhận Tạo Bác Sĩ'}
            </button>
          </form>

        </div>
      </main>
    </div>
  );
};

export default AdminCreateDoctor;