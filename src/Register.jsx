import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerAPI } from './services/authService';
import './style/base.css'; 

const Register = () => {
  const navigate = useNavigate();
  
  // Khởi tạo state khớp 100% với các trường trong RegisterRequest.java
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    fullName: '', 
    phone: '',
    email: '',
    gender: 'MALE', 
    dateOfBirth: ''
  });

  // 🚀 THÊM STATE CHO XÁC NHẬN MẬT KHẨU VÀ CON MẮT
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Xử lý thay đổi dữ liệu trong form
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Xử lý khi submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    // 🚀 BẮT LỖI NGAY: Nếu 2 ô mật khẩu không giống nhau thì không cho gửi đi
    if (formData.password !== confirmPassword) {
      setErrorMsg('Mật khẩu và Xác nhận mật khẩu không khớp nhau!');
      return;
    }

    setLoading(true);
    try {
      // Chuẩn bị dữ liệu gửi đi (loại bỏ dateOfBirth nếu người dùng không chọn)
      const submitData = { ...formData };
      if (!submitData.dateOfBirth) {
        delete submitData.dateOfBirth;
      }
      
      // 1. Gọi API đăng ký
      await registerAPI(submitData);
      
      // 2. Nếu thành công, thông báo nhắc check mail và điều hướng THẲNG về trang Đăng nhập
      alert('Đăng ký tài khoản thành công! Vui lòng kiểm tra hộp thư email để xác thực tài khoản trước khi đăng nhập.');
      navigate('/login');
      
    } catch (error) {
      console.error("Registration Error:", error);
      
      // Bắt lỗi chi tiết từ Quarkus trả về
      if (error.response && error.response.data) {
        const violations = error.response.data.violations;
        
        if (violations && violations.length > 0) {
          setErrorMsg(violations[0].message); 
        } else {
          const beMessage = error.response.data.message || error.response.data.details || 'Đăng ký thất bại. Vui lòng kiểm tra lại thông tin.';
          setErrorMsg(beMessage);
        }
      } else {
        setErrorMsg('Không thể kết nối đến máy chủ. Vui lòng thử lại sau.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Tạo Tài Khoản MediPro</h2>
        
        {errorMsg && (
          <p className="error-text" style={{ color: 'red', textAlign: 'center', marginBottom: '15px', fontSize: '0.9rem', padding: '10px', background: '#fee2e2', borderRadius: '8px' }}>
            {errorMsg}
          </p>
        )}

        <div className="input-group">
          <label>Họ và tên</label>
          <input
            type="text"
            name="fullName"
            placeholder="Ví dụ: Nguyễn Chí Minh"
            value={formData.fullName}
            onChange={handleChange}
            required
            maxLength={150}
          />
        </div>

        <div className="input-group">
          <label>Tên đăng nhập</label>
          <input
            type="text"
            name="username"
            placeholder="Tối thiểu 4 ký tự"
            value={formData.username}
            onChange={handleChange}
            required
            minLength={4}
            maxLength={50}
          />
        </div>

        <div className="input-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="example@gmail.com"
            value={formData.email}
            onChange={handleChange}
            required
            maxLength={100}
          />
        </div>

        <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
          <div className="input-group" style={{ flex: 1, marginBottom: 0 }}>
            <label>Số điện thoại</label>
            <input
              type="tel"
              name="phone"
              placeholder="0990012345"
              value={formData.phone}
              onChange={handleChange}
              maxLength={10}
            />
          </div>
          
          <div className="input-group" style={{ flex: 1, marginBottom: 0 }}>
            <label>Ngày sinh</label>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              style={{ width: '100%', padding: '12px 16px', borderRadius: '40px', border: '1px solid #e2e8f0', fontFamily: 'Inter' }}
            />
          </div>
        </div>

        <div className="input-group">
          <label>Giới tính</label>
          <select 
            name="gender" 
            value={formData.gender} 
            onChange={handleChange} 
            required
            style={{ width: '100%', padding: '12px 16px', borderRadius: '40px', border: '1px solid #e2e8f0', fontFamily: 'Inter', outline: 'none' }}
          >
            <option value="MALE">Nam</option>
            <option value="FEMALE">Nữ</option>
            <option value="OTHER">Khác</option>
          </select>
        </div>

        {/* 🚀 CẬP NHẬT: Mật khẩu có mắt xem */}
        <div className="input-group">
          <label>Mật khẩu</label>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Gồm chữ hoa, thường, số & ký tự đặc biệt"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={8}
              style={{ width: '100%', paddingRight: '40px', boxSizing: 'border-box' }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{ position: 'absolute', right: '10px', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '18px', padding: '0', outline: 'none', color: '#64748b' }}
              title={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
            >
              {showPassword ? '👁️' : '🙈'}
            </button>
          </div>
        </div>

        {/* 🚀 THÊM MỚI: Ô Xác nhận mật khẩu có mắt xem */}
        <div className="input-group">
          <label>Xác nhận mật khẩu</label>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Nhập lại mật khẩu"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={8}
              style={{ width: '100%', paddingRight: '40px', boxSizing: 'border-box' }}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              style={{ position: 'absolute', right: '10px', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '18px', padding: '0', outline: 'none', color: '#64748b' }}
              title={showConfirmPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
            >
              {showConfirmPassword ? '👁️' : '🙈'}
            </button>
          </div>
        </div>

        <button type="submit" className="btn-login" disabled={loading} style={{ marginTop: '10px' }}>
          {loading ? 'Đang tạo tài khoản...' : 'Đăng Ký Ngay'}
        </button>
        
        <p className="auth-footer">
          Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;