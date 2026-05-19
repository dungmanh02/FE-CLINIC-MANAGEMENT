import React from 'react';
import "./style/base.css";
import "./style/components.css";
import "./style/landing.css";
import { Link } from 'react-router-dom';

const Index = () => {
  // Hàm xử lý sự kiện click demo (chuyển từ script cũ sang hàm React)
  const handleDemoClick = (e) => {
    e.preventDefault();
    alert("🚀 MediPro Demo: Trải nghiệm quản lý y tế thông minh sắp ra mắt! Liên hệ để dùng thử.");
  };

  return (
    <div className="landing-body">
      <header className="landing-header">
        <div className="logo">
          <span className="logo-icon">✚</span>
          <span className="logo-text">Medi<span className="text-primary">Pro</span></span>
        </div>
      <div className="cta-group" style={{ display: 'flex', gap: '12px' }}>
    <Link to="/login" className="btn-action secondary">Đăng nhập</Link>
    <Link to="/register" className="btn-action">Tham gia ngay</Link>
</div>
      </header>

      <section className="hero-section">
        <div className="hero-content">
          <h1>Giải pháp <span className="text-primary">Y tế số</span> cho phòng khám hiện đại.</h1>
          <p>Tối ưu hóa quy trình khám chữa bệnh, quản lý lịch hẹn và hồ sơ bệnh nhân chỉ trên một nền tảng tập trung.</p>
          <div className="cta-group" style={{ display: 'flex', gap: '20px', marginTop: '8px' }}>
            <a href="/register" className="btn-hero">Bắt đầu miễn phí →</a>
          </div>
        </div>
        <div className="hero-image">
          <img 
            src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1000&q=80" 
            alt="Bác sĩ sử dụng công nghệ y tế hiện đại" 
          />
        </div>
      </section>

      <section className="intro-section">
        <span className="section-tag">Tại sao chọn chúng tôi?</span>
        <h2 className="section-title">Nâng tầm trải nghiệm khám chữa bệnh</h2>
        
        <div className="features-grid">
          {/* Thêm transition trực tiếp vào style hoặc tốt nhất là bạn nên thêm 'transition: all 0.3s ease;' vào class .feature-card trong file CSS */}
          <div className="feature-card" style={{ transition: 'all 0.3s ease' }}>
            <div className="feature-icon-box">📅</div>
            <h3>Lịch hẹn thông minh</h3>
            <p>Tự động nhắc lịch và sắp xếp ca khám một cách khoa học, giảm thiểu thời gian chờ đợi, tối ưu hóa nguồn lực phòng khám.</p>
          </div>
          
          <div className="feature-card" style={{ transition: 'all 0.3s ease' }}>
            <div className="feature-icon-box">📁</div>
            <h3>Hồ sơ số hóa</h3>
            <p>Bệnh án điện tử được bảo mật và truy xuất tức thì, giúp bác sĩ chẩn đoán chính xác hơn, đồng bộ dữ liệu mọi lúc.</p>
          </div>
          
          <div className="feature-card" style={{ transition: 'all 0.3s ease' }}>
            <div className="feature-icon-box">📈</div>
            <h3>Báo cáo chuyên sâu</h3>
            <p>Theo dõi doanh thu, số lượng bệnh nhân và hiệu suất phòng khám theo thời gian thực, đưa ra quyết định chiến lược dễ dàng.</p>
          </div>
        </div>
      </section>

      <footer>
        <p>&copy; 2026 MediPro Ecosystem. Designed by <span className="text-primary">Giàng Seo Chính - HaUI</span>.</p>
      </footer>
    </div>
  );
};

export default Index;