import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from "./utils/api";
import './style/verify.css';

const VerifyAccount = () => {
  const [searchParams] = useSearchParams();
  
  const token = searchParams.get('token'); 
  
  const [status, setStatus] = useState('waiting_for_email'); 

  useEffect(() => {
    if (token) {
      setStatus('pending'); 
      
      const verifyEmailAPI = async () => {
        try {
          await api.get(`/auth/verify-email?token=${token}`);
          setStatus('success'); 
        } catch (error) {
          console.error("Lỗi xác thực:", error);
          setStatus('error'); 
        }
      };
      
      verifyEmailAPI();
    } else {

      setStatus('waiting_for_email');
    }
  }, [token]);

  return (
    <div className="verify-wrapper">
      <div className="verify-card">
        
        {/* TRẠNG THÁI 1: Yêu cầu người dùng đi check email */}
        {status === 'waiting_for_email' && (
          <>
            <div className="verify-icon email"> ✉️ </div>
            <h1>Kiểm tra Email của bạn</h1>
            <p>
              Chúng tôi đã gửi một đường dẫn xác thực đến email của bạn. 
              Vui lòng kiểm tra hộp thư đến (hoặc thư mục Spam) và click vào link để kích hoạt tài khoản.
            </p>
            <Link to="/login" className="btn-verify secondary">
              Quay lại Đăng nhập
            </Link>
          </>
        )}

        {/* TRẠNG THÁI 2: Đang tải dữ liệu gọi API */}
        {status === 'pending' && (
          <>
            <div className="verify-icon loading"> ⏳ </div>
            <h1>Đang xác thực...</h1>
            <p>Vui lòng đợi trong giây lát, hệ thống đang kiểm tra mã xác thực của bạn.</p>
          </>
        )}

        {/* TRẠNG THÁI 3: Xác thực thành công */}
        {status === 'success' && (
          <>
            <div className="verify-icon success"> ✓ </div>
            <h1>Xác thực thành công!</h1>
            <p>
              Tuyệt vời! Địa chỉ email của bạn đã được xác minh.
              Tài khoản MediPro của bạn hiện đã được kích hoạt hoàn toàn.
            </p>
            <Link to="/login" className="btn-verify">
              Đăng nhập ngay
            </Link>
          </>
        )}

        {/* TRẠNG THÁI 4: Xác thực thất bại */}
        {status === 'error' && (
          <>
            <div className="verify-icon error"> ✕ </div>
            <h1>Xác thực thất bại</h1>
            <p>
              Đường dẫn xác thực không hợp lệ hoặc đã hết hạn.
              Vui lòng kiểm tra lại email hoặc đăng ký lại tài khoản mới.
            </p>
            <Link to="/register" className="btn-verify secondary">
              Quay lại trang Đăng ký
            </Link>
          </>
        )}

      </div>
    </div>
  );
};

export default VerifyAccount;