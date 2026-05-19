import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCurrentUserAPI, updateProfileAPI, uploadAvatarAPI } from '../../services/authService';
import '../../style/base.css';
import '../../style/patient.css';

const PatientProfile = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null); // Dùng để móc vào thẻ input type="file" bị ẩn
  
  const [loading, setLoading] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [message, setMessage] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Trạng thái riêng cho ảnh đại diện
  const [avatarUrl, setAvatarUrl] = useState("https://api.dicebear.com/8.x/avataaars/svg?seed=PatientHappy&backgroundColor=0f6eff");

  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    email: '',
    phone: '',
    gender: 'MALE',
    dateOfBirth: ''
  });

  // Tải dữ liệu ban đầu
  useEffect(() => {
    const loadProfileData = async () => {
      try {
        const response = await getCurrentUserAPI();
        const userData = response.data.data || response.data;
        if (userData) {
          setFormData({
            username: userData.username || '',
            fullName: userData.fullName || '',
            email: userData.email || '', 
            phone: userData.phone || '',
            gender: userData.gender || 'MALE',
            dateOfBirth: userData.dateOfBirth || ''
          });
          // Cập nhật ảnh đại diện nếu Backend có trả về (Nếu trường tên là avatarUrl)
          if (userData.avatarUrl) {
            setAvatarUrl(userData.avatarUrl);
          }
        }
      } catch (error) {
        console.error("Lỗi tải thông tin hồ sơ:", error);
      }
    };
    loadProfileData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 1. Hàm xử lý Cập nhật thông tin text (Tên, ngày sinh...)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setErrorMsg('');

    try {
      const submitData = {
        fullName: formData.fullName,
        phone: formData.phone,
        gender: formData.gender,
        dateOfBirth: formData.dateOfBirth
      };

      await updateProfileAPI(submitData);
      setMessage('🎉 Cập nhật thông tin hồ sơ thành công!');
    } catch (error) {
      console.error("Lỗi cập nhật:", error);
      if (error.response && error.response.data) {
        setErrorMsg(error.response.data.message || 'Cập nhật thất bại. Vui lòng kiểm tra lại dữ liệu.');
      } else {
        setErrorMsg('Không thể kết nối đến máy chủ.');
      }
    } finally {
      setLoading(false);
    }
  };

  // 2. Hàm xử lý Upload Avatar ngay khi chọn ảnh xong
  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Hiển thị ảnh vừa chọn lên màn hình ngay lập tức cho mượt (Preview)
    const localImageUrl = URL.createObjectURL(file);
    setAvatarUrl(localImageUrl);

    // Đóng gói file vào FormData để gửi lên Backend
    const uploadData = new FormData();
    uploadData.append('file', file); // Chữ 'file' này phải khớp 100% với tên biến trên Swagger

    setUploadingAvatar(true);
    setMessage('');
    setErrorMsg('');

    try {
      await uploadAvatarAPI(uploadData);
      setMessage('📸 Thay đổi ảnh đại diện thành công!');
    } catch (error) {
      console.error("Lỗi tải ảnh lên:", error);
      setErrorMsg('Không thể tải ảnh lên. Vui lòng thử lại.');
    } finally {
      setUploadingAvatar(false);
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
          <Link to="/patient/profile" className="nav-item active">
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
          <h2 style={{ color: 'var(--text-main)', margin: 0, fontSize: '1.5rem' }}>Thiết Lập Hồ Sơ</h2>
        </header>

        <div className="page-content">
          <div style={{ background: 'white', borderRadius: '12px', padding: '32px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', maxWidth: '900px' }}>
            
            {/* KHU VỰC AVATAR (Có thể click để đổi ảnh) */}
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '32px', paddingBottom: '24px', borderBottom: '1px solid #e2e8f0' }}>
              
              {/* Vùng chứa ảnh, bọc thẻ input file bị ẩn bên trong */}
              <div 
                style={{ position: 'relative', cursor: 'pointer', marginRight: '20px' }} 
                onClick={() => fileInputRef.current.click()} // Click vào vùng này sẽ tự động kích hoạt thẻ input file
                title="Click để đổi ảnh đại diện"
              >
                <img 
                  src={avatarUrl} 
                  alt="Avatar" 
                  style={{ width: '80px', height: '80px', borderRadius: '50%', border: '2px solid #0f6eff', objectFit: 'cover', opacity: uploadingAvatar ? 0.5 : 1 }}
                />
                <input 
                  type="file" 
                  accept="image/*" 
                  style={{ display: 'none' }} // Ẩn nút "Choose File" xấu xí đi
                  ref={fileInputRef} 
                  onChange={handleAvatarChange} // Gọi hàm ngay khi chọn ảnh xong
                />
                {/* Nút giả lập hiệu ứng báo cho người dùng biết có thể bấm vào */}
                <div style={{ position: 'absolute', bottom: '-4px', left: '50%', transform: 'translateX(-50%)', background: '#0f6eff', color: 'white', fontSize: '0.65rem', padding: '2px 8px', borderRadius: '10px', fontWeight: 'bold', whiteSpace: 'nowrap' }}>
                  {uploadingAvatar ? 'Đang tải...' : 'Đổi ảnh'}
                </div>
              </div>

              <div>
                <h3 style={{ margin: '0 0 8px 0', color: '#1e293b', fontSize: '1.4rem' }}>{formData.fullName || 'Đang tải...'}</h3>
                <p style={{ margin: 0, color: '#64748b', fontSize: '0.95rem' }}>
                  Tên đăng nhập: <strong style={{ color: '#0f6eff' }}>{formData.username || formData.email || '...'}</strong>
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              {message && <div style={{ padding: '12px', backgroundColor: '#dcfce3', color: '#166534', borderRadius: '6px', marginBottom: '24px', border: '1px solid #bbf7d0' }}>{message}</div>}
              {errorMsg && <div style={{ padding: '12px', backgroundColor: '#fee2e2', color: '#991b1b', borderRadius: '6px', marginBottom: '24px', border: '1px solid #fecaca' }}>{errorMsg}</div>}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <div>
                  <label style={{ fontWeight: '600', marginBottom: '8px', display: 'block', color: '#334155' }}>Họ và tên</label>
                  <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }} required />
                </div>
                <div>
                  <label style={{ fontWeight: '600', marginBottom: '8px', display: 'block', color: '#334155' }}>Địa chỉ Email <span style={{ color: '#ef4444', fontSize: '0.85rem', fontWeight: 'normal' }}>(Không thể đổi)</span></label>
                  <input type="email" name="email" value={formData.email} disabled style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#f1f5f9', color: '#94a3b8', cursor: 'not-allowed' }} />
                </div>
                <div>
                  <label style={{ fontWeight: '600', marginBottom: '8px', display: 'block', color: '#334155' }}>Số điện thoại</label>
                  <input type="text" name="phone" value={formData.phone} onChange={handleChange} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }} required />
                </div>
                <div>
                  <label style={{ fontWeight: '600', marginBottom: '8px', display: 'block', color: '#334155' }}>Ngày sinh</label>
                  <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }} required />
                </div>
                <div>
                  <label style={{ fontWeight: '600', marginBottom: '8px', display: 'block', color: '#334155' }}>Giới tính</label>
                  <select name="gender" value={formData.gender} onChange={handleChange} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', backgroundColor: 'white' }}>
                    <option value="MALE">Nam</option>
                    <option value="FEMALE">Nữ</option>
                    <option value="OTHER">Khác</option>
                  </select>
                </div>
              </div>

              <div style={{ marginTop: '40px', display: 'flex', gap: '16px' }}>
                <button type="submit" disabled={loading} style={{ padding: '12px 32px', backgroundColor: '#0f6eff', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', transition: '0.2s', opacity: loading ? 0.7 : 1 }}>
                  {loading ? 'Đang lưu...' : 'Lưu Thay Đổi'}
                </button>
                <button type="button" onClick={() => navigate('/patient/dashboard')} style={{ padding: '12px 32px', backgroundColor: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', transition: '0.2s' }}>
                  Quay lại
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PatientProfile;