import axios from 'axios';

const api = axios.create({
    baseURL: 'https://clinic-management-rfez.onrender.com/api/v1', 
    headers: {
        'Content-Type': 'application/json',
    }
});
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// 🚀 THÊM ĐOẠN NÀY: Bộ tự động đánh chặn phản hồi từ Backend (Response Interceptor)
api.interceptors.response.use(
  (response) => {
    // Nếu API chạy thành công ổn định thì cứ cho đi qua bình thường
    return response;
  },
  (error) => {
    // Nếu Backend trả về lỗi 401 (Hết hạn token / Token fake)
    if (error.response && error.response.status === 401) {
      console.warn("Cảnh báo: Token hết hạn hoặc không hợp lệ! Tự động dọn rác localStorage...");
      
      localStorage.removeItem('token'); // 🧼 Xóa sạch token "bóng ma" ngay lập tức

      // Nếu người dùng đang ở các trang Dashboard bên trong mà bị hết hạn token, đá ngay họ ra trang Login
      const currentPath = window.location.pathname;
      if (currentPath !== '/login' && currentPath !== '/forgot-password' && currentPath !== '/register') {
        alert('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại!');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);
export default api;