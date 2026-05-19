import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { changePasswordAPI } from './services/authService';
import './style/base.css'; 

const ChangePassword = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    // 1. Kiểm tra mật khẩu trùng khớp ở Frontend trước
    if (formData.newPassword !== formData.confirmPassword) {
      setErrorMsg('Mật khẩu xác nhận không khớp!');
      return;
    }

    setLoading(true);
    try {
      // 2. Đóng gói dữ liệu đúng khớp 100% với Schema của Swagger
      const requestBody = {
        password: formData.newPassword,
        confirmPassword: formData.confirmPassword
      };

      // 3. Gọi API gửi lên Quarkus
      await changePasswordAPI(requestBody);
      
      alert('Đổi mật khẩu thành công! Vui lòng đăng nhập lại với mật khẩu mới của bạn.');
      
      // Xóa token tạm thời đi để bắt người dùng đăng nhập lại bằng mật khẩu mới cho an toàn
      localStorage.removeItem('token'); 
      navigate('/login');

    } catch (error) {
      console.error("Change Password Error:", error);
      if (error.response && error.response.data) {
        // Bắt lỗi Validation từ Backend (Ví dụ: mật khẩu mới quá yếu không đủ điều kiện)
        const violations = error.response.data.violations;
        if (violations && violations.length > 0) {
          setErrorMsg(violations[0].message);
        } else {
          setErrorMsg(error.response.data.message || 'Đổi mật khẩu thất bại. Vui lòng thử lại!');
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
        <h2>Bảo Mật Tài Khoản</h2>
        <p style={{ textAlign: 'center', color: '#dc2626', marginBottom: '20px', fontSize: '0.9rem', fontWeight: 'bold' }}>
          * Vui lòng đổi mật khẩu mới ngay lập tức để bảo vệ tài khoản của bạn.
        </p>
        
        {errorMsg && <p className="error-text" style={{ color: 'red' }}>{errorMsg}</p>}

        <div className="input-group">
          <label>Mật khẩu mới</label>
          <input
            type="password"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            placeholder="Tối thiểu 8 ký tự, gồm chữ và số..."
            required
          />
        </div>

        <div className="input-group">
          <label>Xác nhận mật khẩu mới</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Nhập lại mật khẩu mới..."
            required
          />
        </div>

        <button type="submit" className="btn-login" disabled={loading}>
          {loading ? 'Đang cập nhật...' : 'Đổi Mật Khẩu'}
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;