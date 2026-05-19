import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { resetPasswordAPI } from './services/authService';
import './style/base.css'; // Dùng lại CSS của trang Login cho đẹp

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setErrorMsg('');
    setLoading(true);

    try {
      // Gọi API reset mật khẩu
      await resetPasswordAPI(email);
      setMessage('Yêu cầu thành công! Vui lòng kiểm tra email của bạn để lấy lại mật khẩu.');
      setEmail(''); // Xóa trắng ô nhập
    } catch (error) {
      console.error("Reset Password Error:", error);
      if (error.response && error.response.data) {
        setErrorMsg(error.response.data.message || 'Không thể gửi email. Vui lòng kiểm tra lại địa chỉ email!');
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
        <h2>Quên Mật Khẩu</h2>
        <p style={{ textAlign: 'center', color: '#475569', marginBottom: '20px', fontSize: '0.95rem' }}>
          Nhập địa chỉ email bạn đã đăng ký, chúng tôi sẽ gửi hướng dẫn đặt lại mật khẩu cho bạn.
        </p>
        
        {message && <p className="error-text" style={{ color: 'green', fontWeight: 'bold' }}>{message}</p>}
        {errorMsg && <p className="error-text" style={{ color: 'red' }}>{errorMsg}</p>}

        <div className="input-group">
          <label>Email của bạn</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Ví dụ: example@gmail.com"
            required
          />
        </div>

        <button type="submit" className="btn-login" disabled={loading}>
          {loading ? 'Đang gửi email...' : 'Gửi Yêu Cầu'}
        </button>

        <p className="auth-footer">
          Nhớ lại mật khẩu? <Link to="/login">Quay lại đăng nhập</Link>
        </p>
      </form>
    </div>
  );
};

export default ForgotPassword;